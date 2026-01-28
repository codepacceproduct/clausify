import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { mapAsaasStatus, updateSubscription } from "@/lib/billing"

// 🚨 REGRA CRÍTICA: Runtime Node.js obrigatório
export const runtime = "nodejs";

// Evitar erro 405 Method Not Allowed em outros métodos
export async function GET() { return NextResponse.json({ status: "active" }, { status: 200 }); }
export async function HEAD() { return new NextResponse(null, { status: 200 }); }
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: { "Allow": "POST, GET, HEAD, OPTIONS" } }); }

// Configuração
const ASAAS_WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN || ""

export async function POST(req: Request) {
  try {
    const accessToken = req.headers.get("asaas-access-token")

    // Validação de Token (se configurado)
    if (ASAAS_WEBHOOK_TOKEN && accessToken !== ASAAS_WEBHOOK_TOKEN) {
         // Em produção, rejeitar tokens inválidos
         // Mas retornar 200/204 para evitar retry infinito do Asaas se for erro de config
         console.error("Webhook ASAAS: Token inválido");
         return NextResponse.json({ received: true, error: "Unauthorized" }, { status: 200 })
    }

    const payload = await req.json()
    console.log("Webhook ASAAS recebido:", payload.event)

    const event = payload.event
    const paymentData = payload.payment
    
    // REGRA DE OURO: Apenas PAYMENT_RECEIVED/CONFIRMED altera status de assinatura
    // Ignorar explicitamente eventos de criação/pendência para evitar conflitos
    if (event === 'PAYMENT_CREATED' || event === 'PAYMENT_PENDING' || event === 'PAYMENT_UPDATED') {
        console.log(`[Webhook ASAAS] Evento informativo ignorado para lógica de assinatura: ${event}`);
        // Podemos atualizar o status do pagamento no banco, mas NÃO tocar na assinatura
        // return NextResponse.json({ received: true, ignored: true }); 
        // Vamos deixar passar para atualizar a tabela 'payments', mas bloquear o updateSubscription lá embaixo
    }
    
    // Inicializar Supabase Admin
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Tratamento de Eventos de Assinatura (SUBSCRIPTION_*)
    // SUBSCRIPTION_ACTIVE, SUBSCRIPTION_INACTIVE (mapeado de canceled/deleted)
    if (event.startsWith('SUBSCRIPTION_')) {
        const subData = payload.subscription; 
        
        if (payload.subscription) {
            const asaasSubId = payload.subscription.id;
            let subStatus = 'active';
            
            if (event === 'SUBSCRIPTION_CREATED') {
                subStatus = 'pending';
            } else if (event === 'SUBSCRIPTION_DELETED' || event === 'SUBSCRIPTION_CANCELED') {
                subStatus = 'canceled';
            } else if (event === 'SUBSCRIPTION_OVERDUE') {
                 subStatus = 'past_due';
            }
            // SUBSCRIPTION_ACTIVE -> active
            // SUBSCRIPTION_UPDATED -> active (usually)

            // Atualizar status no banco
            await supabaseAdmin
                .from('subscriptions')
                .update({ 
                    status: subStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('external_subscription_id', asaasSubId);
                
            return NextResponse.json({ received: true, type: 'subscription_update' });
        }
    }

    // 2. Tratamento de Eventos de Pagamento (PAYMENT_*)
    // PAYMENT_CONFIRMED, PAYMENT_OVERDUE
    if (!paymentData || !paymentData.id) {
        return NextResponse.json({ received: true })
    }

    const externalId = paymentData.id
    const asaasSubscriptionId = paymentData.subscription
    
    // Mapear status baseado no evento
    let status = mapAsaasStatus(event)
    
    // Se o evento for genérico (ex: CREATED), tenta pegar status atual do objeto payment
    if (status === 'pending' && paymentData.status) {
        status = mapAsaasStatus(paymentData.status)
    }

    // Buscar pagamento existente
    let { data: payment } = await supabaseAdmin
        .from("payments")
        .select('*')
        .eq("external_id", externalId)
        .single()

    // Se não existir, tentar criar/vincular
    if (!payment) {
        let orgId = null;
        let planId = null;
        
        // Estratégia 1: Tentar encontrar via external_subscription_id na tabela subscriptions
        if (asaasSubscriptionId) {
            const { data: sub } = await supabaseAdmin
                .from('subscriptions')
                .select('organization_id, plan')
                .eq('external_subscription_id', asaasSubscriptionId)
                .single();
            
            if (sub) {
                orgId = sub.organization_id;
                planId = sub.plan;
            }
        }
        
        // Estratégia 2: Fallback para externalReference
        if (!orgId) {
             const ref = paymentData.externalReference;
             if (ref) {
                 if (ref.includes('@')) {
                     const { data: profiles } = await supabaseAdmin
                        .from('profiles')
                        .select('organization_id')
                        .eq('email', ref)
                        .limit(1);
                     if (profiles && profiles.length > 0) orgId = profiles[0].organization_id;
                 } else {
                     orgId = ref;
                 }
             }
        }
        
        // Estratégia 3: Inferir plano
        if (!planId) {
             const desc = (paymentData.description || '').toLowerCase();
             planId = 'basic'; 
             if (desc.includes('pro')) planId = 'professional';
             else if (desc.includes('office') || desc.includes('enterprise')) planId = 'enterprise';
        }
        
        if (orgId) {
             const { data: newPayment, error: createError } = await supabaseAdmin
                .from('payments')
                .insert({
                    organization_id: orgId,
                    external_id: externalId,
                    amount: paymentData.value,
                    status: status,
                    method: paymentData.billingType || 'asaas',
                    plan_id: planId,
                    metadata: paymentData
                })
                .select()
                .single();
            
             if (!createError) payment = newPayment;
        }
    } else {
        // Atualizar pagamento existente
        await supabaseAdmin
            .from("payments")
            .update({ 
                status: status,
                updated_at: new Date().toISOString(),
                raw_response: payload 
            })
            .eq("external_id", externalId);
            
        // Refetch
        const { data: updated } = await supabaseAdmin.from("payments").select('*').eq("external_id", externalId).single();
        payment = updated;
    }

    if (!payment) {
        return NextResponse.json({ received: true, ignored: true, reason: 'Organization not found' })
    }

    // 3. Atualizar Assinatura baseada no status do pagamento
    if (payment.plan_id) {
        
        // REGRA CRÍTICA: Só renova assinatura se o pagamento foi REALMENTE recebido/confirmado
        // Ignora 'paid' inferido de status genéricos se o evento for 'PAYMENT_CREATED'
        const isPaymentConfirmed = event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED' || event === 'PAYMENT_RECEIVED_IN_CASH';

        if (status === "paid" && isPaymentConfirmed) {
            console.log(`[Webhook ASAAS] Pagamento ${externalId} confirmado via evento ${event}. Ativando/Renovando assinatura...`);
            
            if (asaasSubscriptionId) {
                 await supabaseAdmin
                    .from('subscriptions')
                    .update({ 
                        external_subscription_id: asaasSubscriptionId,
                        updated_at: new Date().toISOString()
                    })
                    .eq('organization_id', payment.organization_id);
            }

            await updateSubscription(supabaseAdmin, payment.organization_id, payment.plan_id);
            
        } else if (event === 'PAYMENT_OVERDUE') {
            console.log(`[Webhook ASAAS] Pagamento ${externalId} vencido.`);
            // Regra: "PAYMENT_OVERDUE → mantém plano ativo até regra de expiração"
            // "O plano só deve expirar se: O pagamento não for efetuado... ou A cobrança entrar em status de inadimplência"
            
            // Não vamos alterar para 'past_due' imediatamente se o acesso ainda for válido pela data.
            // Mas se a data expirou, o helper checkApiAccess já vai bloquear.
            // Podemos marcar status como 'past_due' para feedback visual, mas o acesso depende da data.
            
            // Vamos manter 'past_due' para indicar problema financeiro, mas o checkApiAccess permitirá acesso se data ok.
             await supabaseAdmin
                .from('subscriptions')
                .update({ 
                    status: 'past_due',
                    updated_at: new Date().toISOString()
                })
                .eq('organization_id', payment.organization_id);
        }
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error("Webhook ASAAS error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
