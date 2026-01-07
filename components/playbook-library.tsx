"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Copy, Trash2, BookOpen, CheckCircle2, Loader2, RefreshCcw, AlertTriangle, ShieldCheck } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Clause {
  id: number
  title: string
  category: string
  description: string
  usageCount: number
  lastUpdated: string
  status: "approved" | "review" | "deprecated"
  risk: "low" | "medium" | "high"
  content: string
  tags?: string[]
}

export function PlaybookLibrary() {
  const [clauses, setClauses] = useState<Clause[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const fetchClauses = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/playbook/clauses")
      if (!response.ok) throw new Error("Falha ao carregar cláusulas")
      const data = await response.json()
      setClauses(data)
    } catch (err) {
      setError("Erro ao carregar biblioteca. Tente novamente.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClauses()
  }, [])

  const filteredClauses = clauses.filter((clause) => {
    const matchesSearch =
      clause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clause.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || clause.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(clauses.map((c) => c.category)))]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Optional: show toast
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="text-muted-foreground">Carregando biblioteca de cláusulas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchClauses} variant="outline">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters & Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar cláusulas por título ou conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {categories
                    .filter((c) => c !== "all")
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                Nova Cláusula
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clauses Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredClauses.map((clause) => (
          <ClauseCard key={clause.id} clause={clause} onCopy={() => copyToClipboard(clause.content)} />
        ))}
      </div>

      {filteredClauses.length === 0 && (
         <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma cláusula encontrada.</p>
        </div>
      )}
    </div>
  )
}

function ClauseCard({ clause, onCopy }: { clause: Clause; onCopy: () => void }) {
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200"><ShieldCheck className="w-3 h-3 mr-1"/> Baixo Risco</Badge>
      case "medium":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200"><AlertTriangle className="w-3 h-3 mr-1"/> Médio Risco</Badge>
      case "high":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200"><AlertTriangle className="w-3 h-3 mr-1"/> Alto Risco</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-emerald-500 flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{clause.title}</CardTitle>
              {clause.status === "approved" && <CheckCircle2 className="h-4 w-4 text-emerald-500" title="Aprovada" />}
            </div>
            <CardDescription className="line-clamp-2">{clause.description}</CardDescription>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="secondary" className="bg-secondary/50">{clause.category}</Badge>
          {getRiskBadge(clause.risk)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="p-4 bg-muted/40 rounded-lg text-sm text-muted-foreground font-mono leading-relaxed border border-border/50 flex-1 relative group">
           {clause.content}
           <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onCopy}
            title="Copiar texto"
           >
             <Copy className="h-3 w-3" />
           </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            Usado {clause.usageCount}x
          </span>
          <span>Atualizado: {new Date(clause.lastUpdated).toLocaleDateString('pt-BR')}</span>
        </div>

        <div className="flex gap-2 pt-2 border-t mt-auto">
          <Button variant="ghost" size="sm" className="flex-1">
            <Edit className="h-3 w-3 mr-1" />
            Editar
          </Button>
          <Button variant="ghost" size="sm" className="flex-1" onClick={onCopy}>
            <Copy className="h-3 w-3 mr-1" />
            Copiar
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
