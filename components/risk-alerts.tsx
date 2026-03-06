import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Info, AlertCircle, Bell } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

type AlertType = "low" | "medium" | "high"

async function fetchAlerts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("approvals")
    .select("contract_name, priority, submitted_at")
    .order("submitted_at", { ascending: false })
    .limit(10)

  return (
    data?.map((row) => ({
      type: (row.priority ?? "medium") as AlertType,
      title: "Nova Aprovação",
      contract: row.contract_name ?? "Contrato",
      description: row.priority === "high"
        ? "Requer atenção imediata (Prioridade Alta)"
        : row.priority === "low"
          ? "Aprovação de rotina (Prioridade Baixa)"
          : "Aprovação padrão (Prioridade Média)",
      time: new Date(row.submitted_at).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' }),
    })) ?? []
  )
}

export async function RiskAlerts() {
  const alerts = await fetchAlerts()
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold">Alertas e Notificações</CardTitle>
            <CardDescription>Atividades recentes que requerem sua atenção</CardDescription>
          </div>
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <p>Tudo tranquilo! Nenhum alerta pendente.</p>
            </div>
          )}
          {alerts.map((alert, index) => (
            <div key={index} className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
              <div className="flex-shrink-0 mt-1">
                {alert.type === "high" && (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20">
                    <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  </div>
                )}
                {alert.type === "medium" && (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                )}
                {alert.type === "low" && (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold truncate">{alert.contract}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{alert.time}</span>
                </div>
                <p className="text-xs font-medium text-foreground/80 mt-0.5">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{alert.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
