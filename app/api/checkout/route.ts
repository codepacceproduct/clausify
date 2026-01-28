import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAsaasClient } from '@/lib/asaas';

// 🚨 REGRA CRÍTICA: Runtime Node.js obrigatório para integração Asaas
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { plan, hasCoupon } = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Profile and Organization
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
        return NextResponse.json({ error: 'Organização não encontrada' }, { status: 400 });
    }

    let amount = 0; // Centavos
    let description = '';
    let planSlug = plan.toLowerCase();
    
    // Mapeamento de Planos e Preços
    switch(planSlug) {
        case 'basic': 
        case 'starter':
            planSlug = 'basic';
            amount = 9900; // R$ 99,00
            description = 'Assinatura Plano Starter (Mensal)';
            break;
        case 'professional': 
        case 'pro':
            planSlug = 'professional';
            amount = 29900; // R$ 299,00
            description = 'Assinatura Plano Pro (Mensal)';
            break;
        case 'enterprise': 
        case 'office':
            return NextResponse.json({ error: 'Para o plano Office, entre em contato com nosso time de vendas.' }, { status: 400 });
        case 'free':
             return NextResponse.json({ message: 'Plano Free selecionado' });
        default:
             return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    // Integração ASAAS
    try {
        const asaas = getAsaasClient();

        // Lógica de Cupom Promocional
        let billingType = 'UNDEFINED'; // Padrão: permite escolha na fatura
        if (hasCoupon) {
            amount = 500; // R$ 5,00 (Valor mínimo para boleto no Asaas)
            billingType = 'BOLETO';
            
            // Descrições personalizadas por plano para evitar conflitos de identificação
            if (planSlug === 'basic') {
                description = 'Cupom Promocional Starter';
            } else if (planSlug === 'professional') {
                description = 'Assinatura Plano Pro';
            } else if (planSlug === 'enterprise') {
                description = 'Assinatura Plano Office';
            } else {
                description += ' (Promocional - Cupom)';
            }
        }

        // Validação de Dados Obrigatórios
        // O Asaas exige CPF/CNPJ para gerar cobranças PIX/Boleto
        const cpfCnpj = profile.cnpj || profile.cpf;
        if (!cpfCnpj) {
            return NextResponse.json({ 
                error: 'CPF ou CNPJ obrigatório para gerar cobrança. Por favor, atualize seu perfil em Configurações > Perfil.',
                code: 'missing_document'
            }, { status: 400 });
        }

        // 1. Criar ou Buscar Cliente
        const customerId = await asaas.getOrCreateCustomer({
            name: profile.name || 'Cliente Clausify',
            email: profile.email || user.email || '',
            cpfCnpj: cpfCnpj,
            mobilePhone: profile.phone // Enviar telefone se disponível
        });

        // 2. Criar Assinatura (Subscription)
        const valueInReais = amount / 100;
        
        // Data da primeira cobrança: HOJE (para gerar QR Code imediato)
        const nextDueDate = new Date().toISOString().split('T')[0];

        const subscription = await asaas.createSubscription({
            customer: customerId,
            billingType: billingType as any, 
            value: valueInReais,
            nextDueDate: nextDueDate,
            cycle: 'MONTHLY',
            description: description,
            externalReference: profile.organization_id // Referência para conciliação
        });

        // 3. Salvar/Atualizar Assinatura no Banco
        // REGRA DE OURO: Não ativar plano imediatamente. Status 'pending' e manter plano anterior se possível (ou 'free')
        // Mas como é upsert, precisamos cuidar para não sobrescrever um plano ativo se for upgrade/downgrade
        // Se já existe uma assinatura, o ideal seria não alterar o 'plan' até o webhook confirmar.
        // Mas para simplificar e indicar intenção, podemos setar 'pending' no status.
        
        // Buscar assinatura atual
        const { data: currentSub } = await supabase
            .from('subscriptions')
            .select('plan, status')
            .eq('organization_id', profile.organization_id)
            .single();

        const newStatus = 'pending'; 
        // Se for upgrade, mantemos o plano atual até confirmar? Ou já indicamos o novo plano com status pending?
        // O requisito diz: "Plano atual permanece inalterado"
        // Então NÃO devemos alterar o campo 'plan' aqui se já existir.
        
        let planToSave = planSlug;
        if (currentSub && currentSub.status === 'active') {
             // Se já tem plano ativo, NÃO altera o plano no banco, apenas atualiza external_subscription_id se necessário?
             // Não, se mudamos a assinatura no Asaas, precisamos rastrear isso.
             // Vamos criar um registro de intenção ou confiar no webhook?
             // Se não salvarmos o novo external_subscription_id, o webhook pode não encontrar a org.
             
             // Solução: Salvar a nova subscription ID, mas MANTER o plano antigo no campo 'plan' até o pagamento.
             // Mas onde guardamos o "novo plano desejado"? No metadata da subscription ou payment?
             // O webhook vai receber o valor e pode inferir o plano, ou usamos metadata no Asaas.
             
             planToSave = currentSub.plan; // Mantém o atual
        }
        
        // Melhor abordagem para garantir a regra "Plano atual permanece inalterado":
        // Não atualizar a tabela subscriptions aqui com o novo plano.
        // Apenas atualizar o external_subscription_id é arriscado se sobrescrever uma assinatura ativa vigente.
        
        // Se o usuário está criando uma NOVA assinatura (ex: saindo do Free ou trocando),
        // O Asaas vai gerar uma nova.
        
        // Vamos salvar o 'plan' como o plano ALVO, mas o status como 'pending'.
        // O frontend e backend devem tratar status 'pending' como "sem acesso aos recursos do novo plano".
        // Se o usuário tinha plano Basic e tenta Pro -> status vira Pending -> acesso cai para Free/Restrito?
        // O requisito diz: "Estado do usuário: Plano atual permanece inalterado"
        
        // Se eu mudar o status para 'pending', o acesso pode ser bloqueado se a lógica de verificação exigir 'active'.
        // Se eu não mudar nada no banco, como sei que existe uma cobrança pendente? Pela tabela 'payments'.
        
        // DECISÃO:
        // 1. Não alterar a tabela 'subscriptions' aqui. Deixar o Webhook fazer isso.
        // 2. Apenas inserir na tabela 'payments' com status 'pending'.
        // 3. Opcionalmente, salvar external_subscription_id em um campo temporário ou apenas logar.
        // Mas precisamos vincular a assinatura do Asaas à organização.
        
        // Se eu não salvar external_subscription_id na tabela subscriptions, quando o webhook chegar com 'subscription: id_123',
        // eu preciso saber de qual org é.
        // O Webhook route já busca por external_subscription_id. Se não estiver salvo, falha.
        // Então PRECISAMOS salvar external_subscription_id.
        
        // E se salvarmos external_subscription_id mas não mudarmos o plano?
        // O webhook usa `payment.plan_id` (que vem do pagamento salvo) ou infere pelo valor.
        
        // Plano de ação ajustado:
        // 1. Atualizar 'subscriptions' com o novo external_subscription_id.
        // 2. NÃO mudar o campo 'plan' (manter o atual).
        // 3. NÃO mudar o campo 'status' para 'active' (manter o atual ou 'pending' se não existir).
        
        const currentPlan = currentSub?.plan || 'free';
        const currentStatus = currentSub?.status || 'canceled';
        
        // Se não tem assinatura, cria com status 'pending' e plano 'free' (ou o alvo? Requisito diz: não ativar plano pago).
        // Se colocarmos 'free', o usuário não tem acesso. Correto.
        
        // Mas precisamos saber qual plano ele QUER para ativar depois.
        // Vamos salvar o plano desejado no METADATA do Asaas (subscription description ou metadata).
        // E/OU salvar no payment.
        
        const { error: subError } = await supabase.from('subscriptions').upsert({
            organization_id: profile.organization_id,
            // Se já existe, mantém o plano atual. Se não, começa como 'free' (aguardando pagamento para virar o plano escolhido)
            plan: currentSub ? currentSub.plan : 'free', 
            status: currentSub ? currentSub.status : 'pending', // Não altera status se já existe
            external_subscription_id: subscription.id,
            updated_at: new Date().toISOString()
        }, { onConflict: 'organization_id' });

        if (subError) {
            console.error('Subscription DB Error:', subError);
        }

        // 4. Buscar cobrança gerada para retornar invoiceUrl
        // Isso melhora a UX permitindo que o usuário pague imediatamente via link/QR Code na invoice
        let firstPayment = null;
        try {
            // Pequeno delay para garantir propagação
            await new Promise(resolve => setTimeout(resolve, 1000));
            const paymentsResponse = await asaas.getSubscriptionPayments(subscription.id);
            if (paymentsResponse.data && paymentsResponse.data.length > 0) {
                firstPayment = paymentsResponse.data[0];
                
                // Opcional: Salvar pagamento no banco agora para exibir no histórico imediatamente
                if (firstPayment) {
                     await supabase.from('payments').insert({
                        organization_id: profile.organization_id,
                        external_id: firstPayment.id,
                        amount: valueInReais,
                        status: 'pending',
                        method: 'pix', // Default, será atualizado pelo webhook
                        plan_id: planSlug, // AQUI salvamos o plano desejado! O webhook usará isso para ativar.
                        metadata: {
                            invoice_url: firstPayment.invoiceUrl,
                            provider: 'asaas',
                            subscription_id: subscription.id,
                            target_plan: planSlug // Redundância segura
                        }
                    });
                }
            }
        } catch (payError) {
            console.warn('Erro ao buscar pagamento da assinatura recém-criada:', payError);
        }

        // Retornar dados para o frontend
        return NextResponse.json({
            success: true,
            subscriptionId: subscription.id,
            customerId: customerId,
            status: 'created',
            message: 'Assinatura criada com sucesso. Aguardando processamento do pagamento.',
            invoiceUrl: firstPayment?.invoiceUrl,
            paymentId: firstPayment?.id,
            amount: amount // Retornar amount em centavos para o frontend
        });

    } catch (apiError: any) {
        console.error('Asaas Integration Error:', apiError);
        return NextResponse.json({ error: apiError.message || 'Erro na integração com pagamento' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
