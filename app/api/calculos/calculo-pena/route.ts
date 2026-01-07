import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { penaTotalAnos, crimeHediondo, reincidente } = body

    const anos = parseFloat(penaTotalAnos)
    let fracao = 0
    let percentual = 0

    // Pacote Anticrime (Lei 13.964/2019)
    // 16% (primário, sem violência)
    // 20% (reincidente, sem violência)
    // 25% (primário, com violência) -> Vamos simplificar aqui
    // 30% (reincidente, com violência)
    // 40% (primário, hediondo)
    // 50% (primário, hediondo com morte... etc)
    // 60% (reincidente, hediondo)
    // 70% (reincidente, hediondo com morte)

    const isHediondo = crimeHediondo === "sim"
    const isReincidente = reincidente === "sim"

    if (isHediondo) {
        if (isReincidente) {
            percentual = 60 // Genérico para hediondo reincidente
        } else {
            percentual = 40 // Genérico para hediondo primário
        }
    } else {
        if (isReincidente) {
            percentual = 20 // Genérico sem violência
        } else {
            percentual = 16 // Genérico sem violência
        }
    }

    const tempoParaProgressao = anos * (percentual / 100)

    return NextResponse.json({
      penaTotal: anos,
      percentualAplicado: percentual,
      tempoParaProgressao: tempoParaProgressao.toFixed(2),
      mensagem: `Para progredir de regime, é necessário cumprir ${percentual}% da pena.`
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar cálculo" },
      { status: 500 }
    )
  }
}
