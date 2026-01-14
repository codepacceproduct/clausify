import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"
import { DataJudClient } from "@/lib/datajud/client"
import { ProcessService } from "@/lib/datajud/db"

// This route should be called by a Cron Job (e.g. Vercel Cron)
// GET /api/cron/monitor
export async function GET(req: Request) {
  // Optional: Verify secret header for security
  // const authHeader = req.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) { ... }

  const supabase = createClient()
  
  try {
    // 1. Create Job Record
    const { data: job, error: jobError } = await supabase
      .from('monitoring_jobs')
      .insert({ status: 'running' })
      .select()
      .single()

    if (jobError) throw jobError

    // 2. Fetch active processes
    const { data: processes } = await supabase
      .from('judicial_processes')
      .select('cnj_number, last_movement_hash')
      .eq('status', 'active')

    let checked = 0
    let newMovements = 0

    if (processes) {
      for (const proc of processes) {
        checked++
        
        // Consult DataJud
        const data = await DataJudClient.consultProcess(proc.cnj_number)
        
        if (data) {
          // Compare Hash
          const latestMov = data.movimentos?.[0]
          if (latestMov) {
            const details = latestMov.complementosTabelados?.map(c => c.descricao).join(", ") || ""
            const currentHash = DataJudClient.generateMovementHash(latestMov.dataHora, latestMov.nome, details)

            if (currentHash !== proc.last_movement_hash) {
              // Update Process & Save new movements
              await ProcessService.saveProcess(data)
              newMovements++
            }
          }
        }
      }
    }

    // 3. Update Job Record
    await supabase
      .from('monitoring_jobs')
      .update({
        status: 'success',
        finished_at: new Date().toISOString(),
        processes_checked: checked,
        new_movements_found: newMovements
      })
      .eq('id', job.id)

    return NextResponse.json({ 
      success: true, 
      checked, 
      newMovements 
    })

  } catch (error) {
    console.error("Monitoring Job Error:", error)
    return NextResponse.json({ error: "Job Failed" }, { status: 500 })
  }
}
