"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts"

type RiskDatum = { name: string; value: number; color: string }

export function RiskOverviewChart({ data }: { data: RiskDatum[] }) {
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
              label={({ name, percent }) => {
                if (percent === 0) return null
                return `${name}: ${(percent * 100).toFixed(0)}%`
              }}
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
