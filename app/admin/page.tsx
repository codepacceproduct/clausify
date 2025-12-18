import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getWaitlistStats } from "@/app/actions/waitlist"
import { TrendingUp, Users, CheckCircle2, Clock, Target, ArrowUpRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const stats = await getWaitlistStats()

  const contactedPercentage = stats.total > 0 ? Math.round((stats.contacted / stats.total) * 100) : 0
  const newLeadsPercentage = stats.total > 0 ? Math.round((stats.last7Days / stats.total) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Visão geral da plataforma administrativa</p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Leads</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Users className="w-3 h-3" />
              Total acumulado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aguardando Contato</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.pending}</div>
            <p className="text-xs text-amber-500 flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              Requer atenção
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contatados</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.contacted}</div>
            <p className="text-xs text-blue-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              Em follow-up
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conversão</CardTitle>
            <Target className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.conversionRate}%</div>
            <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              Baseado em convertidos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Crescimento da Lista de Espera
            </CardTitle>
            <CardDescription>Métricas de crescimento nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Novos leads (7 dias)</span>
              <span className="text-2xl font-bold text-emerald-400">+{stats.last7Days}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Média diária</span>
              <span className="text-2xl font-bold text-emerald-400">{(stats.last7Days / 7).toFixed(1)}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${newLeadsPercentage}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{newLeadsPercentage}% do total são novos leads</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Ações Pendentes
            </CardTitle>
            <CardDescription>Leads que precisam de atenção imediata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Aguardando primeiro contato</span>
              <span className="text-2xl font-bold text-amber-400">{stats.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Em processo de conversão</span>
              <span className="text-2xl font-bold text-blue-400">{stats.contacted}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${contactedPercentage}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{contactedPercentage}% em processo de conversão</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
