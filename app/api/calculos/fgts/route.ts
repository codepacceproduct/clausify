
import { NextResponse } from "next/server"
import { differenceInMonths } from "date-fns"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { salario, dataAdmissao, dataCalculo } = body

    if (!salario || !dataAdmissao || !dataCalculo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const sal = parseFloat(salario)
    const start = new Date(dataAdmissao)
    const end = new Date(dataCalculo)

    if (isNaN(sal) || isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      )
    }

    // Logic: 
    // FGTS = 8% per month.
    // Correction (JAM) varies. 
    // Mock logic: 8% * months.
    // + Mock Interest/Correction.
    
    const months = differenceInMonths(end, start)
    
    // Total FGTS deposited (without interest)
    const saldoTotal = (sal * 0.08) * months
    
    // Mock Interest/Correction
    // In reality, this requires a table of indices per month.
    const jurosMora = saldoTotal * 0.03 // Mock 3%
    const correcao = saldoTotal * 0.15 // Mock 15%
    
    const total = saldoTotal + jurosMora + correcao

    return NextResponse.json({
      saldoTotal,
      jurosMora,
      correcao,
      total,
      meta: {
          months
      }
    })

  } catch (error) {
    console.error("Error in FGTS calculation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
