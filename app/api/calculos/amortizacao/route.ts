import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { valorEmprestimo, taxaJurosMensal, prazoMeses } = body

    const P = parseFloat(valorEmprestimo)
    const i = parseFloat(taxaJurosMensal) / 100
    const n = parseInt(prazoMeses)

    // Tabela Price
    const parcelaPrice = P * ( (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1) )
    const totalPrice = parcelaPrice * n
    const jurosPrice = totalPrice - P

    // Tabela SAC
    // Amortização constante = P / n
    const amortizacaoSAC = P / n
    let totalSAC = 0
    let primeiraParcelaSAC = 0
    let ultimaParcelaSAC = 0

    // Calcular totais SAC
    for (let t = 1; t <= n; t++) {
        const saldoDevedor = P - (amortizacaoSAC * (t - 1))
        const juros = saldoDevedor * i
        const parcela = amortizacaoSAC + juros
        totalSAC += parcela
        if (t === 1) primeiraParcelaSAC = parcela
        if (t === n) ultimaParcelaSAC = parcela
    }
    const jurosSAC = totalSAC - P

    return NextResponse.json({
      price: {
        parcela: parcelaPrice.toFixed(2),
        totalPago: totalPrice.toFixed(2),
        totalJuros: jurosPrice.toFixed(2)
      },
      sac: {
        primeiraParcela: primeiraParcelaSAC.toFixed(2),
        ultimaParcela: ultimaParcelaSAC.toFixed(2),
        totalPago: totalSAC.toFixed(2),
        totalJuros: jurosSAC.toFixed(2)
      },
      diferencaJuros: Math.abs(jurosPrice - jurosSAC).toFixed(2),
      melhorOpcao: jurosSAC < jurosPrice ? "SAC (Menor custo total de juros)" : "Price (Parcelas fixas, mas juros maiores)"
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar cálculo" },
      { status: 500 }
    )
  }
}
