import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { valorImovel, aliquota } = body

    const valor = parseFloat(valorImovel)
    const aliq = parseFloat(aliquota)

    const imposto = valor * (aliq / 100)

    return NextResponse.json({
      valorBase: valor.toFixed(2),
      aliquota: aliq,
      valorImposto: imposto.toFixed(2)
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar cálculo" },
      { status: 500 }
    )
  }
}
