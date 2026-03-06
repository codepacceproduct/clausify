"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

type ActivityDatum = { month: string; analisados: number; pendentes: number }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-popover p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-emerald-500">
              {payload[0].value} Analisados
            </span>
            <span className="font-bold text-amber-500">
              {payload[1].value} Pendentes
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function ContractActivityChart({ data }: { data: ActivityDatum[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Atividade Mensal</CardTitle>
        <CardDescription>Volume de análise nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              dx={-10}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: "hsl(var(--muted)/0.2)" }}
            />
            <Legend 
              verticalAlign="top" 
              align="right"
              wrapperStyle={{ paddingBottom: "20px" }}
              formatter={(value) => <span className="text-sm font-medium text-muted-foreground ml-1">{value}</span>}
            />
            <Bar 
              dataKey="analisados" 
              name="Analisados"
              fill="#10b981" 
              radius={[4, 4, 0, 0]} 
              barSize={30}
            />
            <Bar 
              dataKey="pendentes" 
              name="Pendentes"
              fill="#f59e0b" 
              radius={[4, 4, 0, 0]} 
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
