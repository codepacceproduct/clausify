import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, FileText, AlertTriangle, CheckCircle2, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

async function getMetrics() {
  const supabase = await createClient()
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
  const getDeltaColor = (n: number) => (n < 0 ? "text-rose-500" : n === 0 ? "text-amber-500" : "text-emerald-500")
  
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Contratos Analisados */}
      <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contratos Analisados</p>
              <h3 className="text-3xl font-bold mt-2">{metrics.totalContracts}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            {metrics.analisadosDelta < 0 ? (
              <TrendingDown className={`h-3 w-3 mr-1 ${getDeltaColor(metrics.analisadosDelta)}`} />
            ) : (
              <TrendingUp className={`h-3 w-3 mr-1 ${getDeltaColor(metrics.analisadosDelta)}`} />
            )}
            <span className={`font-medium ${getDeltaColor(metrics.analisadosDelta)}`}>
              {metrics.analisadosDelta > 0 ? "+" : ""}{metrics.analisadosDelta}%
            </span>
            <span className="text-muted-foreground ml-1">vs mês anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* Risco Médio */}
      <Card className={`border-l-4 shadow-sm hover:shadow-md transition-shadow ${
        metrics.riskLevel === 'low' ? 'border-l-emerald-500' :
        metrics.riskLevel === 'medium' ? 'border-l-amber-500' :
        'border-l-rose-500'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Risco Médio</p>
              <h3 className="text-3xl font-bold mt-2">{metrics.riskLabel}</h3>
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              metrics.riskLevel === 'low' ? 'bg-emerald-500/10 text-emerald-500' :
              metrics.riskLevel === 'medium' ? 'bg-amber-500/10 text-amber-500' :
              'bg-rose-500/10 text-rose-500'
            }`}>
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            {metrics.riskDelta < 0 ? (
              <TrendingDown className={`h-3 w-3 mr-1 ${getDeltaColor(metrics.riskDelta)}`} />
            ) : (
              <TrendingUp className={`h-3 w-3 mr-1 ${getDeltaColor(metrics.riskDelta)}`} />
            )}
            <span className={`font-medium ${getDeltaColor(metrics.riskDelta)}`}>
              {metrics.riskDelta > 0 ? "+" : ""}{metrics.riskDelta}%
            </span>
            <span className="text-muted-foreground ml-1">vs mês anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* Conformidade */}
      <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conformidade</p>
              <h3 className="text-3xl font-bold mt-2">{metrics.conformidade}%</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <div className="mt-4 w-full bg-secondary/50 rounded-full h-1.5 mb-2">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${metrics.conformidade}%` }}
            />
          </div>
          <div className="flex items-center text-xs">
            {metrics.conformidadeDelta < 0 ? (
              <TrendingDown className={`h-3 w-3 mr-1 ${getDeltaColor(metrics.conformidadeDelta)}`} />
            ) : (
              <TrendingUp className={`h-3 w-3 mr-1 ${getDeltaColor(metrics.conformidadeDelta)}`} />
            )}
            <span className={`font-medium ${getDeltaColor(metrics.conformidadeDelta)}`}>
              {metrics.conformidadeDelta > 0 ? "+" : ""}{metrics.conformidadeDelta}%
            </span>
            <span className="text-muted-foreground ml-1">este trimestre</span>
          </div>
        </CardContent>
      </Card>

      {/* Tempo Economizado */}
      <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tempo Economizado</p>
              <h3 className="text-3xl font-bold mt-2">{metrics.savedHours}h</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Zap className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-muted-foreground">
            <span className="font-medium text-foreground mr-1">~2 horas</span>
            por contrato analisado automaticamente
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
