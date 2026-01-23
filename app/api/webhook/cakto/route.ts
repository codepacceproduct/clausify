import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

// Configuração
const CAKTO_WEBHOOK_SECRET = process.env.CAKTO_WEBHOOK_SECRET || process.env.CAKTO_CLIENT_SECRET || "default_secret_for_dev"

export async function POST(req: Request) {
  try {
    const bodyText = await req.text()
    
    // 1. Validação de Segurança (Assinatura/Token)
    // Recomendado para produção: Validar assinatura HMAC-SHA256
    const signature = req.headers.get("x-cakto-signature")
    const token = req.headers.get("x-cakto-token")

    // Validação de Assinatura (Se configurado o segredo)
    if (CAKTO_WEBHOOK_SECRET && CAKTO_WEBHOOK_SECRET !== "default_secret_for_dev" && signature) {
        const hmac = crypto.createHmac('sha256', CAKTO_WEBHOOK_SECRET)
        const digest = hmac.update(bodyText).digest('hex')
        
        // Comparação segura de tempo constante
        const signatureBuffer = Buffer.from(signature)
        const digestBuffer = Buffer.from(digest)
        
        if (signatureBuffer.length !== digestBuffer.length || !crypto.timingSafeEqual(signatureBuffer, digestBuffer)) {
            console.error("Webhook signature mismatch")
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
        }
    } 
    // Fallback: Validação simples por token (se assinatura não estiver disponível ou configurada)
    else if (!token && !signature) {
         if (process.env.NODE_ENV === 'production') {
             return NextResponse.json({ error: "Missing authentication headers" }, { status: 401 })
         }
    }

    const payload = JSON.parse(bodyText)
    console.log("Webhook CAKTO recebido:", payload)

    // Estrutura esperada do payload (exemplo):
    // {
    //   "event": "transaction.updated",
    //   "data": {
    //     "id": "trans_123456",
    //     "status": "paid", // pending, paid, failed, canceled
    //     "amount": 29900,
    //     "metadata": { ... }
    //   }
    // }

    const eventType = payload.event
    const transaction = payload.data
    
    if (!transaction || !transaction.id) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const externalId = transaction.id
    const status = mapCaktoStatus(transaction.status)

    // Inicializar Supabase Admin (Service Role para bypass RLS)
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 2. Atualizar tabela de pagamentos
    let { data: payment, error: paymentError } = await supabaseAdmin
        .from("payments")
        .select('*')
        .eq("external_id", externalId)
        .single()

    // Se não existir e for pago (fluxo de redirect/checkout page), tentar criar
    if (!payment && status === 'paid') {
        console.log("Pagamento não encontrado, tentando vincular por email/metadados...");
        
        // Tentar identificar organização
        let orgId = null;
        
        // Estratégia 1: UTM Content ou Metadata (se repassado)
        // A Cakto pode enviar metadados customizados se configurados na URL
        if (transaction.utm_content) {
            orgId = transaction.utm_content;
        }
        
        // Estratégia 2: Email (Fallback seguro se email for único)
        if (!orgId && transaction.customer?.email) {
            const { data: profiles } = await supabaseAdmin
                .from('profiles')
                .select('organization_id')
                .eq('email', transaction.customer.email)
                .limit(1);
                
            if (profiles && profiles.length > 0) {
                orgId = profiles[0].organization_id;
            }
        }
        
        if (orgId) {
             // Identificar plano pelo nome do produto
             let planId = 'basic'; // default
             const productName = (transaction.product?.name || transaction.description || '').toLowerCase();
             
             if (productName.includes('pro')) planId = 'professional';
             else if (productName.includes('starter') || productName.includes('basic')) planId = 'basic';
             
             const { data: newPayment, error: createError } = await supabaseAdmin
                .from('payments')
                .insert({
                    organization_id: orgId,
                    external_id: externalId,
                    amount: (transaction.amount || 0) / 100,
                    status: status,
                    method: transaction.payment_method || 'checkout',
                    plan_id: planId,
                    metadata: transaction
                })
                .select()
                .single();
                
             if (!createError) {
                 payment = newPayment;
                 console.log("Pagamento criado via webhook para org:", orgId);
             } else {
                 console.error("Erro ao criar pagamento no webhook:", createError);
             }
        } else {
            console.warn("Não foi possível identificar a organização para o pagamento:", externalId);
        }
    } else if (payment) {
        // Atualizar pagamento existente
        await supabaseAdmin
            .from("payments")
            .update({ 
                status: status,
                updated_at: new Date().toISOString(),
                raw_response: payload 
            })
            .eq("external_id", externalId);
            
        // Refetch to ensure we have latest data
        const { data: updated } = await supabaseAdmin.from("payments").select('*').eq("external_id", externalId).single();
        payment = updated;
    }

    if (!payment) {
        return NextResponse.json({ error: "Payment not found or created" }, { status: 404 })
    }

    // 3. Se aprovado, atualizar assinatura
    if (status === "paid" && payment.plan_id) {
        console.log(`[Webhook] Pagamento ${externalId} confirmado. Ativando plano ${payment.plan_id} para org ${payment.organization_id}...`);
        await updateSubscription(supabaseAdmin, payment.organization_id, payment.plan_id)
    } else {
        console.log(`[Webhook] Status do pagamento ${externalId}: ${status}. Nenhuma alteração de plano realizada.`);
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Helper para mapear status da CAKTO para nosso sistema
function mapCaktoStatus(caktoStatus: string): string {
    switch (caktoStatus?.toLowerCase()) {
        case 'paid':
        case 'approved':
        case 'succeeded':
            return 'paid'
        case 'pending':
        case 'processing':
            return 'pending'
        case 'failed':
        case 'refused':
            return 'failed'
        case 'canceled':
        case 'cancelled':
            return 'canceled'
        default:
            return 'pending'
    }
}

// Helper para atualizar assinatura
async function updateSubscription(supabase: any, orgId: string, planId: string) {
    // Calcular datas
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30) // 30 dias de assinatura

    // Normalizar planId
    let dbPlan = planId
    if (dbPlan === 'starter') dbPlan = 'basic'
    if (dbPlan === 'pro') dbPlan = 'professional'

    const { error } = await supabase
        .from("subscriptions")
        .upsert({
            organization_id: orgId,
            plan: dbPlan,
            status: "active",
            current_period_start: startDate.toISOString(),
            current_period_end: endDate.toISOString(),
            updated_at: new Date().toISOString()
        }, { onConflict: "organization_id" })

    if (error) {
        console.error("Erro ao atualizar assinatura:", error)
        throw error
    }
    
    console.log(`Assinatura atualizada para org ${orgId}: ${dbPlan}`)
}
