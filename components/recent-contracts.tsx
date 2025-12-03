import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

type Risk = "low" | "medium" | "high"

async function fetchRecentContracts() {
  const { data } = await supabase
    .from("contract_versions")
    .select("contract_name, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  // Map DB statuses to risk tags heuristically
  const statusToRisk: Record<string, Risk> = {
    approved: "low",
    active: "low",
    review: "medium",
    draft: "medium",
    expired: "high",
  }

  return (
    data?.map((row) => ({
      client: row.contract_name ?? "Contrato",
      type: row.status ?? "—",
      risk: statusToRisk[row.status ?? "review"] ?? "medium",
      date: new Date(row.created_at).toLocaleString("pt-BR"),
      value: "—",
      status: row.status ?? "—",
    })) ?? []
  )
}

export async function RecentContracts() {
  const contracts = await fetchRecentContracts()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Contratos Recentes</CardTitle>
        <CardDescription className="text-sm">Últimas análises realizadas pela plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contracts.length === 0 && (
            <p className="text-sm text-muted-foreground">No momento não há dados.</p>
          )}
          {contracts.map((contract, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b last:border-0"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{contract.client}</p>
                  <Badge
                    variant={
                      contract.risk === "low" ? "default" : contract.risk === "medium" ? "secondary" : "destructive"
                    }
                    className={
                      contract.risk === "low"
                        ? "bg-success/10 text-success hover:bg-success/20"
                        : contract.risk === "medium"
                          ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                          : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    }
                  >
                    {contract.risk === "low" ? "Baixo" : contract.risk === "medium" ? "Médio" : "Alto"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <span>{contract.type}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{contract.value}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{contract.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <span className="text-xs text-muted-foreground">{contract.date}</span>
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                  Ver relatório
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
