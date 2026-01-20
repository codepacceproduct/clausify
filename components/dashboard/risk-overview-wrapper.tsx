import { createClient } from "@/lib/supabase/server"
import { RiskOverviewChart } from "@/components/risk-overview-chart"

async function getRiskOverview() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("contracts")
    .select("risk_level")
    .limit(1000)

  const counts = { low: 0, medium: 0, high: 0 } as Record<string, number>
  data?.forEach((row) => {
    const risk = (row.risk_level === 'low' || row.risk_level === 'medium' || row.risk_level === 'high') ? row.risk_level : 'medium'
    counts[risk]++
  })
  return [
    { name: "Risco Baixo", value: counts.low, color: "#10b981" },
    { name: "Risco Médio", value: counts.medium, color: "#f59e0b" },
    { name: "Risco Alto", value: counts.high, color: "#ef4444" },
  ]
}

export async function RiskOverviewWrapper() {
  const data = await getRiskOverview()
  return <RiskOverviewChart data={data} />
}
