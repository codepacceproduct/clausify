"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GitBranch, Clock, FileText, User, ArrowRight, Loader2, Eye } from "lucide-react"
import { VersionHistorySkeleton } from "@/components/contracts/skeletons"

interface ContractVersion {
  id: string
  version_number: string
  status: string
  created_by: string
  created_at: string
  changes_summary: string
  content?: string
}

interface VersionHistoryProps {
  contractId: string
}

export function VersionHistory({ contractId, initialData = [] }: VersionHistoryProps & { initialData?: ContractVersion[] }) {
  const [versions, setVersions] = useState<ContractVersion[]>(initialData)
  const [loading, setLoading] = useState(initialData.length === 0)
  const [previewVersion, setPreviewVersion] = useState<ContractVersion | null>(null)

  useEffect(() => {
    if (initialData.length > 0 && versions.length === 0) {
       setVersions(initialData)
       setLoading(false)
    } else if (contractId && initialData.length === 0) {
      fetchVersions()
    }
  }, [contractId, initialData])

  async function fetchVersions() {
    setLoading(true)
    try {
      const res = await fetch(`/api/contracts/${contractId}/versions`)
      if (res.ok) {
        const data = await res.json()
        setVersions(data || [])
      }
    } catch (error) {
      console.error("Failed to fetch versions", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <VersionHistorySkeleton />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20"
      case "draft":
        return "bg-muted text-muted-foreground border-border"
      case "review":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      case "approved":
        return "bg-primary/10 text-primary border-primary/20"
      case "archived":
        return "bg-muted text-muted-foreground border-border"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Ativo"
      case "draft": return "Rascunho"
      case "review": return "Em Revisão"
      case "approved": return "Aprovado"
      case "archived": return "Arquivado"
      default: return status
    }
  }

  if (versions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <GitBranch className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Nenhuma versão encontrada para este contrato.</p>
        <p className="text-sm mt-1">Edite o contrato para gerar novas versões.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{versions.length}</p>
                <p className="text-xs text-muted-foreground">Total de Versões</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Versions List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Histórico de Versões
          </CardTitle>
          <CardDescription>Lista completa de alterações</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-auto">
            <div className="space-y-3">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className={`p-4 border rounded-lg transition-colors hover:bg-muted/50 ${
                    index === 0 ? "border-success/30 bg-success/5" : ""
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index === 0 ? "bg-success/10" : "bg-muted"
                          }`}
                        >
                          <span className="text-sm font-bold">v{version.version_number}</span>
                        </div>
                        {index < versions.length - 1 && <div className="w-0.5 h-8 bg-border mt-2" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Versão {version.version_number}</span>
                          <Badge variant="outline" className={getStatusColor(version.status || (index === 0 ? 'active' : 'archived'))}>
                            {getStatusLabel(version.status || (index === 0 ? 'active' : 'archived'))}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{version.changes_summary || "Sem descrição das alterações"}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(version.created_at).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="shrink-0"
                      onClick={() => setPreviewVersion(version)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={!!previewVersion} onOpenChange={(open) => !open && setPreviewVersion(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Versão {previewVersion?.version_number}</DialogTitle>
            <DialogDescription>
              Criado em {previewVersion?.created_at && new Date(previewVersion.created_at).toLocaleString('pt-BR')} por {previewVersion?.created_by || "Sistema"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden border rounded-md mt-4">
            <ScrollArea className="h-full bg-muted/30 p-6">
              <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                {previewVersion?.content || "Conteúdo não disponível para esta versão."}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
