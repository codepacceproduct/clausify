import { NextResponse } from "next/server"
import { DataJudClient } from "@/lib/datajud/client"
import { ProcessService } from "@/lib/datajud/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { cnj } = body

    if (!cnj) {
      return NextResponse.json({ error: "CNJ number is required" }, { status: 400 })
    }

    // 1. Consult DataJud
    const dataJudResult = await DataJudClient.consultProcess(cnj)
    
    if (!dataJudResult) {
      return NextResponse.json({ error: "Process not found in DataJud" }, { status: 404 })
    }

    // 2. Save to DB
    const savedProcess = await ProcessService.saveProcess(dataJudResult)

    return NextResponse.json({ 
      success: true, 
      process: savedProcess,
      data: dataJudResult 
    })
  } catch (error) {
    console.error("Error in process API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cnj = searchParams.get('cnj')

  if (cnj) {
    const process = await ProcessService.getProcess(cnj)
    if (process) {
      return NextResponse.json(process)
    }
    return NextResponse.json({ error: "Process not found locally" }, { status: 404 })
  }

  return NextResponse.json({ error: "CNJ parameter required" }, { status: 400 })
}
