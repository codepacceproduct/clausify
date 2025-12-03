"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Item = {
  client: string
  type: string
  risk: "low" | "medium" | "high"
  date: string
  value: string
  status: string
}

export function RecentContracts() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) return
      const res = await fetch("/api/contracts", { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      const contracts = (json?.contracts || []) as Array<{
        client: string | null
        type: string | null
        risk_score: number | null
        created_at: string
        value: string | null
        status: string | null
      }>
      const fmt = (dateStr: string) => {
        const dt = new Date(dateStr)
        const diffMs = Date.now() - dt.getTime()
        const h = Math.floor(diffMs / 3600000)
        if (h < 24) return `Há ${h} horas`
        const d = Math.floor(h / 24)
        return `Há ${d} dias`
      }
      const mapped = contracts
        .slice(0, 5)
        .map((c) => ({
          client: c.client || "",
          type: c.type || "",
          risk: (c.risk_score ?? 0) >= 67 ? "high" : (c.risk_score ?? 0) >= 34 ? "medium" : "low",
          date: fmt(c.created_at),
          value: c.value || "",
          status: c.status || "",
        }))
      setItems(mapped)
    }
    fetchData()
  }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Contratos Recentes</CardTitle>
        <CardDescription className="text-sm">Últimas análises realizadas pela plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((contract, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b last:border-0"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{contract.client}</p>
                  <Badge
                    variant={
                      contract.risk === "low" ? "default" : contract.risk === "medium" ? "secondary" : "destructive"
                    }
                    className={
                      contract.risk === "low"
                        ? "bg-success/10 text-success hover:bg-success/20"
                        : contract.risk === "medium"
                          ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                          : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    }
                  >
                    {contract.risk === "low" ? "Baixo" : contract.risk === "medium" ? "Médio" : "Alto"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <span>{contract.type}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{contract.value}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{contract.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <span className="text-xs text-muted-foreground">{contract.date}</span>
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                  Ver relatório
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
