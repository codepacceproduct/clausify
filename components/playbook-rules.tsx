"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
import { Search, Plus, Loader2, Edit, Trash2, RefreshCcw, ArrowRight, AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface Rule {
  id: number
  trigger: string
  condition: string
  action: string
  behavior: string
  observation: string
  severity: "low" | "medium" | "high"
  category: string
  active: boolean
  lastUpdated: string
}

const categories = ["all", "Financeiro", "Jurídico", "Compliance", "Rescisão", "Operacional"]

export function PlaybookRules({ initialRules = [] }: { initialRules?: Rule[] }) {
  const [rules, setRules] = useState<Rule[]>(initialRules)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // New Rule Form State
  const [newRule, setNewRule] = useState({
    trigger: "",
    condition: "",
    action: "",
    behavior: "",
    observation: "",
    severity: "medium",
    category: "Jurídico"
  })

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
    if (!newRule.condition || !newRule.action) return

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
    setNewRule({ 
        trigger: "", 
        condition: "", 
        action: "", 
        behavior: "", 
        observation: "", 
        severity: "medium", 
        category: "Jurídico" 
    }) 

    // In a real app, you would POST to API here
  }

  const toggleRuleActive = (id: number) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r))
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high": return <ShieldAlert className="h-4 w-4 text-destructive" />
      case "medium": return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "low": return <ShieldCheck className="h-4 w-4 text-emerald-500" />
      default: return null
    }
  }

  const filteredRules = rules.filter((rule) => {
    const matchesSearch = 
      rule.condition.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rule.trigger.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.action.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Filters & Actions */}
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar regras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] bg-card">
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
                  <Button className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap shadow-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Regra
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Nova Regra de Análise</DialogTitle>
                    <DialogDescription>
                      Crie um fluxo lógico claro para a IA seguir.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
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
                            <Label>Severidade (Risco)</Label>
                            <Select 
                                value={newRule.severity} 
                                onValueChange={(val) => setNewRule({...newRule, severity: val})}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Baixo</SelectItem>
                                    <SelectItem value="medium">Médio</SelectItem>
                                    <SelectItem value="high">Alto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                        <div className="space-y-2">
                            <Label className="text-emerald-600 font-semibold flex items-center gap-2">
                                1. QUANDO (Gatilho)
                            </Label>
                            <Input 
                                placeholder="Ex: Contrato contém cláusula de multa rescisória" 
                                value={newRule.trigger}
                                onChange={(e) => setNewRule({...newRule, trigger: e.target.value})}
                            />
                        </div>
                        <div className="flex justify-center">
                            <ArrowRight className="h-4 w-4 text-muted-foreground/50 rotate-90 md:rotate-0" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-blue-600 font-semibold flex items-center gap-2">
                                2. SE (Condição)
                            </Label>
                            <Input 
                                placeholder="Ex: Percentual for superior a 10%" 
                                value={newRule.condition}
                                onChange={(e) => setNewRule({...newRule, condition: e.target.value})}
                            />
                        </div>
                        <div className="flex justify-center">
                            <ArrowRight className="h-4 w-4 text-muted-foreground/50 rotate-90 md:rotate-0" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-amber-600 font-semibold flex items-center gap-2">
                                3. ENTÃO (Ação)
                            </Label>
                            <Input 
                                placeholder="Ex: Sinalizar risco abusivo" 
                                value={newRule.action}
                                onChange={(e) => setNewRule({...newRule, action: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Como (Comportamento esperado)</Label>
                        <Input 
                            placeholder="Ex: Sugerir redução para teto de 2% conforme CDC" 
                            value={newRule.behavior}
                            onChange={(e) => setNewRule({...newRule, behavior: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                      <Label>Observações (Opcional)</Label>
                      <Textarea 
                        placeholder="Contexto adicional para a equipe..." 
                        rows={2}
                        value={newRule.observation}
                        onChange={(e) => setNewRule({...newRule, observation: e.target.value})}
                      />
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

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredRules.map((rule) => (
          <Card key={rule.id} className={`transition-all hover:shadow-md border-t-4 ${!rule.active ? 'opacity-60 grayscale' : ''}`} style={{
            borderTopColor: rule.severity === 'high' ? '#ef4444' : rule.severity === 'medium' ? '#f59e0b' : '#10b981'
          }}>
            <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                    <Badge variant="outline" className="font-normal text-xs uppercase tracking-wider text-muted-foreground">
                        {rule.category}
                    </Badge>
                    <div className="flex items-center gap-2">
                        {getSeverityIcon(rule.severity)}
                        <Switch 
                            checked={rule.active}
                            onCheckedChange={() => toggleRuleActive(rule.id)}
                            className="scale-75 data-[state=checked]:bg-emerald-600"
                        />
                    </div>
                </div>

                <div className="space-y-3 relative">
                    {/* Flow Line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-border/50 -z-10" />

                    {/* Trigger */}
                    <div className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 text-xs font-bold">Q</div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase">Quando</p>
                            <p className="text-sm font-medium text-foreground leading-tight">{rule.trigger}</p>
                        </div>
                    </div>

                    {/* Condition */}
                    <div className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 text-xs font-bold">S</div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase">Se</p>
                            <p className="text-sm font-medium text-foreground leading-tight">{rule.condition}</p>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 text-xs font-bold">E</div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase">Então</p>
                            <p className="text-sm font-medium text-foreground leading-tight">{rule.action}</p>
                        </div>
                    </div>
                </div>

                {rule.behavior && (
                    <div className="bg-muted/30 rounded-md p-3 text-xs border border-border/50">
                        <span className="font-semibold text-foreground/80">Como: </span>
                        <span className="text-muted-foreground">{rule.behavior}</span>
                    </div>
                )}

                <div className="pt-2 flex justify-end gap-2 border-t border-border/40">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                        <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRules.length === 0 && (
         <div className="text-center py-12 border-2 border-dashed rounded-xl">
          <p className="text-muted-foreground">Nenhuma regra ativa. O Playbook está vazio.</p>
          <Button variant="link" onClick={() => setIsDialogOpen(true)}>Criar primeira regra</Button>
        </div>
      )}
    </div>
  )
}
