import { LayoutWrapper } from "@/components/layout-wrapper"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { RiskOverviewChart } from "@/components/risk-overview-chart"
import { ContractActivityChart } from "@/components/contract-activity-chart"
import { RecentContracts } from "@/components/recent-contracts"
import { RiskAlerts } from "@/components/risk-alerts"
import { supabase } from "@/lib/supabase"

async function getRiskOverview() {
  const { data } = await supabase
    .from("approvals")
    .select("priority")
    .limit(1000)

  const counts = { low: 0, medium: 0, high: 0 } as Record<string, number>
  data?.forEach((row) => {
    if (row.priority && counts[row.priority] !== undefined) counts[row.priority]++
  })
  return [
    { name: "Risco Baixo", value: counts.low, color: "#10b981" },
    { name: "Risco Médio", value: counts.medium, color: "#f59e0b" },
    { name: "Risco Alto", value: counts.high, color: "#ef4444" },
  ]
}

async function getActivityData() {
  const since = new Date()
  since.setMonth(since.getMonth() - 6)

  const { data } = await supabase
    .from("contract_versions")
    .select("status, created_at")
    .gte("created_at", since.toISOString())
    .limit(5000)

  const months: { [key: string]: { analisados: number; pendentes: number } } = {}
  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

  data?.forEach((row) => {
    const d = new Date(row.created_at)
    const key = `${monthNames[d.getMonth()]}`
    if (!months[key]) months[key] = { analisados: 0, pendentes: 0 }
    const isAnalyzed = row.status === "approved" || row.status === "active"
    const isPending = row.status === "review" || row.status === "draft"
    if (isAnalyzed) months[key].analisados++
    else if (isPending) months[key].pendentes++
  })

  // Order last 6 months
  const now = new Date()
  const result: { month: string; analisados: number; pendentes: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const m = new Date(now.getFullYear(), now.getMonth() - i, 1).getMonth()
    const name = monthNames[m]
    const entry = months[name] ?? { analisados: 0, pendentes: 0 }
    result.push({ month: name, analisados: entry.analisados, pendentes: entry.pendentes })
  }
  return result
}

export default async function DashboardPage() {
  const [riskData, activityData] = await Promise.all([getRiskOverview(), getActivityData()])
  return (
    <LayoutWrapper>
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Visão geral da sua carteira de contratos</p>
      </div>

      <DashboardMetrics />

      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
        <RiskOverviewChart data={riskData} />
        <ContractActivityChart data={activityData} />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentContracts />
        </div>
        <RiskAlerts />
      </div>
    </LayoutWrapper>
  )
}
