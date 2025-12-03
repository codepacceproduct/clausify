"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

export function ContractActivityChart() {
  const [data, setData] = useState<{ month: string; analisados: number; pendentes: number }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) return
      const res = await fetch("/api/contracts", { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      const contracts = (json?.contracts || []) as Array<{ status: string | null; created_at: string }>
      const analyzedStatuses = new Set(["approved", "active"])
      const pendingStatuses = new Set(["draft", "review"]) 
      const now = new Date()
      const months = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
        return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("pt-BR", { month: "short" }) }
      })
      const agg = months.map(({ key, label }) => ({ key, label, analisados: 0, pendentes: 0 }))
      for (const c of contracts) {
        const dt = new Date(c.created_at)
        const key = `${dt.getFullYear()}-${dt.getMonth()}`
        const bucket = agg.find((a) => a.key === key)
        if (!bucket) continue
        const status = (c.status || "").toLowerCase()
        if (analyzedStatuses.has(status)) bucket.analisados++
        else if (pendingStatuses.has(status)) bucket.pendentes++
      }
      setData(agg.map((a) => ({ month: a.label, analisados: a.analisados, pendentes: a.pendentes })))
    }
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Mensal</CardTitle>
        <CardDescription>Contratos analisados e pendentes nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="analisados" fill="#10b981" radius={[4, 4, 0, 0]} name="Analisados" />
            <Bar dataKey="pendentes" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pendentes" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
