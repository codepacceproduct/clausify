"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function RiskOverviewChart() {
  const [data, setData] = useState<{ name: string; value: number; color: string }[]>([
    { name: "Risco Baixo", value: 0, color: "#10b981" },
    { name: "Risco Médio", value: 0, color: "#f59e0b" },
    { name: "Risco Alto", value: 0, color: "#ef4444" },
  ])

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) return
      const res = await fetch("/api/contracts", { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      const contracts = (json?.contracts || []) as Array<{ risk_score: number | null }>
      const buckets = { low: 0, medium: 0, high: 0 }
      for (const c of contracts) {
        const s = c.risk_score ?? 0
        if (s >= 67) buckets.high++
        else if (s >= 34) buckets.medium++
        else buckets.low++
      }
      setData([
        { name: "Risco Baixo", value: buckets.low, color: "#10b981" },
        { name: "Risco Médio", value: buckets.medium, color: "#f59e0b" },
        { name: "Risco Alto", value: buckets.high, color: "#ef4444" },
      ])
    }
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Distribuição de Risco</CardTitle>
        <CardDescription className="text-sm">Classificação de contratos por nível de risco</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280} className="sm:h-[300px]">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
