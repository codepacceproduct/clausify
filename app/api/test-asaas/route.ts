import { NextResponse } from 'next/server';
import { getAsaasClient } from '@/lib/asaas';

// 🚨 REGRA CRÍTICA: Runtime Node.js obrigatório
export const runtime = "nodejs";

// Gerador simples de CPF válido para testes
function generateCpf() {
  const rnd = (n: number) => Math.round(Math.random() * n);
  const mod = (base: number, div: number) => Math.round(base - Math.floor(base / div) * div);
  const n = Array(9).fill(0).map(() => rnd(9));
  
  let d1 = n.reduce((total, num, i) => total + num * (10 - i), 0);
  d1 = 11 - mod(d1, 11);
  if (d1 >= 10) d1 = 0;
  
  let d2 = n.reduce((total, num, i) => total + num * (11 - i), 0) + d1 * 2;
  d2 = 11 - mod(d2, 11);
  if (d2 >= 10) d2 = 0;
  
  return `${n.join('')}${d1}${d2}`;
}

export async function GET() {
  const isProduction = process.env.ASAAS_BASE_URL?.includes('api.asaas.com');
  const envName = isProduction ? 'PRODUÇÃO' : 'Sandbox';

  if (isProduction) {
      // Opcional: Impedir execução acidental em produção se desejar
      // return NextResponse.json({ error: 'Endpoint de teste desabilitado em produção' }, { status: 403 });
  }

  try {
    const asaas = getAsaasClient();
    const cpf = generateCpf();
    const email = `teste_${Date.now()}@example.com`;
    
    // 1. Criar cliente
    const customerId = await asaas.getOrCreateCustomer({
        name: 'Teste Integração Clausify',
        email: email,
        cpfCnpj: cpf
    });

    // 2. Criar cobrança PIX de teste (Avulsa)
    const payment = await asaas.createPixCharge({
        customerId: customerId,
        value: 15.00, // R$ 15,00 (Float)
        description: `Teste de Cobrança Avulsa - ${envName}`
    });

    // 3. Criar Assinatura de teste (Recorrente)
    const nextDueDate = new Date(); // Hoje
    
    const subscription = await asaas.createSubscription({
        customer: customerId,
        billingType: 'PIX', // Testando com PIX
        value: 99.00,
        nextDueDate: nextDueDate.toISOString().split('T')[0],
        cycle: 'MONTHLY',
        description: `Teste Assinatura Mensal - ${envName}`
    });

    return NextResponse.json({
      success: true,
      environment: envName,
      message: `Integração ASAAS funcionando em ${envName}! ATENÇÃO: Cobranças REAIS geradas se estiver em Produção.`,
      env: {
          base_url: process.env.ASAAS_BASE_URL,
          has_api_key: !!process.env.ASAAS_API_KEY,
      },
      result: {
          single_payment: {
              paymentId: payment.paymentId,
              invoiceUrl: payment.invoiceUrl,
              pixQrCode: payment.pixQrCode
          },
          subscription: {
              id: subscription.id,
              status: subscription.status,
              cycle: subscription.cycle,
              value: subscription.value
          },
          customer: {
              email: email,
              cpf: cpf,
              id: customerId
          }
      },
      next_steps: [
          "1. Verifique se as cobranças apareceram no painel do ASAAS.",
          "2. Se for Produção, cancele as cobranças/assinaturas geradas para evitar custos, ou pague o PIX para testar o fluxo completo.",
          "3. Verifique se o webhook foi disparado."
      ]
    });

  } catch (error: any) {
    console.error('Test Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.response?.data || 'Sem detalhes adicionais',
      env: {
          base_url: process.env.ASAAS_BASE_URL,
          has_api_key: !!process.env.ASAAS_API_KEY,
      }
    }, { status: 500 });
  }
}
