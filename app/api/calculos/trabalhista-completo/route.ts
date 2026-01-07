
import { NextResponse } from "next/server"
import { differenceInMonths, differenceInDays } from "date-fns"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      salario,
      dataAdmissao,
      dataDemissao,
      incluirFerias,
      incluir13,
      incluirAviso
    } = body

    if (!salario || !dataAdmissao || !dataDemissao) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const start = new Date(dataAdmissao)
    const end = new Date(dataDemissao)
    const salary = parseFloat(salario)

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || isNaN(salary)) {
       return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      )
    }

    // Calculations
    const daysWorked = differenceInDays(end, start)
    const monthsWorked = differenceInMonths(end, start)

    // Saldo de Salário (last month days)
    const lastMonthDay = end.getDate()
    const saldoSalario = (salary / 30) * lastMonthDay

    // Férias (simplified logic: assumes no vacation taken)
    // Proportional vacation: months worked / 12 * salary
    // + 1/3
    let ferias = 0
    if (incluirFerias) {
        // Calculate proportional months for vacation (current period)
        // This is a simplification. In a real app, we'd need vacation history.
        // Assuming the employee hasn't taken vacation in the current vesting period.
        const monthsForVacation = monthsWorked % 12
        const proportionalVacation = (salary / 12) * monthsForVacation
        const vacationOneThird = proportionalVacation / 3
        
        // If worked more than a year, maybe expired vacations?
        // Let's stick to proportional for simplicity + 1 full vacation if > 1 year (mock assumption)
        const fullVacation = monthsWorked >= 12 ? salary + (salary/3) : 0

        ferias = proportionalVacation + vacationOneThird + fullVacation
    }

    // 13º Salário
    let decimoTerceiro = 0
    if (incluir13) {
        // Months worked in the current year
        const currentYearStart = new Date(end.getFullYear(), 0, 1)
        let monthsInYear = differenceInMonths(end, currentYearStart)
        if (monthsInYear < 0) monthsInYear = 0 // should not happen if dates are correct
        if (monthsInYear > 12) monthsInYear = 12 // cap
        
        // If admitted this year, count from admission
        if (start.getFullYear() === end.getFullYear()) {
            monthsInYear = differenceInMonths(end, start)
        }

        decimoTerceiro = (salary / 12) * monthsInYear
    }

    // Aviso Prévio
    let avisoPrevi = 0
    if (incluirAviso) {
        // 30 days + 3 days per year worked (max 90)
        const yearsWorked = Math.floor(monthsWorked / 12)
        const daysNotice = Math.min(30 + (yearsWorked * 3), 90)
        avisoPrevi = (salary / 30) * daysNotice
    }

    // FGTS (8% of salary for all months + 40% fine)
    // Mock: 8% * salary * months
    const totalFgtsDeposited = (salary * 0.08) * monthsWorked
    const multaFgts = totalFgtsDeposited * 0.4
    const fgts = totalFgtsDeposited

    const total = saldoSalario + ferias + decimoTerceiro + avisoPrevi + fgts + multaFgts

    return NextResponse.json({
      saldoSalario,
      ferias,
      decimoTerceiro,
      avisoPrevi,
      fgts,
      multaFgts,
      total,
      meta: {
          daysWorked,
          monthsWorked
      }
    })

  } catch (error) {
    console.error("Error in labor calculation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
