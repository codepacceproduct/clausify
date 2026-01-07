import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { salarioBruto } = body

    const salario = parseFloat(salarioBruto)
    let contribuicao = 0
    let faixa = 0

    // Tabela INSS 2024 (Progressiva)
    // 1ª faixa: até 1.412,00 -> 7,5%
    // 2ª faixa: de 1.412,01 até 2.666,68 -> 9%
    // 3ª faixa: de 2.666,69 até 4.000,03 -> 12%
    // 4ª faixa: de 4.000,04 até 7.786,02 -> 14%
    
    const tetoINSS = 7786.02
    let salarioCalculo = salario > tetoINSS ? tetoINSS : salario

    // Faixa 1
    if (salarioCalculo > 1412.00) {
        contribuicao += 1412.00 * 0.075
        faixa = 1
    } else {
        contribuicao += salarioCalculo * 0.075
        faixa = 1
        return NextResponse.json({ contribuicao: contribuicao.toFixed(2), aliquotaEfetiva: ((contribuicao/salario)*100).toFixed(2) })
    }

    // Faixa 2
    if (salarioCalculo > 2666.68) {
        contribuicao += (2666.68 - 1412.00) * 0.09
        faixa = 2
    } else {
        contribuicao += (salarioCalculo - 1412.00) * 0.09
        faixa = 2
        return NextResponse.json({ contribuicao: contribuicao.toFixed(2), aliquotaEfetiva: ((contribuicao/salario)*100).toFixed(2) })
    }

    // Faixa 3
    if (salarioCalculo > 4000.03) {
        contribuicao += (4000.03 - 2666.68) * 0.12
        faixa = 3
    } else {
        contribuicao += (salarioCalculo - 2666.68) * 0.12
        faixa = 3
        return NextResponse.json({ contribuicao: contribuicao.toFixed(2), aliquotaEfetiva: ((contribuicao/salario)*100).toFixed(2) })
    }

    // Faixa 4
    if (salarioCalculo > 7786.02) { // Teto
        contribuicao += (7786.02 - 4000.03) * 0.14
        faixa = 4
    } else {
        contribuicao += (salarioCalculo - 4000.03) * 0.14
        faixa = 4
    }

    return NextResponse.json({
      contribuicao: contribuicao.toFixed(2),
      aliquotaEfetiva: ((contribuicao/salario)*100).toFixed(2),
      tetoAtingido: salario > tetoINSS
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar cálculo" },
      { status: 500 }
    )
  }
}
