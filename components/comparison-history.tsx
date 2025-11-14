import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GitCompare, Download, Eye } from "lucide-react"

const history = [
  {
    id: 1,
    name: "Alpha Tech v1.0 vs v2.0",
    date: "20/01/2025",
    changes: 6,
    highImpact: 4,
    status: "reviewed" as const,
  },
  {
    id: 2,
    name: "Beta Construção v1.0 vs v1.5",
    date: "18/01/2025",
    changes: 12,
    highImpact: 8,
    status: "pending" as const,
  },
  {
    id: 3,
    name: "Gamma Locação v2.0 vs v3.0",
    date: "15/01/2025",
    changes: 3,
    highImpact: 1,
    status: "reviewed" as const,
  },
  {
    id: 4,
    name: "Delta Fornecimento v1.0 vs v2.0",
    date: "12/01/2025",
    changes: 15,
    highImpact: 10,
    status: "reviewed" as const,
  },
]

export function ComparisonHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Comparações</CardTitle>
        <CardDescription>Comparações realizadas anteriormente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <GitCompare className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{item.name}</p>
                    {item.status === "reviewed" ? (
                      <Badge className="bg-success/10 text-success hover:bg-success/20">Revisado</Badge>
                    ) : (
                      <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">Pendente</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.changes} alterações</span>
                    <span>•</span>
                    <span className="text-destructive font-medium">{item.highImpact} de alto impacto</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
