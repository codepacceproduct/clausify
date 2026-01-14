import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, FileText, AlertTriangle, CheckCircle2, Clock, Zap } from "lucide-react"
import { supabase } from "@/lib/supabase"

async function getMetrics() {
  const { count: totalContracts } = await supabase
    .from("contract_versions")
    .select("id", { count: "exact", head: true })

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  // Fetch last 6 months of versions for calculations
  const sinceSixMonths = new Date(now.getFullYear(), now.getMonth() - 6, 1)
  const { data: versions } = await supabase
    .from("contract_versions")
    .select("status, created_at, contract_name")
    .gte("created_at", sinceSixMonths.toISOString())
    .order("created_at", { ascending: false })

  const isAnalyzed = (s: string | null) => s === "approved" || s === "active"

  const analyzedThisMonth = (versions ?? []).filter(
    (v) => isAnalyzed(v.status) && new Date(v.created_at) >= monthStart && new Date(v.created_at) < nextMonthStart
  ).length

  const analyzedPrevMonth = (versions ?? []).filter(
    (v) => isAnalyzed(v.status) && new Date(v.created_at) >= prevMonthStart && new Date(v.created_at) < monthStart
  ).length

  const analisadosDelta = analyzedPrevMonth > 0
    ? Math.round(((analyzedThisMonth - analyzedPrevMonth) / analyzedPrevMonth) * 100)
    : analyzedThisMonth > 0
      ? 100
      : 0

  const approvedTotal = (versions ?? []).filter((v) => v.status === "approved").length
  const conformidade = totalContracts && totalContracts > 0 ? Math.round((approvedTotal / totalContracts) * 100) : 0

  // Conformidade QoQ: current quarter (last 3 months) vs previous quarter
  const quarterStart = new Date(now.getFullYear(), now.getMonth() - 2, 1)
  const prevQuarterStart = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  const prevQuarterEnd = new Date(now.getFullYear(), now.getMonth() - 2, 1)

  const quarterData = (versions ?? []).filter((v) => new Date(v.created_at) >= quarterStart)
  const prevQuarterData = (versions ?? []).filter(
    (v) => new Date(v.created_at) >= prevQuarterStart && new Date(v.created_at) < prevQuarterEnd
  )

  const quarterApproved = quarterData.filter((v) => v.status === "approved").length
  const quarterTotal = quarterData.length
  const prevQuarterApproved = prevQuarterData.filter((v) => v.status === "approved").length
  const prevQuarterTotal = prevQuarterData.length

  const quarterRatio = quarterTotal > 0 ? quarterApproved / quarterTotal : 0
  const prevQuarterRatio = prevQuarterTotal > 0 ? prevQuarterApproved / prevQuarterTotal : 0
  const conformidadeDelta = prevQuarterRatio > 0 ? Math.round(((quarterRatio - prevQuarterRatio) / prevQuarterRatio) * 100) : 0

  // Risk MoM: ratio of high priority approvals this month vs previous
  const { data: approvals } = await supabase
    .from("approvals")
    .select("priority, submitted_at")
    .gte("submitted_at", prevMonthStart.toISOString())

  const thisMonthApprovals = (approvals ?? []).filter((a) => new Date(a.submitted_at) >= monthStart && new Date(a.submitted_at) < nextMonthStart)
  const prevMonthApprovals = (approvals ?? []).filter((a) => new Date(a.submitted_at) >= prevMonthStart && new Date(a.submitted_at) < monthStart)

  const highThis = thisMonthApprovals.filter((a) => a.priority === "high").length
  const highPrev = prevMonthApprovals.filter((a) => a.priority === "high").length
  const ratioThis = thisMonthApprovals.length > 0 ? highThis / thisMonthApprovals.length : 0
  const ratioPrev = prevMonthApprovals.length > 0 ? highPrev / prevMonthApprovals.length : 0
  const riskDelta = ratioPrev > 0 ? Math.round(((ratioThis - ratioPrev) / ratioPrev) * 100) : 0

  // Current risk label from approvals distribution
  const prioCounts = { low: 0, medium: 0, high: 0 } as Record<string, number>
  thisMonthApprovals.forEach((a) => {
    if (a.priority && prioCounts[a.priority] !== undefined) prioCounts[a.priority]++
  })
  const maxPrio = Object.entries(prioCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "medium"
  const riskLabel = maxPrio === "low" ? "Baixo" : maxPrio === "high" ? "Alto" : "Médio"

  const last = versions?.[0]
  
  // Calculate saved hours (approx 2h per contract)
  const savedHours = (totalContracts ?? 0) * 2

  return {
    totalContracts: totalContracts ?? 0,
    conformidade,
    conformidadeDelta,
    lastContractName: last?.contract_name ?? "—",
    lastSince: last?.created_at ?? null,
    riskLevel: maxPrio,
    riskLabel,
    analisadosDelta,
    riskDelta,
    savedHours,
  }
}

export async function DashboardMetrics() {
  const metrics = await getMetrics()
  const getDeltaColor = (n: number) => (n < 0 ? "text-destructive" : n === 0 ? "text-amber-600" : "text-success")
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contratos Analisados</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalContracts}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {metrics.analisadosDelta < 0 ? (
              <TrendingDown className={`h-3 w-3 ${getDeltaColor(metrics.analisadosDelta)}`} />
            ) : (
              <TrendingUp className={`h-3 w-3 ${getDeltaColor(metrics.analisadosDelta)}`} />
            )}
            <span className={getDeltaColor(metrics.analisadosDelta)}>
              {metrics.analisadosDelta > 0 ? "+" : ""}{metrics.analisadosDelta}%
            </span>
            vs mês anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Risco Médio</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 mb-2">
            <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  metrics.riskLevel === 'low' ? 'bg-emerald-500 w-1/3' :
                  metrics.riskLevel === 'medium' ? 'bg-amber-500 w-2/3' :
                  'bg-red-500 w-full'
                }`}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-2xl font-bold">{metrics.riskLabel}</span>
             <p className="text-xs text-muted-foreground flex items-center gap-1">
                {metrics.riskDelta < 0 ? (
                  <TrendingDown className={`h-3 w-3 ${getDeltaColor(metrics.riskDelta)}`} />
                ) : (
                  <TrendingUp className={`h-3 w-3 ${getDeltaColor(metrics.riskDelta)}`} />
                )}
                <span className={getDeltaColor(metrics.riskDelta)}>
                  {metrics.riskDelta > 0 ? "+" : ""}{metrics.riskDelta}%
                </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conformidade</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.conformidade}%</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {metrics.conformidadeDelta < 0 ? (
              <TrendingDown className={`h-3 w-3 ${getDeltaColor(metrics.conformidadeDelta)}`} />
            ) : (
              <TrendingUp className={`h-3 w-3 ${getDeltaColor(metrics.conformidadeDelta)}`} />
            )}
            <span className={getDeltaColor(metrics.conformidadeDelta)}>
              {metrics.conformidadeDelta > 0 ? "+" : ""}{metrics.conformidadeDelta}%
            </span>
            este trimestre
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tempo Economizado</CardTitle>
          <Zap className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.savedHours} horas</div>
          <p className="text-xs text-muted-foreground mt-1">em processos manuais</p>
        </CardContent>
      </Card>
    </div>
  )
}
