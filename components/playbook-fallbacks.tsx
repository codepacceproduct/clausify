"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Copy, Edit, Trash2, ShieldAlert, ArrowRightLeft, BookOpen, Loader2, RefreshCcw, CheckCircle2 } from "lucide-react"
import { getUserEmail } from "@/lib/auth"

interface FallbackClause {
  id: string
  name: string
  category: string
  originalClause: string
  fallbackClause: string
  risk: "low" | "medium" | "high"
  usageCount: number
  lastUsed: string
  notes: string
  tags?: string[]
}

export function PlaybookFallbacks({ initialFallbacks = [] }: { initialFallbacks?: FallbackClause[] }) {
  const [fallbacks, setFallbacks] = useState<FallbackClause[]>(initialFallbacks)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchFallbacks = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/playbook/fallbacks")
      if (!response.ok) throw new Error("Falha ao carregar fallbacks")
      const data = await response.json()
      setFallbacks(data)
    } catch (err) {
      setError("Erro ao carregar fallbacks. Tente novamente.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const logAction = async (action: string, resource: string) => {
    const email = getUserEmail() || ""
    if (!email) return
    try {
      await fetch("/api/audit/logs/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, resource, status: "success" }),
      })
    } catch {}
  }

  const filteredFallbacks = fallbacks.filter((clause) => {
    const matchesSearch =
      clause.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clause.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || clause.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(fallbacks.map((c) => c.category)))]

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200">Baixo Risco</Badge>
      case "medium":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">Médio Risco</Badge>
      case "high":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">Alto Risco</Badge>
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="text-muted-foreground">Carregando estratégias de fallback...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchFallbacks} variant="outline">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-amber-900 dark:text-amber-100">Estratégias de Negociação (Fallbacks)</h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                Utilize estas cláusulas alternativas quando a versão padrão for rejeitada. Cada opção inclui análise de risco e notas de aplicação.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, categoria ou conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {categories
              .filter(c => c !== "all")
              .map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Fallback
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Fallback Clause</DialogTitle>
              <DialogDescription>Adicione uma nova cláusula alternativa ao playbook</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Cláusula</label>
                <Input placeholder="Ex: Limitação de Responsabilidade - Alternativa" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== "all").map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nível de Risco</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixo</SelectItem>
                      <SelectItem value="medium">Médio</SelectItem>
                      <SelectItem value="high">Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cláusula Original (Padrão)</label>
                <Textarea placeholder="Texto da cláusula padrão..." rows={3} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cláusula Fallback (Alternativa)</label>
                <Textarea placeholder="Texto da cláusula alternativa..." rows={3} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notas de Orientação</label>
                <Textarea placeholder="Quando usar esta alternativa..." rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fallback List */}
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {filteredFallbacks.map((clause) => (
            <Card key={clause.id} className="overflow-hidden">
              <CardHeader className="pb-3 bg-muted/20">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-semibold">{clause.name}</CardTitle>
                      {getRiskBadge(clause.risk)}
                    </div>
                    <CardDescription className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {clause.category}
                      </span>
                      <span>Usado {clause.usageCount}x</span>
                      <span>Último: {new Date(clause.lastUsed).toLocaleDateString('pt-BR')}</span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => logAction("copy", clause.name)} title="Copiar">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => logAction("edit", clause.name)} title="Editar">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => logAction("delete", clause.name)}
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Cláusula Original</p>
                    <div className="p-3 bg-muted rounded-lg text-sm border border-border/50 text-muted-foreground">{clause.originalClause}</div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                      <ArrowRightLeft className="h-3 w-3" />
                      Cláusula Fallback (Alternativa)
                    </p>
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-sm text-emerald-900 shadow-sm">
                      {clause.fallbackClause}
                    </div>
                  </div>
                </div>
                {clause.notes && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 items-start">
                    <ShieldAlert className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-amber-700 mb-0.5 uppercase tracking-wide">Orientação de Uso</p>
                        <p className="text-sm text-amber-800">{clause.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
