import { MonitoramentoContent } from "@/components/consultas/monitoramento-content"
import { getMonitoredProcesses } from "@/actions/monitoring"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MonitoredProcess } from "@/components/consultas/monitoring-list"

export default async function MonitoramentoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const processes = await getMonitoredProcesses()

  return (
    <MonitoramentoContent initialProcesses={processes as MonitoredProcess[]} />
  )
}
