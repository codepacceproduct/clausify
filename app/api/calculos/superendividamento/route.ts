
import { NextResponse } from "next/server"

interface Divida {
  id: number
  nome: string
  valor: number
  parcela: number
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { rendaMensal, despesasEssenciais, dividas } = body

    if (!rendaMensal || !despesasEssenciais) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const renda = parseFloat(rendaMensal)
    const despesas = parseFloat(despesasEssenciais)
    const dividasList = (dividas as Divida[]) || []

    if (isNaN(renda) || isNaN(despesas)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      )
    }

    const totalDividas = dividasList.reduce((acc, d) => acc + (Number(d.parcela) || 0), 0)
    const capacidadePagamento = renda - despesas
    const percentualComprometimento = renda > 0 ? (totalDividas / renda) * 100 : 0

    let situacao = "Saudável"
    if (percentualComprometimento > 30 && percentualComprometimento <= 50) {
      situacao = "Atenção"
    } else if (percentualComprometimento > 50) {
      situacao = "Superendividado"
    }

    return NextResponse.json({
      totalDividas,
      capacidadePagamento,
      percentualComprometimento,
      situacao,
    })

  } catch (error) {
    console.error("Error in overindebtedness calculation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
