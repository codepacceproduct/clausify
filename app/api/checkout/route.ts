import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cakto } from '@/lib/cakto';

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Profile and Organization
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id, name, email')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
        return NextResponse.json({ error: 'Organização não encontrada' }, { status: 400 });
    }

    let amount = 0;
    let description = '';
    let planSlug = plan.toLowerCase();
    
    // Mapeamento de Planos e Preços (em centavos)
    switch(planSlug) {
        case 'basic': 
        case 'starter':
            planSlug = 'basic'; // Mantendo slug interno
            amount = 9900; // R$ 99,00
            description = 'Assinatura Plano Starter (Mensal)';
            break;
        case 'professional': 
        case 'pro':
            planSlug = 'professional'; // Mantendo slug interno
            amount = 29900; // R$ 299,00
            description = 'Assinatura Plano Pro (Mensal)';
            break;
        case 'enterprise': 
        case 'office':
            return NextResponse.json({ error: 'Para o plano Office, entre em contato com nosso time de vendas.' }, { status: 400 });
        case 'free':
             // Downgrade lógico, não gera cobrança
             return NextResponse.json({ message: 'Plano Free selecionado' });
        default:
             return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    // Tentativa de obter URL de Checkout (Oferta) para redirecionamento
    try {
        const offers = await cakto.getOffers({ status: 'active' });
        const matchingOffer = offers.results?.find((o: any) => {
            const name = o.name.toLowerCase();
            // Matching: 'basic'/'starter', 'professional'/'pro'
            return name.includes(planSlug) || 
                   (planSlug === 'basic' && name.includes('starter')) ||
                   (planSlug === 'professional' && name.includes('pro'));
        });

        if (matchingOffer) {
             // Construir URL de Checkout
             // Se a API retornar checkoutUrl, usamos. Senão, construímos com base no ID/Code.
             // Formato padrão Cakto: https://pay.cakto.com.br/{offer_code}
             let checkoutUrl = matchingOffer.checkoutUrl;
             
             if (!checkoutUrl) {
                 // Fallback: usar 'code' ou 'id' como identificador da oferta
                 const offerCode = matchingOffer.code || matchingOffer.id;
                 if (offerCode) {
                    checkoutUrl = `https://pay.cakto.com.br/${offerCode}`;
                 }
             }
             
             if (checkoutUrl) {
                // Append organization_id to URL for tracking in Webhook via utm_content
                // Adicionamos também pre-fill de dados do cliente se possível (email, name)
                const separator = checkoutUrl.includes('?') ? '&' : '?';
                const params = new URLSearchParams();
                params.append('utm_content', profile.organization_id);
                
                // Pre-fill parameters (se suportado pelo checkout da Cakto)
                if (profile.email) params.append('email', profile.email);
                if (profile.name) params.append('name', profile.name);

                const redirectUrl = `${checkoutUrl}${separator}${params.toString()}`;
                
                return NextResponse.json({ 
                   checkoutUrl: redirectUrl,
                   mode: 'redirect'
                });
             }
        }
    } catch (e) {
        console.warn('Falha ao buscar ofertas Cakto, fallback para transação direta PIX:', e);
    }

    // Create Pix Charge via Cakto (Fallback or Primary if no offer found)
    const charge = await cakto.createPixCharge({
        amount,
        description,
        customer: {
            name: profile.name || 'Cliente Clausify',
            email: profile.email || user.email || '',
            // Se tiver CPF/CNPJ no cadastro da organização, passar aqui
        },
        items: [
            {
                title: description,
                quantity: 1,
                unit_price: amount,
                tangible: false
            }
        ]
    });

    // Save to payments table
    const { error: dbError } = await supabase.from('payments').insert({
        organization_id: profile.organization_id,
        external_id: charge.transactionId,
        amount: amount / 100,
        status: 'pending',
        method: 'pix',
        plan_id: planSlug,
        metadata: {
            qr_code: charge.qrCode,
            copy_paste: charge.copyPaste,
            expires_at: charge.expiresAt
        }
    });

    if (dbError) {
        console.error('Database Error:', dbError);
        // Não falhar a request se o pagamento foi criado na Cakto, mas logar erro crítico
    }

    return NextResponse.json(charge);

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Erro interno ao processar pagamento' }, { status: 500 });
  }
}
