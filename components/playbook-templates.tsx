"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserEmail, getAuthToken } from "@/lib/auth"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Plus, FileText, Download, Eye, Star, Loader2, RefreshCcw, FileCheck } from "lucide-react"

interface Template {
  id: number
  name: string
  category: string
  description: string
  clauses: number
  pages: number
  downloads: number
  rating: number
  lastUpdated: string
  featured: boolean
  author?: string
  version?: string
  tags?: string[]
  content?: string
}

export function PlaybookTemplates({ initialTemplates = [] }: { initialTemplates?: Template[] }) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)

  const fetchTemplates = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/playbook/templates")
      if (!response.ok) throw new Error("Falha ao carregar templates")
      const data = await response.json()
      setTemplates(data)
    } catch (err) {
      setError("Erro ao carregar templates. Tente novamente.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const logAction = async (action: string, resource: string) => {
    const email = getUserEmail() || ""
    if (!email) return
    try {
      const token = getAuthToken()
      const headers: any = { "Content-Type": "application/json" }
      if (token) headers.Authorization = `Bearer ${token}`
      await fetch("/api/audit/logs/record", { method: "POST", headers, body: JSON.stringify({ action, resource, status: "success" }) })
    } catch {}
  }

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template)
    logAction("preview", template.name)
  }

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const featuredTemplates = filteredTemplates.filter((t) => t.featured)
  const regularTemplates = filteredTemplates.filter((t) => !t.featured)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="text-muted-foreground">Carregando templates...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchTemplates} variant="outline">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search & Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, categoria ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Featured Templates */}
      {featuredTemplates.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <h2 className="text-xl font-semibold">Destaques</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} onPreview={handlePreview} onDownload={(name) => logAction("download", name)} />
            ))}
          </div>
        </div>
      )}

      {/* Regular Templates */}
      {regularTemplates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Todos os Templates</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} onPreview={handlePreview} onDownload={(name) => logAction("download", name)} />
            ))}
          </div>
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum template encontrado para &quot;{searchTerm}&quot;</p>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    {previewTemplate?.name}
                </DialogTitle>
                <DialogDescription>
                    Pré-visualização do documento
                </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden border rounded-md bg-muted/20 p-4">
                <ScrollArea className="h-full pr-4">
                    <div className="font-mono text-sm whitespace-pre-wrap leading-relaxed">
                        {previewTemplate?.content || "Conteúdo não disponível para pré-visualização."}
                    </div>
                </ScrollArea>
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setPreviewTemplate(null)}>Fechar</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Template
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TemplateCard({ template, onPreview, onDownload }: { template: Template; onPreview: (t: Template) => void; onDownload: (n: string) => void }) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 border-emerald-500/20 hover:border-emerald-500/50 flex flex-col h-full group">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <FileText className="h-6 w-6" />
          </div>
          <Badge variant="secondary" className="bg-secondary/50">{template.category}</Badge>
        </div>
        <CardTitle className="text-lg line-clamp-1" title={template.name}>{template.name}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        {template.tags && template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground">#{tag}</span>
                ))}
            </div>
        )}
        
        <div className="grid grid-cols-3 gap-2 text-center py-2 bg-muted/30 rounded-lg">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Cláusulas</p>
            <p className="text-sm font-semibold">{template.clauses}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Páginas</p>
            <p className="text-sm font-semibold">{template.pages}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Downloads</p>
            <p className="text-sm font-semibold">{template.downloads}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span className="font-medium text-foreground">{template.rating}</span>
          </div>
          <span>v{template.version || '1.0'} • {new Date(template.lastUpdated).toLocaleDateString('pt-BR')}</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => onPreview(template)}
          >
            <Eye className="h-3 w-3 mr-1" />
            Ver
          </Button>
          <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => onDownload(template.name)}>
            <Download className="h-3 w-3 mr-1" />
            Usar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
