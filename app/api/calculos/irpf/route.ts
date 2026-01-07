import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rendimentos, dependentes, previdencia, outrasDeducoes } = body

    const rendaMensal = parseFloat(rendimentos)
    const numDependentes = parseInt(dependentes) || 0
    const valPrevidencia = parseFloat(previdencia) || 0
    const valOutrasDeducoes = parseFloat(outrasDeducoes) || 0

    // Dedução por dependente (Valor 2024/2025 aprox R$ 189,59)
    const deducaoDependente = 189.59
    const totalDeducaoDependentes = numDependentes * deducaoDependente

    // Base de cálculo
    const baseCalculo = rendaMensal - valPrevidencia - totalDeducaoDependentes - valOutrasDeducoes

    // Tabela Progressiva Mensal (Vigente 2024 - Lei 14.663/2023)
    let aliquota = 0
    let deducao = 0

    if (baseCalculo <= 2259.20) {
      aliquota = 0
      deducao = 0
    } else if (baseCalculo <= 2826.65) {
      aliquota = 7.5
      deducao = 169.44
    } else if (baseCalculo <= 3751.05) {
      aliquota = 15.0
      deducao = 381.44
    } else if (baseCalculo <= 4664.68) {
      aliquota = 22.5
      deducao = 662.77
    } else {
      aliquota = 27.5
      deducao = 896.00
    }

    // Desconto simplificado (opcional na lei, mas aqui vamos calcular o padrão primeiro)
    const impostoDevido = (baseCalculo * (aliquota / 100)) - deducao
    const impostoFinal = impostoDevido > 0 ? impostoDevido : 0
    const aliquotaEfetiva = (impostoFinal / rendaMensal) * 100

    return NextResponse.json({
      baseCalculo: baseCalculo.toFixed(2),
      aliquotaNominal: aliquota,
      parcelaDeduzir: deducao.toFixed(2),
      impostoMensal: impostoFinal.toFixed(2),
      aliquotaEfetiva: aliquotaEfetiva.toFixed(2)
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar cálculo" },
      { status: 500 }
    )
  }
}
