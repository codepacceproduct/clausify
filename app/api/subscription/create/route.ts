import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAsaasClient } from "@/lib/asaas";

// 🚨 REGRA CRÍTICA: Runtime Node.js obrigatório
export const runtime = "nodejs";

// Configuração de preços (Idealmente viria do banco ou de uma config global)
const PLAN_PRICES: Record<string, number> = {
    'starter': 29.90,
    'basic': 29.90, // Alias para starter
    'professional': 89.90,
    'pro': 89.90, // Alias para professional
    'office': 199.90,
    'enterprise': 199.90 // Alias para office
};

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        
        // 1. Autenticação
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // 2. Obter dados do body
        const body = await req.json();
        const { plan, billingType, cpfCnpj, name, cycle = 'MONTHLY' } = body;

        if (!plan || !PLAN_PRICES[plan.toLowerCase()]) {
            return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
        }

        const planPrice = PLAN_PRICES[plan.toLowerCase()];

        // 3. Obter perfil e organização do usuário
        // Assumindo que o usuário tem uma organization_id no profile ou metadata
        // Vamos buscar o profile primeiro
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
        }

        // Determinar ID da organização (se B2B) ou usar ID do usuário
        // Se não tiver organization_id, usamos o ID do usuário como referência
        const organizationId = profile.organization_id || user.id;

        // 4. Garantir Customer no Asaas
        let asaasCustomerId = profile.asaas_customer_id;

        const asaas = getAsaasClient();

        if (!asaasCustomerId) {
            asaasCustomerId = await asaas.getOrCreateCustomer({
                name: name || profile.full_name || user.email || 'Cliente Clausify',
                email: user.email || '',
                cpfCnpj: cpfCnpj || undefined // Opcional, mas bom para boleto/pix
            });

            // Salvar no perfil para uso futuro
            await supabase
                .from('profiles')
                .update({ asaas_customer_id: asaasCustomerId })
                .eq('id', user.id);
        }

        // 5. Criar Assinatura no Asaas
        // Calcula data de vencimento (ex: hoje ou amanhã para primeiro pagamento)
        const nextDueDate = new Date();
        // Se for PIX/Cartão, queremos cobrar agora. O Asaas permite nextDueDate = hoje?
        // Sim, se for cartão. Se for Boleto, precisa de dias.
        // Vamos colocar para hoje.
        
        const subscription = await asaas.createSubscription({
            customer: asaasCustomerId,
            billingType: billingType || 'UNDEFINED', // UNDEFINED permite o usuário escolher no link
            value: planPrice,
            nextDueDate: nextDueDate.toISOString().split('T')[0],
            cycle: cycle,
            description: `Assinatura Plano ${plan} - Clausify`,
            externalReference: organizationId
        });

        // 6. Atualizar tabela subscriptions
        // Primeiro verificamos se já existe uma assinatura para essa org
        // Se existir, atualizamos. Se não, criamos.
        
        // Mapear nome do plano
        let dbPlan = plan.toLowerCase();
        if (dbPlan === 'starter') dbPlan = 'basic';
        if (dbPlan === 'pro') dbPlan = 'professional';
        if (dbPlan === 'office') dbPlan = 'enterprise';

        const { error: subError } = await supabase
            .from('subscriptions')
            .upsert({
                organization_id: organizationId,
                external_subscription_id: subscription.id,
                plan: dbPlan,
                status: 'pending', // Aguardando pagamento
                // current_period_start e end serão atualizados no webhook de pagamento confirmado
                updated_at: new Date().toISOString()
            }, { onConflict: 'organization_id' });

        if (subError) {
            console.error('Erro ao salvar assinatura no banco:', subError);
            // Não bloqueamos o fluxo, mas logamos
        }

        // 7. Obter link de pagamento da primeira cobrança
        // Usando fetch direto para endpoint do Asaas já que não temos helper na lib
        
        const paymentsResponse = await fetch(`${process.env.ASAAS_BASE_URL}/payments?subscription=${subscription.id}`, {
            headers: {
                'access_token': process.env.ASAAS_API_KEY || ''
            }
        });
        
        const paymentsData = await paymentsResponse.json();
        let paymentLink = null;
        
        if (paymentsData.data && paymentsData.data.length > 0) {
            paymentLink = paymentsData.data[0].invoiceUrl;
        }

        return NextResponse.json({
            subscriptionId: subscription.id,
            paymentLink: paymentLink || subscription.invoiceUrl // Alguns endpoints retornam invoiceUrl na subscrição se for billingType definido
        });

    } catch (error: any) {
        console.error("Subscription Create Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
