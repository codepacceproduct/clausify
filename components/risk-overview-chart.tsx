"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts"

type RiskDatum = { name: string; value: number; color: string }

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-popover p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {payload[0].name}
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[0].value}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function RiskOverviewChart({ data }: { data: RiskDatum[] }) {
  // Cores consistentes com o tema
  const COLORS = {
    "Risco Baixo": "#10b981", // Emerald 500
    "Risco Médio": "#f59e0b", // Amber 500
    "Risco Alto": "#ef4444",  // Rose 500
  }

  const processedData = data.map(item => ({
    ...item,
    color: COLORS[item.name as keyof typeof COLORS] || item.color
  }))

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold">Distribuição de Risco</CardTitle>
        <CardDescription>Classificação por nível de severidade</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={5}
                stroke="hsl(var(--card))" // Borda com a cor do card para efeito vazado
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-sm font-medium text-muted-foreground ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
