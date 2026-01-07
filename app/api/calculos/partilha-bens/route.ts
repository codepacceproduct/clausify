import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { totalBens, totalDividas, conjugeMeacao, numHerdeiros } = body

    const bens = parseFloat(totalBens)
    const dividas = parseFloat(totalDividas)
    const herdeiros = parseInt(numHerdeiros) || 1
    const temMeacao = conjugeMeacao === "sim" || conjugeMeacao === true

    const patrimonioLiquido = bens - dividas

    let parteConjuge = 0
    let parteHerdeirosTotal = 0
    
    if (temMeacao) {
        parteConjuge = patrimonioLiquido * 0.5
        parteHerdeirosTotal = patrimonioLiquido * 0.5
    } else {
        parteHerdeirosTotal = patrimonioLiquido
    }

    const partePorHerdeiro = parteHerdeirosTotal / herdeiros

    return NextResponse.json({
      patrimonioLiquido: patrimonioLiquido.toFixed(2),
      meacaoConjuge: parteConjuge.toFixed(2),
      totalParaHerdeiros: parteHerdeirosTotal.toFixed(2),
      valorPorHerdeiro: partePorHerdeiro.toFixed(2)
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar cálculo" },
      { status: 500 }
    )
  }
}
