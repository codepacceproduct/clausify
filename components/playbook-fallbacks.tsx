"use client"

import { useState } from "react"
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
import { Search, Plus, Copy, Edit, Trash2, ShieldAlert, ArrowRightLeft, BookOpen } from "lucide-react"
import { getUserEmail } from "@/lib/auth"

const fallbackClauses = [
  {
    id: "FB-001",
    name: "Limitação de Responsabilidade - Alternativa",
    category: "Responsabilidade",
    originalClause: "A parte não será responsável por danos indiretos ou consequenciais.",
    fallbackClause:
      "A responsabilidade total de cada parte será limitada ao valor total pago nos últimos 12 meses, excluindo-se danos indiretos, lucros cessantes ou danos consequenciais.",
    risk: "high" as const,
    usageCount: 24,
    lastUsed: "25/01/2025",
    notes: "Usar quando a contraparte não aceitar limitação total de responsabilidade",
  },
  {
    id: "FB-002",
    name: "Prazo de Pagamento - Alternativa",
    category: "Financeiro",
    originalClause: "Pagamento à vista na assinatura do contrato.",
    fallbackClause: "Pagamento em até 30 dias após a emissão da nota fiscal, mediante depósito bancário identificado.",
    risk: "medium" as const,
    usageCount: 45,
    lastUsed: "27/01/2025",
    notes: "Alternativa aceitável para clientes com histórico positivo",
  },
  {
    id: "FB-003",
    name: "Confidencialidade - Prazo Reduzido",
    category: "Confidencialidade",
    originalClause: "As informações confidenciais serão mantidas em sigilo por tempo indeterminado.",
    fallbackClause:
      "As informações confidenciais serão mantidas em sigilo pelo prazo de 5 (cinco) anos após o término do contrato.",
    risk: "low" as const,
    usageCount: 18,
    lastUsed: "20/01/2025",
    notes: "Usar quando prazo indeterminado não for aceito",
  },
  {
    id: "FB-004",
    name: "Rescisão - Aviso Prévio Estendido",
    category: "Rescisão",
    originalClause: "Rescisão mediante aviso prévio de 30 dias.",
    fallbackClause: "Rescisão mediante aviso prévio de 60 dias, por escrito, com comprovação de recebimento.",
    risk: "low" as const,
    usageCount: 32,
    lastUsed: "28/01/2025",
    notes: "Alternativa quando 30 dias é considerado insuficiente pela contraparte",
  },
  {
    id: "FB-005",
    name: "Multa Contratual - Valor Reduzido",
    category: "Penalidades",
    originalClause: "Multa de 20% sobre o valor total do contrato.",
    fallbackClause: "Multa de 10% sobre o valor total do contrato, sem prejuízo das demais penalidades previstas.",
    risk: "medium" as const,
    usageCount: 15,
    lastUsed: "22/01/2025",
    notes: "Usar como última alternativa quando 20% for recusado",
  },
  {
    id: "FB-006",
    name: "Foro - Arbitragem",
    category: "Foro",
    originalClause: "Fica eleito o foro da Comarca de São Paulo/SP.",
    fallbackClause:
      "As partes elegem a Câmara de Arbitragem da FIESP para dirimir quaisquer controvérsias decorrentes deste contrato.",
    risk: "medium" as const,
    usageCount: 8,
    lastUsed: "15/01/2025",
    notes: "Alternativa para contratos de alto valor ou com partes internacionais",
  },
]

export function PlaybookFallbacks() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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

  const filteredFallbacks = fallbackClauses.filter((clause) => {
    const matchesSearch =
      clause.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clause.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || clause.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(fallbackClauses.map((c) => c.category))]

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Baixo Risco</Badge>
      case "medium":
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">Médio Risco</Badge>
      case "high":
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Alto Risco</Badge>
      default:
        return null
    }
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
              <h3 className="font-medium text-amber-900 dark:text-amber-100">O que são Fallback Clauses?</h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                Cláusulas alternativas pré-aprovadas para usar em negociações quando a versão padrão não é aceita pela
                contraparte. Cada fallback possui um nível de risco associado e notas de orientação para uso.
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
            placeholder="Buscar fallback clauses..."
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
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
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
                      {categories.map((cat) => (
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
                <label className="text-sm font-medium">Cláusula Original</label>
                <Textarea placeholder="Texto da cláusula padrão..." rows={3} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cláusula Fallback</label>
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
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {filteredFallbacks.map((clause) => (
            <Card key={clause.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{clause.name}</CardTitle>
                      {getRiskBadge(clause.risk)}
                    </div>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {clause.category}
                      </span>
                      <span>Usado {clause.usageCount}x</span>
                      <span>Último: {clause.lastUsed}</span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => logAction("download", clause.name)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => logAction("edit", clause.name)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => logAction("delete", clause.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase">Cláusula Original</p>
                    <div className="p-3 bg-muted rounded-lg text-sm">{clause.originalClause}</div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1">
                      <ArrowRightLeft className="h-3 w-3" />
                      Cláusula Fallback
                    </p>
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm">
                      {clause.fallbackClause}
                    </div>
                  </div>
                </div>
                {clause.notes && (
                  <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                    <p className="text-xs font-medium text-amber-600 mb-1">Orientação de Uso</p>
                    <p className="text-sm text-amber-800 dark:text-amber-200">{clause.notes}</p>
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
