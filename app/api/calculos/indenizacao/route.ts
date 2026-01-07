import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tipoDano, gravidade, valorMaterial } = body

    const danosMateriais = parseFloat(valorMaterial) || 0
    let sugestaoMoralMin = 0
    let sugestaoMoralMax = 0

    // Estimativas baseadas em jurisprudência genérica (apenas referência)
    switch (gravidade) {
        case "leve":
            sugestaoMoralMin = 1000
            sugestaoMoralMax = 5000
            break
        case "media":
            sugestaoMoralMin = 5000
            sugestaoMoralMax = 15000
            break
        case "grave":
            sugestaoMoralMin = 15000
            sugestaoMoralMax = 50000
            break
        case "gravissima":
            sugestaoMoralMin = 50000
            sugestaoMoralMax = 200000
            break
        default:
            sugestaoMoralMin = 0
            sugestaoMoralMax = 0
    }

    const totalMin = danosMateriais + sugestaoMoralMin
    const totalMax = danosMateriais + sugestaoMoralMax

    return NextResponse.json({
      danosMateriais: danosMateriais.toFixed(2),
      sugestaoMoralMin: sugestaoMoralMin.toFixed(2),
      sugestaoMoralMax: sugestaoMoralMax.toFixed(2),
      totalEstimadoMin: totalMin.toFixed(2),
      totalEstimadoMax: totalMax.toFixed(2)
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar cálculo" },
      { status: 500 }
    )
  }
}
