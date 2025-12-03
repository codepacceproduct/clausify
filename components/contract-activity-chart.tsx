"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  { month: "Jan", analisados: 186, pendentes: 42 },
  { month: "Fev", analisados: 205, pendentes: 38 },
  { month: "Mar", analisados: 237, pendentes: 31 },
  { month: "Abr", analisados: 273, pendentes: 45 },
  { month: "Mai", analisados: 209, pendentes: 28 },
  { month: "Jun", analisados: 214, pendentes: 35 },
]

export function ContractActivityChart() {
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
