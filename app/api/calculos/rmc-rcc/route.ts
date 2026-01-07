import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { valorEmprestimo, dataContrato, taxaJurosMensal, valorParcela } = body

    // Simulação de cálculo de revisão RMC/RCC
    // A ideia é comparar a taxa cobrada com a taxa média de mercado (BACEN)
    // Para simplificar, vamos assumir uma taxa média de mercado de 1.8% a.m. se não fornecida (mock)
    
    const taxaMediaMercado = 1.8 // % a.m.
    const taxaCobrada = parseFloat(taxaJurosMensal)
    
    let abusividade = false
    let valorDevido = 0
    let diferencaTaxa = 0

    if (taxaCobrada > taxaMediaMercado) {
      abusividade = true
      diferencaTaxa = taxaCobrada - taxaMediaMercado
      
      // Cálculo simplificado da diferença paga a mais
      // Em um cenário real, precisaria do histórico de pagamentos
      // Vamos estimar baseado no valor do empréstimo projetado
      valorDevido = (parseFloat(valorEmprestimo) * (diferencaTaxa / 100)) * 12 // Estimativa anualizada da diferença
    }

    return NextResponse.json({
      abusividade,
      taxaCobrada,
      taxaMediaMercado,
      diferencaTaxa: diferencaTaxa.toFixed(2),
      valorDevido: valorDevido.toFixed(2),
      mensagem: abusividade 
        ? "Identificamos indícios de juros acima da média de mercado." 
        : "A taxa cobrada está dentro ou abaixo da média de mercado."
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar cálculo" },
      { status: 500 }
    )
  }
}
