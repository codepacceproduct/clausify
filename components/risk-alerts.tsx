import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Info, AlertCircle } from "lucide-react"

const alerts = [
  {
    type: "high" as const,
    title: "Cláusula de Garantia",
    contract: "Indústria Delta",
    description: "Garantia excessiva identificada",
    time: "Há 1 hora",
  },
  {
    type: "medium" as const,
    title: "Prazo de Vigência",
    contract: "Construtora Beta",
    description: "Prazo indeterminado requer atenção",
    time: "Há 3 horas",
  },
  {
    type: "low" as const,
    title: "Atualização Monetária",
    contract: "Imobiliária Gamma",
    description: "Índice de correção sugerido",
    time: "Há 5 horas",
  },
  {
    type: "medium" as const,
    title: "Rescisão Antecipada",
    contract: "Startup Epsilon",
    description: "Multa não especificada",
    time: "Há 1 dia",
  },
]

export function RiskAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Risco</CardTitle>
        <CardDescription>Cláusulas que requerem atenção</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
