"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Risco Baixo", value: 542, color: "#10b981" },
  { name: "Risco Médio", value: 438, color: "#f59e0b" },
  { name: "Risco Alto", value: 304, color: "#ef4444" },
]

export function RiskOverviewChart() {
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
