"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Info, AlertCircle } from "lucide-react"

type AlertItem = { type: "high" | "medium" | "low"; title: string; contract: string; description: string; time: string }

export function RiskAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) return
      const res = await fetch("/api/contracts", { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      const contracts = (json?.contracts || []) as Array<{ client: string | null; risk_score: number | null; created_at: string }>
      const fmt = (dateStr: string) => {
        const dt = new Date(dateStr)
        const diffMs = Date.now() - dt.getTime()
        const h = Math.floor(diffMs / 3600000)
        if (h < 24) return `Há ${h} horas`
        const d = Math.floor(h / 24)
        return `Há ${d} dias`
      }
      const highRisk = contracts
        .filter((c) => (c.risk_score ?? 0) >= 80)
        .slice(0, 4)
        .map((c) => ({
          type: "high" as const,
          title: "Risco alto",
          contract: c.client || "",
          description: `Pontuação de risco ${Math.round(c.risk_score ?? 0)}`,
          time: fmt(c.created_at),
        }))
      setAlerts(highRisk)
    }
    fetchData()
  }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Risco</CardTitle>
        <CardDescription>Cláusulas que requerem atenção</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div key={index} className="flex gap-3 pb-4 border-b last:border-0">
              <div className="flex-shrink-0">
                {alert.type === "high" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                )}
                {alert.type === "medium" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  </div>
                )}
                {alert.type === "low" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                    <Info className="h-4 w-4 text-blue-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.contract}</p>
                <p className="text-xs text-muted-foreground">{alert.description}</p>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
