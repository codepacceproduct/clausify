import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const contracts = [
  {
    client: "Empresa Alpha Tech",
    type: "Prestação de Serviços",
    risk: "low" as const,
    date: "Há 2 horas",
    value: "R$ 250.000",
    status: "Aprovado",
  },
  {
    client: "Construtora Beta",
    type: "Contrato de Obra",
    risk: "medium" as const,
    date: "Há 5 horas",
    value: "R$ 1.800.000",
    status: "Em Análise",
  },
  {
    client: "Imobiliária Gamma",
    type: "Locação Comercial",
    risk: "low" as const,
    date: "Há 8 horas",
    value: "R$ 45.000",
    status: "Aprovado",
  },
  {
    client: "Indústria Delta",
    type: "Fornecimento",
    risk: "high" as const,
    date: "Há 1 dia",
    value: "R$ 3.200.000",
    status: "Revisão",
  },
  {
    client: "Startup Epsilon",
    type: "Investimento",
    risk: "medium" as const,
    date: "Há 2 dias",
    value: "R$ 500.000",
    status: "Em Análise",
  },
]

export function RecentContracts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Contratos Recentes</CardTitle>
        <CardDescription className="text-sm">Últimas análises realizadas pela plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
