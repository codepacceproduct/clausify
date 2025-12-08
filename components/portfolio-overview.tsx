"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Calendar, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Bar, BarChart, XAxis, YAxis } from "recharts"
import { supabase } from "@/lib/supabase"

export function PortfolioOverview() {
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("approvals")
        .select("contract_name, client, value, type, deadline, priority, status, submitted_at")
        .limit(2000)
      setRows(data || [])
    }
    load()
  }, [])

  const parseValue = (v: string | null) => {
    if (!v) return 0
    const n = String(v).replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(/,/, ".")
    const x = parseFloat(n)
    return isNaN(x) ? 0 : x
  }

  const stats = useMemo(() => {
    const now = new Date()
    const totalValue = rows.reduce((acc, r) => acc + parseValue(r.value), 0)
    const activeCount = rows.filter((r) => String(r.status) === "active").length
    const expiringSoon = rows.filter((r) => {
      const d = r.deadline ? new Date(r.deadline) : null
      if (!d) return false
      const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diff > 0 && diff <= 30
    }).length
    const expiringValue = rows.reduce((acc, r) => {
      const d = r.deadline ? new Date(r.deadline) : null
      if (!d) return acc
      const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diff > 0 && diff <= 30 ? acc + parseValue(r.value) : acc
    }, 0)
    const highRisk = rows.filter((r) => String(r.priority) === "high").length
    const riskData = [
      { name: "Baixo", value: rows.filter((r) => String(r.priority) === "low").length, color: "#10b981" },
      { name: "Médio", value: rows.filter((r) => String(r.priority) === "medium").length, color: "#f59e0b" },
      { name: "Alto", value: highRisk, color: "#ef4444" },
    ]
    const byType: Record<string, { category: string; count: number; value: number }> = {}
    rows.forEach((r) => {
      const k = String(r.type || "Outros")
      if (!byType[k]) byType[k] = { category: k, count: 0, value: 0 }
      byType[k].count++
      byType[k].value += parseValue(r.value)
    })
    const categoryData = Object.values(byType)
    return { totalValue, activeCount, expiringSoon, expiringValue, highRisk, riskData, categoryData }
  }, [rows])

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total da Carteira</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.totalValue.toLocaleString("pt-BR")}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencendo em 30 dias</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground mt-1">Total: R$ {stats.expiringValue.toLocaleString("pt-BR")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos de Alto Risco</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highRisk}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Risco</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valor por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.categoryData}>
                <XAxis dataKey="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#1a2e40" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
