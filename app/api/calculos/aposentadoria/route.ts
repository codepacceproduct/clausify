import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sexo, idade, tempoContribuicaoAnos } = body

    const idadeNum = parseInt(idade)
    const tempoNum = parseFloat(tempoContribuicaoAnos)
    
    // Regra Geral (Pós Reforma 2019)
    // Homem: 65 anos idade + 20 anos contribuição (para 60% + 2% a cada ano extra > 20)
    // Mulher: 62 anos idade + 15 anos contribuição (para 60% + 2% a cada ano extra > 15)

    let idadeMinima = 0
    let tempoMinimo = 0
    
    if (sexo === "M") {
        idadeMinima = 65
        tempoMinimo = 20 // Regra nova (15 para quem já estava filiado, mas vamos usar 20 como padrão geral novo)
    } else {
        idadeMinima = 62
        tempoMinimo = 15
    }

    const faltaIdade = idadeMinima - idadeNum
    const faltaTempo = tempoMinimo - tempoNum

    const aptoIdade = faltaIdade <= 0
    const aptoTempo = faltaTempo <= 0

    return NextResponse.json({
      apto: aptoIdade && aptoTempo,
      faltaIdade: faltaIdade > 0 ? faltaIdade : 0,
      faltaTempo: faltaTempo > 0 ? faltaTempo : 0,
      regra: `Idade Mínima: ${idadeMinima} anos | Tempo Mínimo: ${tempoMinimo} anos`
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar cálculo" },
      { status: 500 }
    )
  }
}
