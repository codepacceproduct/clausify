import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, AlertTriangle, CheckCircle2, Clock, Download } from "lucide-react"

const analysisInProgress = [
  {
    id: 1,
    client: "Empresa Alpha Tech",
    type: "Prestação de Serviços",
    fileName: "contrato_alpha_tech_2025.pdf",
    progress: 75,
    status: "Analisando cláusulas",
    startedAt: "Há 15 minutos",
  },
  {
    id: 2,
    client: "Construtora Beta",
    type: "Contrato de Obra",
    fileName: "obra_comercial_beta.pdf",
    progress: 45,
    status: "Verificando conformidade",
    startedAt: "Há 28 minutos",
  },
]

const analysisCompleted = [
  {
    id: 3,
    client: "Imobiliária Gamma",
    type: "Locação Comercial",
    fileName: "locacao_gamma_shopping.pdf",
    risk: "low" as const,
    score: 92,
    completedAt: "Há 2 horas",
    issues: 2,
  },
  {
    id: 4,
    client: "Indústria Delta",
    type: "Fornecimento",
    fileName: "fornecimento_materias_delta.pdf",
    risk: "high" as const,
    score: 68,
    completedAt: "Há 5 horas",
    issues: 8,
  },
]

export function ContractAnalysis() {
  return (
    <div className="space-y-6">
      {/* In Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Análises em Andamento</CardTitle>
          <CardDescription>Contratos sendo processados pela IA</CardDescription>
        </CardHeader>
        <CardContent>
          {analysisInProgress.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma análise em andamento</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analysisInProgress.map((analysis) => (
                <div key={analysis.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{analysis.client}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{analysis.fileName}</p>
                      <Badge variant="secondary">{analysis.type}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{analysis.startedAt}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{analysis.status}</span>
                      <span className="font-medium">{analysis.progress}%</span>
                    </div>
                    <Progress value={analysis.progress} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed */}
      <Card>
        <CardHeader>
          <CardTitle>Análises Concluídas</CardTitle>
          <CardDescription>Relatórios prontos para visualização</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisCompleted.map((analysis) => (
              <div key={analysis.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{analysis.client}</p>
                      <Badge
                        className={
                          analysis.risk === "low"
                            ? "bg-success/10 text-success hover:bg-success/20"
                            : analysis.risk === "medium"
                              ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                              : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        }
                      >
                        {analysis.risk === "low"
                          ? "Baixo Risco"
                          : analysis.risk === "medium"
                            ? "Médio Risco"
                            : "Alto Risco"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{analysis.fileName}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{analysis.type}</span>
                      <span>•</span>
                      <span>{analysis.completedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">Score: {analysis.score}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm">{analysis.issues} pontos de atenção</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Exportar
                    </Button>
                    <Button size="sm">Ver Relatório</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
