import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { cakto } from "@/lib/cakto"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get("id")

    if (!paymentId) {
      return NextResponse.json({ error: "Missing payment ID" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Buscar pagamento no banco
    const { data: payment, error: dbError } = await supabase
        .from("payments")
        .select("*")
        .eq("external_id", paymentId) // Assumindo que o ID passado é o da CAKTO, se for interno ajustar
        .or(`id.eq.${paymentId},external_id.eq.${paymentId}`) // Suporta buscar por ambos
        .single()

    if (dbError || !payment) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Se já estiver pago ou falhado, retornar status do banco
    if (payment.status === 'paid' || payment.status === 'failed' || payment.status === 'canceled') {
        return NextResponse.json({ 
            status: payment.status, 
            paid: payment.status === 'paid' 
        })
    }

    // Se pendente, consultar na CAKTO para garantir status real-time
    try {
        const transaction = await cakto.getTransaction(payment.external_id)
        const currentStatus = mapCaktoStatus(transaction.status)

        // Se status mudou, atualizar banco
        if (currentStatus !== payment.status) {
            const supabaseAdmin = createAdminClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            )
            
            await supabaseAdmin
                .from("payments")
                .update({ 
                    status: currentStatus, 
                    updated_at: new Date().toISOString(),
                    raw_response: transaction 
                })
                .eq("id", payment.id)

            // Se mudou para pago, atualizar assinatura também (dupla verificação além do webhook)
            if (currentStatus === 'paid' && payment.plan_id) {
                 await updateSubscription(supabaseAdmin, payment.organization_id, payment.plan_id)
            }

            return NextResponse.json({ status: currentStatus, paid: currentStatus === 'paid' })
        }

        return NextResponse.json({ status: currentStatus, paid: currentStatus === 'paid' })

    } catch (apiError) {
        console.error("Erro ao consultar CAKTO:", apiError)
        // Se falhar API, retorna status do banco
        return NextResponse.json({ status: payment.status, paid: payment.status === 'paid' })
    }

  } catch (error: any) {
    console.error("Status check error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Helper duplicado do webhook (idealmente mover para lib/utils ou lib/cakto)
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

async function updateSubscription(supabase: any, orgId: string, planId: string) {
    // Calcular datas
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30) 

    let dbPlan = planId
    if (dbPlan === 'starter') dbPlan = 'basic'
    if (dbPlan === 'pro') dbPlan = 'professional'

    await supabase
        .from("subscriptions")
        .upsert({
            organization_id: orgId,
            plan: dbPlan,
            status: "active",
            current_period_start: startDate.toISOString(),
            current_period_end: endDate.toISOString(),
            updated_at: new Date().toISOString()
        }, { onConflict: "organization_id" })
}
