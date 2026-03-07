import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { getAsaasClient } from "@/lib/asaas"
import { mapAsaasStatus, updateSubscription } from "@/lib/billing"

// 🚨 REGRA CRÍTICA: Runtime Node.js obrigatório
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { paymentId, provider = 'asaas' } = await req.json()

    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId" }, { status: 400 })
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
        .eq("id", paymentId)
        .single()

    if (dbError || !payment) {
         // Se não achar no banco pelo ID interno, pode ser que o frontend mandou ID externo?
         // Vamos assumir ID interno primeiro.
         return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    let currentStatus = payment.status;
    let rawResponse = null;

    try {
        if (provider === 'asaas') {
             const asaas = getAsaasClient();
             const transaction = await asaas.getTransaction(payment.external_id)
             currentStatus = await mapAsaasStatus(transaction.status)
             rawResponse = transaction
        }

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
                    raw_response: rawResponse 
                })
                .eq("id", payment.id)

            // Se mudou para pago, atualizar assinatura
            if (currentStatus === 'paid' && payment.plan_id) {
                 await updateSubscription(supabaseAdmin, payment.organization_id, payment.plan_id)
            }
        }
    } catch (apiError) {
        console.error(`Erro ao consultar provedor ${provider}:`, apiError)
        // Se falhar API, mantém status do banco
    }

    return NextResponse.json({ status: currentStatus, paid: currentStatus === 'paid' })

  } catch (error: any) {
    console.error("Status check error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
