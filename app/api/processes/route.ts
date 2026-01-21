import { NextResponse } from "next/server"
import { DataJudClient } from "@/lib/datajud/client"
import { ProcessService } from "@/lib/datajud/db"
import { createClient } from "@/lib/supabase/server"
import { getPlanLimits } from "@/lib/permissions"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { cnj } = body

    if (!cnj) {
      return NextResponse.json({ error: "CNJ number is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    let organizationId: string | undefined

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single()
      
      organizationId = profile?.organization_id

      if (organizationId) {
        const { data: subs } = await supabase
          .from("subscriptions")
          .select("plan")
          .eq("organization_id", organizationId)
          .single()

        const plan = subs?.plan || "free"
        const limits = getPlanLimits(plan)

        if (limits.max_queries !== Infinity) {
          const today = new Date().toISOString().split('T')[0]
          const { data: usage } = await supabase
        .from("usage_logs")
        .select("count")
        .eq("organization_id", organizationId)
        .eq("action", "consultation_query")
        .eq("date", today)
        .single()

      if ((usage?.count || 0) >= limits.max_queries) {
        return NextResponse.json({ 
          error: `Limite diário de consultas atingido para o plano ${plan} (${limits.max_queries}). Faça upgrade para continuar.` 
        }, { status: 403 })
      }
    }
  }
}

    // 1. Consult DataJud
    const dataJudResult = await DataJudClient.consultProcess(cnj)
    
    if (!dataJudResult) {
      return NextResponse.json({ error: "Process not found in DataJud" }, { status: 404 })
    }

    // 2. Save to DB
    const savedProcess = await ProcessService.saveProcess(dataJudResult)

    if (organizationId) {
      const today = new Date().toISOString().split('T')[0]
      await supabase.rpc('increment_usage_log', {
        org_id: organizationId,
        action_name: 'consultation_query',
        log_date: today
      })
    }

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
