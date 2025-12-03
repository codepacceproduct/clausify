import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Info, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

type AlertType = "low" | "medium" | "high"

async function fetchAlerts() {
  const { data } = await supabase
    .from("approvals")
    .select("contract_name, priority, submitted_at")
    .order("submitted_at", { ascending: false })
    .limit(10)

  return (
    data?.map((row) => ({
      type: (row.priority ?? "medium") as AlertType,
      title: "Aprovação em destaque",
      contract: row.contract_name ?? "Contrato",
      description: row.priority === "high"
        ? "Prioridade alta"
        : row.priority === "low"
          ? "Prioridade baixa"
          : "Prioridade média",
      time: new Date(row.submitted_at).toLocaleString("pt-BR"),
    })) ?? []
  )
}

export async function RiskAlerts() {
  const alerts = await fetchAlerts()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Risco</CardTitle>
        <CardDescription>Cláusulas que requerem atenção</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 && (
            <p className="text-sm text-muted-foreground">No momento não há dados.</p>
          )}
          {alerts.map((alert, index) => (
            <div key={index} className="flex gap-3 pb-4 border-b last:border-0">
              <div className="flex-shrink-0">
                {alert.type === "high" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                )}
                {alert.type === "medium" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  </div>
                )}
                {alert.type === "low" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                    <Info className="h-4 w-4 text-blue-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.contract}</p>
                <p className="text-xs text-muted-foreground">{alert.description}</p>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
