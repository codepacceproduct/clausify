import { createClient } from "@/lib/supabase/server"
import { ContractActivityChart } from "@/components/contract-activity-chart"

async function getActivityData() {
  const since = new Date()
  since.setMonth(since.getMonth() - 6)

  const supabase = await createClient()
  const { data } = await supabase
    .from("contracts")
    .select("status, created_at")
    .gte("created_at", since.toISOString())
    .limit(5000)

  const months: { [key: string]: { analisados: number; pendentes: number } } = {}
  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

  data?.forEach((row) => {
    const d = new Date(row.created_at)
    const key = `${monthNames[d.getMonth()]}`
    if (!months[key]) months[key] = { analisados: 0, pendentes: 0 }
    
    // Logic: analyzed -> analisados, uploaded -> pendentes
    if (row.status === "analyzed") months[key].analisados++
    else months[key].pendentes++
  })

  // Order last 6 months
  const now = new Date()
  const result: { month: string; analisados: number; pendentes: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const m = new Date(now.getFullYear(), now.getMonth() - i, 1).getMonth()
    // Handle negative months logic if needed, but getMonth handles wrapping?
    // Wait, new Date(y, m, d) handles m being negative or > 11.
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const mIndex = date.getMonth()
    const name = monthNames[mIndex]
    const entry = months[name] ?? { analisados: 0, pendentes: 0 }
    result.push({ month: name, analisados: entry.analisados, pendentes: entry.pendentes })
  }
  return result
}

export async function ActivityDataWrapper() {
  const data = await getActivityData()
  return <ContractActivityChart data={data} />
}
