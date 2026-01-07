
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { salario, jornadaMensal, qtdHoras50, qtdHoras100 } = body

    if (!salario || !jornadaMensal) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const sal = parseFloat(salario)
    const jornada = parseFloat(jornadaMensal)
    const h50 = parseFloat(qtdHoras50 || "0")
    const h100 = parseFloat(qtdHoras100 || "0")

    if (isNaN(sal) || isNaN(jornada)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      )
    }

    const valorHoraNormal = sal / jornada
    
    // HE 50%
    const valorHora50 = valorHoraNormal * 1.5
    const total50 = valorHora50 * h50

    // HE 100%
    const valorHora100 = valorHoraNormal * 2.0
    const total100 = valorHora100 * h100

    // DSR (Descanso Semanal Remunerado)
    // Simplified: (Total HE / Business Days) * Sundays/Holidays
    // Approximation: Total HE / 6 (Standard approximation used in quick calculators)
    const totalHE = total50 + total100
    const dsr = totalHE / 6 

    const totalGeral = totalHE + dsr

    return NextResponse.json({
      valorHoraNormal,
      valorHora50,
      valorHora100,
      total50,
      total100,
      dsr,
      totalGeral
    })

  } catch (error) {
    console.error("Error in overtime calculation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
