import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { faturamento, regime } = body

    const valor = parseFloat(faturamento)
    let pis = 0
    let cofins = 0

    // Cumulativo (Lucro Presumido)
    // PIS: 0,65%
    // COFINS: 3,00%
    
    // Não Cumulativo (Lucro Real)
    // PIS: 1,65%
    // COFINS: 7,60%

    if (regime === "cumulativo") {
        pis = valor * 0.0065
        cofins = valor * 0.03
    } else {
        pis = valor * 0.0165
        cofins = valor * 0.076
    }

    const total = pis + cofins

    return NextResponse.json({
      pis: pis.toFixed(2),
      cofins: cofins.toFixed(2),
      total: total.toFixed(2),
      regime: regime === "cumulativo" ? "Cumulativo (Lucro Presumido)" : "Não Cumulativo (Lucro Real)"
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar cálculo" },
      { status: 500 }
    )
  }
}
