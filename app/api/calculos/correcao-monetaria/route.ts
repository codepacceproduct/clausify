
import { NextResponse } from "next/server"
import { fetchBCBSeries, calculateCorrection, INDICES } from "@/lib/calculos/bcb"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { valor, dataInicial, dataFinal, indice } = body

    if (!valor || !dataInicial || !dataFinal || !indice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const code = INDICES[indice as keyof typeof INDICES]
    if (!code) {
      return NextResponse.json(
        { error: "Invalid index code" },
        { status: 400 }
      )
    }

    const seriesData = await fetchBCBSeries(code, dataInicial, dataFinal)
    
    // SELIC is daily, others are monthly usually, but BCB returns formatted values
    const isDaily = indice === "SELIC"
    
    const { correctedValue, correctionFactor } = calculateCorrection(
      parseFloat(valor),
      seriesData,
      isDaily
    )

    return NextResponse.json({
      valorOriginal: parseFloat(valor),
      valorCorrigido: correctedValue,
      correcao: correctedValue - parseFloat(valor),
      percentual: (correctionFactor - 1) * 100,
      indiceUsado: indice
    })

  } catch (error) {
    console.error("Error in monetary correction:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
