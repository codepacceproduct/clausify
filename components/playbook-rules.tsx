"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Loader2, AlertTriangle, ShieldAlert, CheckCircle, Info, Edit, Trash2, RefreshCcw } from "lucide-react"
import { Label } from "@/components/ui/label"

interface Rule {
  id: number
  rule: string
  severity: "low" | "medium" | "high"
  rationale: string
  category: string
  active: boolean
  lastUpdated: string
}

const categories = ["all", "Financeiro", "Jurídico", "Compliance", "Rescisão", "Operacional"]

export function PlaybookRules() {
  const [rules, setRules] = useState<Rule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // New Rule Form State
  const [newRule, setNewRule] = useState({
    rule: "",
    severity: "medium",
    rationale: "",
    category: "Jurídico"
  })

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/playbook/rules")
      if (!response.ok) throw new Error("Falha ao carregar regras")
      const data = await response.json()
      setRules(data)
    } catch (err) {
      setError("Erro ao carregar regras. Tente novamente.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddRule = async () => {
    // Basic validation
    if (!newRule.rule || !newRule.rationale) return

    // Optimistic update or API call
    const tempRule: Rule = {
      id: rules.length + 1, // Temp ID
      ...newRule,
      severity: newRule.severity as "low" | "medium" | "high",
      active: true,
      lastUpdated: new Date().toISOString().split('T')[0]
    }
    
    setRules([tempRule, ...rules])
    setIsDialogOpen(false)
    setNewRule({ rule: "", severity: "medium", rationale: "", category: "Jurídico" }) // Reset

    // In a real app, you would POST to API here
    /*
    try {
      await fetch("/api/playbook/rules", { method: "POST", body: JSON.stringify(newRule) })
      fetchRules()
    } catch (e) { ... }
    */
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20">Alto Risco</Badge>
      case "medium":
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">Médio Risco</Badge>
      case "low":
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">Baixo Risco</Badge>
      default:
        return <Badge variant="secondary">N/A</Badge>
    }
  }

  const filteredRules = rules.filter((rule) => {
    const matchesSearch = 
      rule.rule.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rule.rationale.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || rule.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="text-muted-foreground">Carregando regras de análise...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchRules} variant="outline">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-medium text-blue-900">Regras de Ouro</h4>
          <p className="text-sm text-blue-700">
            Estas regras alimentam diretamente a Inteligência Artificial. 
            Defina o que é inaceitável para sua empresa e a IA aplicará estes critérios em todas as análises de contrato.
          </p>
        </div>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar regras..."
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
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Regra
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nova Regra de Análise</DialogTitle>
                    <DialogDescription>
                      Defina uma regra para a IA aplicar automaticamente nas análises.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Regra (O que a IA deve verificar?)</Label>
                      <Input 
                        placeholder="Ex: Não aceitar reajuste pelo IGPM" 
                        value={newRule.rule}
                        onChange={(e) => setNewRule({...newRule, rule: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Categoria</Label>
                            <Select 
                                value={newRule.category} 
                                onValueChange={(val) => setNewRule({...newRule, category: val})}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.filter(c => c !== "all").map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Severidade</Label>
                            <Select 
                                value={newRule.severity} 
                                onValueChange={(val) => setNewRule({...newRule, severity: val})}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Baixo Risco</SelectItem>
                                    <SelectItem value="medium">Médio Risco</SelectItem>
                                    <SelectItem value="high">Alto Risco</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Motivo / Racional (Por que isso é proibido?)</Label>
                      <Textarea 
                        placeholder="Ex: O IGPM possui alta volatilidade e impacta o fluxo de caixa..." 
                        rows={3}
                        value={newRule.rationale}
                        onChange={(e) => setNewRule({...newRule, rationale: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground">Essa explicação ajuda a IA a justificar o apontamento no relatório.</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddRule} className="bg-emerald-600 hover:bg-emerald-700">Salvar Regra</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <Card key={rule.id} className="overflow-hidden transition-all hover:shadow-md border-l-4" style={{
            borderLeftColor: rule.severity === 'high' ? '#ef4444' : rule.severity === 'medium' ? '#f59e0b' : '#10b981'
          }}>
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">{rule.rule}</h3>
                                    {getSeverityBadge(rule.severity)}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Badge variant="outline" className="font-normal">{rule.category}</Badge>
                                    <span>•</span>
                                    <span>Atualizado em {new Date(rule.lastUpdated).toLocaleDateString('pt-BR')}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-muted/30 rounded-lg p-3 text-sm">
                            <span className="font-medium text-foreground">Por que: </span>
                            <span className="text-muted-foreground">{rule.rationale}</span>
                        </div>
                    </div>
                    
                    <div className="border-t md:border-t-0 md:border-l bg-muted/10 p-4 flex md:flex-col justify-center items-center gap-2 min-w-[100px]">
                        <Button variant="ghost" size="sm" className="w-full justify-start md:justify-center">
                            <Edit className="h-4 w-4 mr-2 md:mr-0" />
                            <span className="md:hidden">Editar</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start md:justify-center text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2 md:mr-0" />
                            <span className="md:hidden">Excluir</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRules.length === 0 && (
         <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma regra encontrada.</p>
        </div>
      )}
    </div>
  )
}
