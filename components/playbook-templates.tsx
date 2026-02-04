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
import { 
  Search, 
  FileText, 
  Download, 
  Eye, 
  Loader2, 
  RefreshCcw, 
  Github, 
  Filter,
  FileCode,
  FileType
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Template {
  id: string
  title: string
  category: string
  type: string
  description: string
  format: string
  source_url: string
  content: string
}

export function PlaybookTemplates({ initialTemplates = [] }: { initialTemplates?: any[] }) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)

  // Map initial templates if provided (handling potential different structure)
  useEffect(() => {
    if (initialTemplates.length > 0) {
      // Check if it matches new structure or old
      const mapped = initialTemplates.map(t => ({
        id: t.id,
        title: t.title || t.name,
        category: t.category,
        type: t.type || "Documento",
        description: t.description,
        format: t.format || "md",
        source_url: t.source_url || "#",
        content: t.content || ""
      }))
      setTemplates(mapped)
    } else {
      fetchTemplates()
    }
  }, [initialTemplates])

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
    logAction("preview", template.title)
  }

  const handleDownload = (template: Template) => {
    logAction("download", template.title)
    
    // Simulate download
    const element = document.createElement("a");
    const file = new Blob([template.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${template.title.replace(/\s+/g, '_').toLowerCase()}.${template.format}`;
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  }

  // Get unique categories and types for filters
  const categories = ["all", ...Array.from(new Set(templates.map(t => t.category)))]
  const types = ["all", ...Array.from(new Set(templates.map(t => t.type)))]

  const filteredTemplates = templates.filter(
    (template) => {
      const matchesSearch = 
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
      const matchesType = selectedType === "all" || template.type === selectedType

      return matchesSearch && matchesCategory && matchesType
    }
  )

  if (isLoading && templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="text-muted-foreground">Sincronizando com repositórios...</p>
      </div>
    )
  }

  if (error && templates.length === 0) {
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
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
        <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[160px]">
                    <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas Categorias</SelectItem>
                    {categories.filter(c => c !== 'all').map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[160px]">
                    <FileType className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos Tipos</SelectItem>
                    {types.filter(t => t !== 'all').map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={fetchTemplates} title="Atualizar Repositórios">
                <RefreshCcw className="h-4 w-4" />
            </Button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
            <TemplateCard 
                key={template.id} 
                template={template} 
                onPreview={handlePreview} 
                onDownload={() => handleDownload(template)} 
            />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/10">
          <div className="flex justify-center mb-4">
            <FileText className="h-12 w-12 text-muted-foreground/30" />
          </div>
          <h3 className="text-lg font-medium text-foreground">Nenhum template encontrado</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mt-2">
            Não encontramos templates correspondentes aos seus filtros. Tente buscar por outros termos ou limpe os filtros.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => {
            setSearchTerm("")
            setSelectedCategory("all")
            setSelectedType("all")
          }}>
            Limpar Filtros
          </Button>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden gap-0">
            <div className="p-6 border-b flex flex-col gap-1">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                            <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-xl">{previewTemplate?.title}</DialogTitle>
                            <DialogDescription className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs font-normal">
                                    {previewTemplate?.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">{previewTemplate?.type}</span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground uppercase">{previewTemplate?.format}</span>
                            </DialogDescription>
                        </div>
                        {previewTemplate?.source_url && (
                            <a 
                                href={previewTemplate.source_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted"
                            >
                                <Github className="h-3.5 w-3.5" />
                                Fonte
                            </a>
                        )}
                    </div>
                </DialogHeader>
            </div>
            
            <div className="flex-1 overflow-hidden bg-muted/10">
                <ScrollArea className="h-full">
                    <div className="p-8 max-w-3xl mx-auto bg-background min-h-full shadow-sm my-4 rounded-sm border">
                        <div className="prose prose-sm dark:prose-invert max-w-none font-serif">
                            {previewTemplate?.content.split('\n').map((line, i) => {
                                // Simple markdown simulation for headings
                                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mb-4 mt-6 pb-2 border-b">{line.replace('# ', '')}</h1>
                                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mb-3 mt-5">{line.replace('## ', '')}</h2>
                                if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mb-2 mt-4">{line.replace('### ', '')}</h3>
                                if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold my-2">{line.replace(/\*\*/g, '')}</p>
                                if (line.trim() === '') return <br key={i} />
                                return <p key={i} className="leading-relaxed mb-2 text-justify">{line}</p>
                            }) || "Conteúdo não disponível."}
                        </div>
                    </div>
                </ScrollArea>
            </div>
            
            <div className="p-4 border-t bg-background flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPreviewTemplate(null)}>Fechar</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => previewTemplate && handleDownload(previewTemplate)}>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar {previewTemplate?.format.toUpperCase()}
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TemplateCard({ template, onPreview, onDownload }: { template: Template; onPreview: (t: Template) => void; onDownload: () => void }) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/50 hover:border-emerald-500/30 flex flex-col h-full group bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                {template.format === 'md' ? <FileCode className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{template.category}</span>
                <span className="text-[10px] text-muted-foreground/70">{template.type}</span>
            </div>
          </div>
          <Badge variant="outline" className="font-normal text-xs bg-muted/50 border-muted-foreground/20">
            {template.format}
          </Badge>
        </div>
        <CardTitle className="text-base font-semibold leading-tight line-clamp-2 min-h-[2.5rem]" title={template.title}>
            {template.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs mt-1 min-h-[2.5rem]">
            {template.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="mt-auto pt-0 pb-4 px-4 flex flex-col gap-3">
        <div className="w-full h-px bg-border/50" />
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-xs hover:bg-emerald-50 hover:text-emerald-700"
            onClick={() => onPreview(template)}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Visualizar
          </Button>
          <Button 
            size="sm" 
            className="flex-1 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 shadow-sm" 
            onClick={onDownload}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Baixar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
