import { NextResponse } from "next/server"
import { differenceInMonths, parseISO } from "date-fns"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { valorOriginal, dataVencimento, multaPercentual, jurosMensais } = body

    const valor = parseFloat(valorOriginal)
    const multa = parseFloat(multaPercentual) || 2 // Padrão 2%
    const juros = parseFloat(jurosMensais) || 1 // Padrão 1%

    const vencimento = parseISO(dataVencimento)
    const hoje = new Date()

    // Diferença em meses (simples)
    const mesesAtraso = differenceInMonths(hoje, vencimento)

    let valorMulta = 0
    let valorJuros = 0

    if (mesesAtraso > 0) {
        valorMulta = valor * (multa / 100)
        valorJuros = valor * (juros / 100) * mesesAtraso
    }

    const total = valor + valorMulta + valorJuros

    return NextResponse.json({
      valorOriginal: valor.toFixed(2),
      mesesAtraso: mesesAtraso > 0 ? mesesAtraso : 0,
      multa: valorMulta.toFixed(2),
      juros: valorJuros.toFixed(2),
      total: total.toFixed(2)
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar cálculo" },
      { status: 500 }
    )
  }
}
