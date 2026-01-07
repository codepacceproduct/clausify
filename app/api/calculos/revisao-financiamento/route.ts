import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { valorFinanciado, taxaJurosMensal, prazoMeses, sistemaAmortizacao } = body

    const principal = parseFloat(valorFinanciado)
    const i = parseFloat(taxaJurosMensal) / 100
    const n = parseInt(prazoMeses)

    let prestacao = 0
    let totalPago = 0
    let totalJuros = 0

    // Cálculo simples para estimativa de juros abusivos comparando com juros simples vs compostos ou taxa média
    // Aqui vamos retornar os dados do financiamento calculado para o usuário comparar
    
    // Fórmula Price (mais comum em financiamentos de veículos/pessoal)
    prestacao = principal * ( (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1) )
    totalPago = prestacao * n
    totalJuros = totalPago - principal

    // Taxa média de mercado para comparação (exemplo: Veículos ~ 2.5% a.m.)
    const taxaMedia = 2.0 
    const isAbusivo = parseFloat(taxaJurosMensal) > taxaMedia

    return NextResponse.json({
      prestacaoMensal: prestacao.toFixed(2),
      totalPago: totalPago.toFixed(2),
      totalJuros: totalJuros.toFixed(2),
      taxaConsiderada: taxaJurosMensal,
      taxaMediaMercado: taxaMedia,
      indicioAbusividade: isAbusivo,
      economiaEstimada: isAbusivo ? (totalPago - (principal * ( ( (taxaMedia/100) * Math.pow(1 + (taxaMedia/100), n)) / (Math.pow(1 + (taxaMedia/100), n) - 1) ) * n)).toFixed(2) : 0
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar cálculo" },
      { status: 500 }
    )
  }
}
