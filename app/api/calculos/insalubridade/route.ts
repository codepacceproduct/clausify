
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { salarioMinimo, salarioBase, grauInsalubridade, temPericulosidade } = body

    if (!salarioMinimo || !salarioBase) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const min = parseFloat(salarioMinimo)
    const base = parseFloat(salarioBase)
    const grau = parseFloat(grauInsalubridade)

    if (isNaN(min) || isNaN(base)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      )
    }

    // Insalubridade: % sobre salário mínimo
    const adicionalInsalubridade = min * (grau / 100)

    // Periculosidade: 30% sobre salário base (sem gratificações, prêmios, etc - simplified here)
    // Note: Usually you can't accumulate both (Insalubridade vs Periculosidade), the worker must choose.
    // However, some recent understandings might vary or user might want to compare.
    // Let's calculate both if requested, but typically it's one OR the other.
    // The UI allows selecting both, so let's sum them for now or assume user knows labor law context.
    
    const adicionalPericulosidade = temPericulosidade ? base * 0.30 : 0

    const totalAdicionais = adicionalInsalubridade + adicionalPericulosidade
    const salarioFinal = base + totalAdicionais

    return NextResponse.json({
      adicionalInsalubridade,
      adicionalPericulosidade,
      totalAdicionais,
      salarioFinal
    })

  } catch (error) {
    console.error("Error in insalubrity calculation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
