import { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// Helper para atualizar assinatura
export async function updateSubscription(supabase: SupabaseClient, orgId: string, planId: string) {
    // Calcular datas
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30) // 30 dias de assinatura

    // Normalizar planId
    let dbPlan = planId
    let amount = 0;

    if (dbPlan === 'starter') dbPlan = 'basic'
    if (dbPlan === 'pro') dbPlan = 'professional'

    // Definir valor padrão do plano para exibição (independente de cupom)
    if (dbPlan === 'basic') amount = 99;
    if (dbPlan === 'professional') amount = 299;
    
    const { error } = await supabase
        .from("subscriptions")
        .upsert({
            organization_id: orgId,
            plan: dbPlan,
            status: "active",
            amount: amount, // Salva o valor real do plano
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

// Helper para mapear status da CAKTO
export function mapCaktoStatus(caktoStatus: string): string {
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

// Helper para mapear status do ASAAS
export function mapAsaasStatus(asaasStatus: string): string {
    // Status Asaas: PAYMENT_CREATED, PAYMENT_UPDATED, PAYMENT_CONFIRMED, PAYMENT_RECEIVED, PAYMENT_OVERDUE, etc.
    // Usaremos status simplificado para o banco
    switch (asaasStatus?.toUpperCase()) {
        case 'PAYMENT_CONFIRMED': // Confirmado, mas saldo não disponível ainda (cartão)
        case 'PAYMENT_RECEIVED': // Recebido (Boleto/Pix)
        case 'RECEIVED': // Status do objeto payment
        case 'RECEIVED_IN_CASH': // Recebido em dinheiro (confirmação manual ou saldo)
        case 'CONFIRMED':
             return 'paid';
        case 'PAYMENT_CREATED':
        case 'PENDING':
             return 'pending';
        case 'PAYMENT_OVERDUE':
        case 'OVERDUE':
             return 'pending'; // O webhook trata overdue especificamente para bloquear, mas o status do pagamento em si não é "falha" terminal
        case 'PAYMENT_REFUNDED':
        case 'REFUNDED':
             return 'refunded'; 
        case 'PAYMENT_DELETED':
        case 'PAYMENT_BANK_SLIP_VIEWED': 
        case 'PAYMENT_CHECKOUT_VIEWED':
             return 'pending';
        default:
             return 'pending';
    }
}

// Verifica se a organização tem acesso à API (assinatura ativa)
export async function checkApiAccess(organizationId?: string): Promise<boolean> {
    const supabase = await createClient();
    
    let orgId = organizationId;

    if (!orgId) {
        // Tenta obter do usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data: profile } = await supabase
            .from('profiles')
            .select('organization_id')
            .eq('id', user.id)
            .single();
        
        orgId = profile?.organization_id;
    }

    if (!orgId) return false;

    const { data: sub } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('organization_id', orgId)
        .single();

    if (!sub) return false; // Sem assinatura

    // Status permitidos
    const allowedStatuses = ['active', 'trialing', 'canceled']; // 'canceled' é permitido se dentro do período
    
    if (allowedStatuses.includes(sub.status)) {
        // Verifica validade do período
        if (sub.current_period_end) {
            const endDate = new Date(sub.current_period_end);
            
            // Regra de tolerância:
            // Se status é 'active', pode ter delay no webhook de renovação -> tolerância de 2 dias?
            // Se status é 'canceled', é HARD stop na data.
            // O usuário pediu: "O plano só deve expirar se: O pagamento não for efetuado... ou A assinatura for cancelada"
            // E "Após a expiração: O plano não deve ser religado automaticamente... movido para Free"
            
            // Vamos ser estritos: Passou da data = Expirou.
            if (endDate < new Date()) {
                return false;
            }
            return true;
        }
        
        // Se não tem data mas está active (ex: vitalício manual?), permite.
        // Mas se for canceled sem data, bloqueia.
        if (sub.status === 'canceled') return false;
        
        return true;
    }

    return false;
}

// Middleware para proteger rotas de API (usar dentro das rotas)
export async function requireApiAccess() {
    const hasAccess = await checkApiAccess();
    if (!hasAccess) {
        // Em server actions, lançar erro. Em API Routes, retornar Response.
        // Como isso é helper, vamos lançar erro que pode ser capturado
        throw new Error("ACCESS_DENIED: Assinatura inativa ou pendente.");
    }
}
