import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, Download } from "lucide-react"
import { getAuthToken } from "@/lib/auth"

export function ContractAnalysis() {
  const [items, setItems] = useState<{ name: string; path: string; signedUrl: string | null }[]>([])

  useEffect(() => {
    const load = async () => {
      const token = getAuthToken()
      try {
        const r = await fetch(`/api/contracts/list`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
        const j = await r.json().catch(() => ({ items: [] }))
        setItems(j.items || [])
      } catch {}
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      {/* In Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Análises em Andamento</CardTitle>
          <CardDescription>Contratos sendo processados pela IA</CardDescription>
        </CardHeader>
        <CardContent>
          {true ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma análise em andamento</p>
            </div>
          ) : (
            <div className="space-y-4">
              
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed */}
      <Card>
        <CardHeader>
          <CardTitle>Uploads de Contratos</CardTitle>
          <CardDescription>Arquivos enviados pela organização</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum arquivo enviado</p>
              </div>
            ) : (
              items.map((it) => (
                <div key={it.path} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium truncate">{it.name}</p>
                        <Badge variant="secondary">Contrato</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground break-all">{it.path}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end pt-3 border-t">
                    {it.signedUrl ? (
                      <a href={it.signedUrl} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                      </a>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        <Download className="h-4 w-4 mr-1" />
                        Indisponível
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
