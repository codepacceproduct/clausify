
import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { ENV } from "@/lib/env"
import { getAsaasClient } from "@/lib/asaas"
import { mapAsaasStatus, updateSubscription } from "@/lib/billing"

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })

  const supabaseAdmin = createAdminClient(
    ENV.NEXT_PUBLIC_SUPABASE_URL!,
    ENV.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("organization_id, role")
    .eq("email", email)
    .limit(1)
  const orgId = profiles?.[0]?.organization_id
  const role = profiles?.[0]?.role
  
  if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })

  // Fetch subscription using admin client to bypass RLS
  const { data: subs } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("organization_id", orgId)
    .limit(1)
  
  let subscription = subs?.[0] || { plan: "free", status: "active" } // Default to free

  // Verificar validade da assinatura
  if (subscription.plan !== 'free' && subscription.current_period_end) {
      const expiresAt = new Date(subscription.current_period_end);
      const now = new Date();
      
      // Se já expirou
      if (expiresAt < now) {
          console.log(`[Subscription] Assinatura expirada em ${expiresAt.toISOString()}. Revertendo para Free.`);
          
          // Reverter para Free no banco
          await supabaseAdmin
            .from('subscriptions')
            .update({ 
                plan: 'free', 
                status: 'active',
                amount: 0,
                updated_at: new Date().toISOString()
            })
            .eq('organization_id', orgId);
            
          // Atualizar objeto local
          subscription.plan = 'free';
          subscription.status = 'active';
          subscription.amount = 0;
      }
  }

  // Buscar o pagamento pendente mais recente para enriquecer a resposta
  const { data: pendingPayment } = await supabaseAdmin
        .from('payments')
        .select('plan_id, status')
        .eq('organization_id', orgId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

  let pendingPlan = pendingPayment?.plan_id;

  // Fetch real payments from Asaas if customer exists
  let realPayments: any[] = [];
  try {
      if (subscription.external_subscription_id) {
          // If we have a subscription ID, try to get the customer ID from it or look up
          const asaas = getAsaasClient();
          
          // Get subscription details to find customer ID
          const subResponse = await asaas.api.get(`/subscriptions/${subscription.external_subscription_id}`);
          const customerId = subResponse.data.customer;
          
          if (customerId) {
              let payments = await asaas.listPayments(customerId);
              
              // Filtrar pagamentos estritamente vinculados
              // 1. Pagamentos com referência explícita da organização (Histórico confiável)
              // 2. Pagamentos da assinatura ATIVA atual (Garante visibilidade imediata)
              // Isso remove pagamentos avulsos, de outras assinaturas ou PIX diretos não identificados
              payments = payments.filter((p: any) => {
                  if (p.deleted) return false;
                  
                  const isExplicitlyLinked = p.externalReference === orgId;
                  const isCurrentSubscription = p.subscription && p.subscription === subscription.external_subscription_id;
                  
                  return isExplicitlyLinked || isCurrentSubscription;
              });
              
              // Verificação Ativa de Pagamento (Self-Healing)
              // Se o webhook falhou, detectamos aqui que foi pago e ativamos
              const paidPayment = payments.find((p: any) => {
                  const status = mapAsaasStatus(p.status);
                  // Debug intenso
                  console.log(`[Self-Healing] Analisando pagamento ${p.id}: Status API=${p.status} -> Mapped=${status}`);
                  return status === 'paid';
              });

              // Se achou pagamento confirmado E a assinatura local não está ativa ou está vencida
              // (ou se queremos forçar a atualização da data)
              if (paidPayment) {
                   const isLocalActive = subscription.status === 'active';
                   const isUpgradePending = pendingPlan && pendingPlan !== subscription.plan;
                   
                   // Vamos ser conservadores: Se o Asaas diz que tem pagamento CONFIRMADO/RECEBIDO recente
                   // e o status local não reflete isso (ex: pending), ativamos.
                   // Também ativamos se houver um upgrade pendente (plano diferente do atual)
                   
                   if (subscription.status !== 'active' || subscription.plan === 'free' || isUpgradePending) {
                       console.log(`[Auto-Healing] Pagamento ${paidPayment.id} detectado como PAGO na API (Status: ${paidPayment.status}). Ativando plano...`);
                       
                       // Precisamos descobrir o plano. O Asaas não retorna o 'plan slug' nosso.
                       // Usamos o pendingPlan detectado anteriormente ou description.
                       let targetPlan = pendingPlan;
                       if (!targetPlan) {
                           const desc = (paidPayment.description || '').toLowerCase();
                           targetPlan = 'basic'; 
                           
                           // Lógica de fallback melhorada para evitar falso-positivo com 'Promocional' ou 'Processo'
                           // Verifica palavras inteiras ou padrões específicos
                           if (desc.includes('professional') || desc.includes('plano pro')) {
                               targetPlan = 'professional';
                           } else if (desc.includes('office') || desc.includes('enterprise')) {
                               targetPlan = 'enterprise';
                           }
                       }
                       
                       await updateSubscription(supabaseAdmin, orgId, targetPlan);
                       
                       // Atualizar objeto subscription local para retornar correto já nesta request
                       subscription.status = 'active';
                       subscription.plan = targetPlan;
                       
                       // Atualizar também o status do pagamento na tabela payments se existir
                       await supabaseAdmin.from('payments').update({ status: 'paid' }).eq('external_id', paidPayment.id);
                       
                       // Limpar pendingPlan para que a UI mostre o plano ativo imediatamente
                       pendingPlan = undefined;
                   }
              }

              realPayments = payments.map((p: any) => {
                  // Log para debug de URLs ausentes
                  if (!p.invoiceUrl && !p.bankSlipUrl) {
                      console.warn(`[Asaas] Payment ${p.id} missing invoice URLs. Status: ${p.status}, BillingType: ${p.billingType}`);
                  }
                  
                  return {
                    id: p.id, // Asaas ID (pay_...)
                    date: p.dueDate || p.dateCreated, // Prefer dueDate for billing history
                    amount: p.value,
                    status: mapAsaasStatus(p.status),
                    method: p.billingType,
                    invoiceUrl: p.invoiceUrl || p.bankSlipUrl || p.transactionReceiptUrl,
                    metadata: {
                        invoiceUrl: p.invoiceUrl,
                        bankSlipUrl: p.bankSlipUrl,
                        transactionReceiptUrl: p.transactionReceiptUrl,
                        pixQrCode: p.pixTransaction 
                    }
                  };
              });
          }
      } else {
          // Fallback to local DB if no Asaas link
          const { data: localPayments } = await supabaseAdmin
            .from("payments")
            .select("*")
            .eq("organization_id", orgId)
            .order("created_at", { ascending: false });
          realPayments = localPayments || [];
      }
  } catch (error) {
      console.error("Error fetching Asaas payments:", error);
      // Fallback to local DB on error
      const { data: localPayments } = await supabaseAdmin
        .from("payments")
        .select("*")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false });
      realPayments = localPayments || [];
  }

  // Fetch organization billing details
  const { data: orgs } = await supabaseServer
    .from("organizations")
    .select("legal_name, tax_id, email, address_line1, city, region, postal_code")
    .eq("id", orgId)
    .limit(1)
  
  const organization: any = orgs?.[0] || {}

  // Correção de exibição de valor: Se amount for 0 mas o plano for pago, força o valor padrão
  // Isso corrige visualmente assinaturas antigas ou promocionais
  let displayAmount = subscription.amount;
  if (!displayAmount || displayAmount === 0) {
      if (subscription.plan === 'basic' || subscription.plan === 'starter') displayAmount = 99;
      if (subscription.plan === 'professional' || subscription.plan === 'pro') displayAmount = 299;
  }
  subscription.amount = displayAmount;

  return Response.json({ 
    subscription: {
        ...subscription,
        role,
        pending_plan: pendingPlan // Enviar informação do plano pendente para a UI
    }, 
    invoices: realPayments,
    billing: {
      legal_name: organization.legal_name,
      tax_id: organization.tax_id,
      email: organization.email,
      address: organization.address_line1,
      city: organization.city,
      state: organization.region,
      zip: organization.postal_code
    }
  })
}

// POST to update plan (simplified, usually involves Stripe)
export async function POST(req: Request) {
    const body = await req.json()
    const email = await getAuthedEmail(req)
    if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  
    const { data: profiles } = await supabaseServer
      .from("profiles")
      .select("organization_id, role")
      .eq("email", email)
      .limit(1)
    const orgId = profiles?.[0]?.organization_id
    const role = profiles?.[0]?.role
    
    if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })
    if (role !== "admin" && role !== "owner") return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })

    const { plan } = body
    
    // Bloquear upgrades diretos via API sem pagamento
    // Apenas permitir downgrade para free (embora DELETE seja preferível)
    if (plan !== "free") {
        return new Response(JSON.stringify({ 
            error: "payment_required", 
            message: "Upgrades de plano devem ser feitos através do fluxo de checkout (/api/checkout)." 
        }), { status: 402 })
    }

    if (!["free", "basic", "professional", "enterprise"].includes(plan)) {
        console.error("Invalid plan requested:", plan)
        return new Response(JSON.stringify({ error: "invalid_plan" }), { status: 400 })
    }
    
    // Implementar downgrade para FREE via POST se necessário, mas DELETE é o padrão REST para cancelar
    return new Response(JSON.stringify({ error: "Use DELETE to cancel subscription" }), { status: 405 })
}

export async function DELETE(req: Request) {
    const email = await getAuthedEmail(req)
    if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  
    const { data: profiles } = await supabaseServer
      .from("profiles")
      .select("organization_id, role")
      .eq("email", email)
      .limit(1)
    const orgId = profiles?.[0]?.organization_id
    const role = profiles?.[0]?.role
    
    if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })
    if (role !== "admin" && role !== "owner") return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })

    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Obter assinatura atual
    const { data: sub } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('organization_id', orgId)
        .single();

    if (!sub || sub.plan === 'free') {
        return new Response(JSON.stringify({ error: "No active subscription to cancel" }), { status: 400 });
    }

    // 2. Cancelar no Asaas (se existir ID externo)
    if (sub.external_subscription_id) {
        try {
            const asaas = getAsaasClient();
            // Tentar remover a assinatura no Asaas
            // O Asaas vai parar de gerar novas cobranças. A cobrança atual (se paga) vale até o vencimento.
            await asaas.api.delete(`/subscriptions/${sub.external_subscription_id}`);
        } catch (error: any) {
            console.error("Erro ao cancelar no Asaas:", error.response?.data || error.message);
            // Mesmo com erro, continuamos para atualizar o banco local se for erro de "não encontrado" (já cancelado)
            // Se for erro de rede, talvez devêssemos falhar? 
            // Vamos assumir que se falhar 404 é ok. Outros erros = throw?
            // Para UX, melhor garantir que cancele localmente para parar de tentar cobrar.
        }
    }

    // 3. Atualizar status local para 'canceled'
    // Mantemos o current_period_end original para que o acesso continue até o fim do ciclo pago.
    const { error } = await supabaseAdmin
        .from("subscriptions")
        .update({ 
            status: "canceled",
            updated_at: new Date().toISOString()
        })
        .eq("organization_id", orgId)

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    
    return Response.json({ 
        ok: true, 
        message: "Assinatura cancelada. O acesso permanecerá ativo até o fim do período vigente.",
        validUntil: sub.current_period_end
    })
}
