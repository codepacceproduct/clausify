"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, FileText, AlertTriangle, CheckCircle2, Clock } from "lucide-react"

type Contract = {
  id: string
  title: string
  client: string | null
  value: string | null
  type: string | null
  status: string | null
  risk_score: number | null
  created_at: string
  updated_at: string | null
}

export function DashboardMetrics() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) {
        setLoading(false)
        return
      }
      const res = await fetch("/api/contracts", { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      setContracts(json?.contracts || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const analyzedStatuses = new Set(["approved", "active"])
  const pendingStatuses = new Set(["draft", "review"]) 

  const analyzedCount = contracts.filter((c) => analyzedStatuses.has((c.status || "").toLowerCase())).length
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()
  const prevMonth = (month + 11) % 12
  const prevYear = prevMonth === 11 ? year - 1 : year

  const inMonth = (d: Date, m: number, y: number) => d.getMonth() === m && d.getFullYear() === y
  const analyzedThisMonth = contracts.filter((c) => {
    const dt = new Date(c.created_at)
    return inMonth(dt, month, year) && analyzedStatuses.has((c.status || "").toLowerCase())
  }).length
  const analyzedPrevMonth = contracts.filter((c) => {
    const dt = new Date(c.created_at)
    return inMonth(dt, prevMonth, prevYear) && analyzedStatuses.has((c.status || "").toLowerCase())
  }).length
  const analyzedDelta = analyzedPrevMonth === 0 ? 100 : ((analyzedThisMonth - analyzedPrevMonth) / analyzedPrevMonth) * 100

  const riskValues = contracts.map((c) => c.risk_score ?? 0).filter((v) => typeof v === "number")
  const avgRisk = riskValues.length ? riskValues.reduce((a, b) => a + b, 0) / riskValues.length : 0
  const avgRiskLabel = avgRisk >= 67 ? "Alto" : avgRisk >= 34 ? "Médio" : "Baixo"

  const prevMonthRiskValues = contracts
    .filter((c) => inMonth(new Date(c.created_at), prevMonth, prevYear))
    .map((c) => c.risk_score ?? 0)
  const prevAvgRisk = prevMonthRiskValues.length
    ? prevMonthRiskValues.reduce((a, b) => a + b, 0) / prevMonthRiskValues.length
    : avgRisk
  const riskDelta = prevAvgRisk === 0 ? 0 : ((avgRisk - prevAvgRisk) / prevAvgRisk) * 100

  const pct = (num: number, den: number) => (den === 0 ? 0 : Math.round((num / den) * 1000) / 10)
  const inQuarter = (d: Date, qStartMonth: number, y: number) => d.getFullYear() === y && d.getMonth() >= qStartMonth && d.getMonth() < qStartMonth + 3
  const qStart = Math.floor(month / 3) * 3

  const monthContracts = contracts.filter((c) => inMonth(new Date(c.created_at), month, year))
  const prevMonthContracts = contracts.filter((c) => inMonth(new Date(c.created_at), prevMonth, prevYear))
  const quarterContracts = contracts.filter((c) => inQuarter(new Date(c.created_at), qStart, year))

  const complianceThisMonth = pct(
    monthContracts.filter((c) => analyzedStatuses.has((c.status || "").toLowerCase())).length,
    monthContracts.length,
  )
  const compliancePrevMonth = pct(
    prevMonthContracts.filter((c) => analyzedStatuses.has((c.status || "").toLowerCase())).length,
    prevMonthContracts.length,
  )
  const complianceQuarter = pct(
    quarterContracts.filter((c) => analyzedStatuses.has((c.status || "").toLowerCase())).length,
    quarterContracts.length,
  )

  const latestDate = contracts.length
    ? new Date(
        contracts
          .map((c) => c.updated_at || c.created_at)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] || now.toISOString(),
      )
    : null

  const timeAgo = latestDate
    ? (() => {
        const diffMs = Date.now() - latestDate.getTime()
        const diffH = Math.floor(diffMs / 3600000)
        const diffM = Math.floor((diffMs % 3600000) / 60000)
        if (diffH > 0) return `${diffH}h atrás`
        return `${diffM}min atrás`
      })()
    : "N/A"

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contratos Analisados</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analyzedCount}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {(analyzedDelta >= 0 ? (
              <TrendingUp className="h-3 w-3 text-success" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            ))}
            <span className={analyzedDelta >= 0 ? "text-success" : "text-destructive"}>
              {`${(Math.abs(analyzedDelta)).toFixed(1)}%`}
            </span>{" "}
            este mês
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Risco Médio</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-2 flex-wrap">
            {Math.round(avgRisk)}
            <Badge
              className={
                avgRiskLabel === "Baixo"
                  ? "bg-success/10 text-success"
                  : avgRiskLabel === "Médio"
                    ? "bg-amber-500/10 text-amber-600"
                    : "bg-destructive/10 text-destructive"
              }
            >
              {avgRiskLabel}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {(riskDelta <= 0 ? (
              <TrendingDown className="h-3 w-3 text-success" />
            ) : (
              <TrendingUp className="h-3 w-3 text-destructive" />
            ))}
            <span className={riskDelta <= 0 ? "text-success" : "text-destructive"}>
              {`${Math.abs(riskDelta).toFixed(1)}%`}
            </span>{" "}
            vs mês anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conformidade</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{`${complianceThisMonth}%`}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {(complianceThisMonth - compliancePrevMonth >= 0 ? (
              <TrendingUp className="h-3 w-3 text-success" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            ))}
            <span className={complianceThisMonth - compliancePrevMonth >= 0 ? "text-success" : "text-destructive"}>
              {`${Math.abs(complianceThisMonth - compliancePrevMonth).toFixed(1)}%`}
            </span>{" "}
            vs mês anterior
          </p>
          <p className="text-xs text-muted-foreground mt-1">Este trimestre: {`${complianceQuarter}%`}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Última Análise</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{timeAgo}</div>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {contracts[0]?.title || ""}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
