import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { capitalTotal, socios } = body 
    // socios: array de { nome: string, quotas: number }

    const capital = parseFloat(capitalTotal)
    const listaSocios = socios || []

    const resultadoSocios = listaSocios.map((socio: any) => {
        const valorInvestido = parseFloat(socio.quotas)
        const percentual = (valorInvestido / capital) * 100
        return {
            nome: socio.nome,
            valor: valorInvestido.toFixed(2),
            percentual: percentual.toFixed(2) + "%"
        }
    })

    return NextResponse.json({
      capitalTotal: capital.toFixed(2),
      distribuicao: resultadoSocios
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar cálculo" },
      { status: 500 }
    )
  }
}
