import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, UserCheck, Award, ArrowUp, ArrowDown } from "lucide-react"

interface WaitlistStatsProps {
  stats: {
    total: number
    pending: number
    contacted: number
    converted: number
    todaySignups: number
    conversionRate: number
  }
}

export function WaitlistStats({ stats }: WaitlistStatsProps) {
  const statCards = [
    {
      title: "Total de Leads",
      value: stats.total,
      icon: Users,
      description: `+${stats.todaySignups} hoje`,
      trend: "up",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Pendentes",
      value: stats.pending,
      icon: TrendingUp,
      description: "Aguardando contato",
      trend: "neutral",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Contatados",
      value: stats.contacted,
      icon: UserCheck,
      description: "Em processo",
      trend: "up",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Taxa de Conversão",
      value: `${stats.conversionRate}%`,
      icon: Award,
      description: `${stats.converted} convertidos`,
      trend: "up",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              {stat.trend === "up" && <ArrowUp className="h-3 w-3 text-emerald-500" />}
              {stat.trend === "down" && <ArrowDown className="h-3 w-3 text-red-500" />}
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
