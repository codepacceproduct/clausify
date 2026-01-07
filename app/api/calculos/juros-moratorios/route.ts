import { NextResponse } from "next/server"
import { differenceInDays, parseISO } from "date-fns"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { valorPrincipal, dataInicial, dataFinal, taxaJurosAnual } = body

    const valor = parseFloat(valorPrincipal)
    const taxaAnual = parseFloat(taxaJurosAnual) || 12 // Padrão 1% a.m. = 12% a.a.
    const taxaDiaria = (taxaAnual / 100) / 365

    const inicio = parseISO(dataInicial)
    const fim = parseISO(dataFinal)
    const dias = differenceInDays(fim, inicio)

    let juros = 0
    if (dias > 0) {
        juros = valor * taxaDiaria * dias
    }

    const total = valor + juros

    return NextResponse.json({
      valorPrincipal: valor.toFixed(2),
      dias: dias > 0 ? dias : 0,
      juros: juros.toFixed(2),
      total: total.toFixed(2)
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar cálculo" },
      { status: 500 }
    )
  }
}
