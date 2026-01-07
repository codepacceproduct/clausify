
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { rendaMensal, percentual, numeroDependentes } = body

    if (!rendaMensal || !percentual || !numeroDependentes) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const renda = parseFloat(rendaMensal)
    const perc = parseFloat(percentual) / 100
    const deps = parseInt(numeroDependentes)

    if (isNaN(renda) || isNaN(perc) || isNaN(deps)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      )
    }

    const valorPensao = renda * perc
    const valorPorDependente = deps > 0 ? valorPensao / deps : 0
    const rendaLiquida = renda - valorPensao

    return NextResponse.json({
      valorPensao,
      valorPorDependente,
      rendaLiquida,
    })

  } catch (error) {
    console.error("Error in alimony calculation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
