"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Copy, Trash2, BookOpen, CheckCircle2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const clauses = [
  {
    id: 1,
    title: "Confidencialidade - Padrão",
    category: "Confidencialidade",
    description: "Cláusula padrão de confidencialidade para contratos comerciais",
    usageCount: 234,
    lastUpdated: "15/01/2025",
    status: "approved" as const,
    risk: "low" as const,
    content: "As partes se comprometem a manter sigilo sobre todas as informações confidenciais...",
  },
  {
    id: 2,
    title: "Rescisão Antecipada - Sem Multa",
    category: "Rescisão",
    description: "Permite rescisão sem penalidades mediante aviso prévio de 60 dias",
    usageCount: 189,
    lastUpdated: "10/01/2025",
    status: "approved" as const,
    risk: "medium" as const,
    content: "Qualquer das partes poderá rescindir este contrato mediante aviso prévio de 60 dias...",
  },
  {
    id: 3,
    title: "Garantia de Execução - 10%",
    category: "Garantias",
    description: "Exige garantia financeira de 10% do valor total do contrato",
    usageCount: 156,
    lastUpdated: "08/01/2025",
    status: "approved" as const,
    risk: "low" as const,
    content: "O contratado prestará garantia equivalente a 10% do valor total do contrato...",
  },
  {
    id: 4,
    title: "Responsabilidade Civil - Limitada",
    category: "Responsabilidade",
    description: "Limita responsabilidade ao valor do contrato",
    usageCount: 142,
    lastUpdated: "05/01/2025",
    status: "review" as const,
    risk: "high" as const,
    content: "A responsabilidade civil das partes fica limitada ao valor total deste contrato...",
  },
  {
    id: 5,
    title: "Propriedade Intelectual - Transferência Total",
    category: "Propriedade Intelectual",
    description: "Transfere todos os direitos de PI para o contratante",
    usageCount: 128,
    lastUpdated: "03/01/2025",
    status: "approved" as const,
    risk: "medium" as const,
    content: "Todos os direitos de propriedade intelectual serão transferidos ao contratante...",
  },
  {
    id: 6,
    title: "Prazo de Vigência - Indeterminado",
    category: "Vigência",
    description: "Contrato sem prazo determinado, rescisível a qualquer momento",
    usageCount: 98,
    lastUpdated: "01/01/2025",
    status: "approved" as const,
    risk: "low" as const,
    content: "Este contrato vigorará por prazo indeterminado, podendo ser rescindido...",
  },
]

export function PlaybookLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredClauses = clauses.filter((clause) => {
    const matchesSearch =
      clause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clause.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || clause.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(clauses.map((c) => c.category)))]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar cláusulas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories
                  .filter((c) => c !== "all")
                  .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Cláusula
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clauses Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredClauses.map((clause) => (
          <Card key={clause.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{clause.title}</CardTitle>
                    {clause.status === "approved" && <CheckCircle2 className="h-4 w-4 text-success" />}
                  </div>
                  <CardDescription>{clause.description}</CardDescription>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary">{clause.category}</Badge>
                <Badge
                  className={
                    clause.risk === "low"
                      ? "bg-success/10 text-success hover:bg-success/20"
                      : clause.risk === "medium"
                        ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                        : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  }
                >
                  {clause.risk === "low" ? "Baixo Risco" : clause.risk === "medium" ? "Médio Risco" : "Alto Risco"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">{clause.content}</div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  Usado {clause.usageCount}x
                </span>
                <span>Atualizado em {clause.lastUpdated}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Copy className="h-3 w-3 mr-1" />
                  Copiar
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
