"use client"

import { useState } from "react"
import { Plan, createPlan, updatePlan, deletePlan } from "@/actions/plans"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const MODULES = [
  "dashboard", "contratos", "consultas", "clausichat", "calendario", 
  "versionamento", "playbook", "calculos", "configuracoes", "assinaturas", 
  "auditoria", "equipes", "analises", "portfolio", "aprovacoes", "sobre"
]

const FEATURES = ["view_analytics", "view_audit_logs", "sso"]

const LIMIT_FIELDS = [
  { key: "max_users", label: "Usuários Máximos" },
  { key: "max_contracts", label: "Contratos Máximos" },
  { key: "max_analyses", label: "Análises Máximas" },
  { key: "max_queries", label: "Consultas Máximas" },
  { key: "max_chat_messages", label: "Mensagens Chat (Diário)" },
  { key: "max_monitoring_processes", label: "Processos Monitorados" },
  { key: "max_datalake_queries", label: "Consultas Data Lake" },
]

export function PlansClient({ initialPlans }: { initialPlans: Plan[] }) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEdit = (plan: Plan) => {
    setEditingPlan(JSON.parse(JSON.stringify(plan))) // Deep copy
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingPlan({
      name: "",
      slug: "",
      active: true,
      config: {
        max_users: 1,
        max_contracts: 10,
        max_analyses: 10,
        max_queries: 10,
        max_chat_messages: 50,
        max_monitoring_processes: 0,
        max_datalake_queries: 0,
        support_level: "email",
        features: [],
        allowed_modules: ["dashboard"],
        allowed_calculators: []
      }
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!editingPlan?.name || !editingPlan?.slug) {
      toast.error("Nome e Slug são obrigatórios")
      return
    }

    try {
      setIsLoading(true)
      if (editingPlan.id) {
        await updatePlan(editingPlan.id, {
          name: editingPlan.name,
          config: editingPlan.config,
          active: editingPlan.active
        })
        toast.success("Plano atualizado com sucesso")
      } else {
        await createPlan(editingPlan)
        toast.success("Plano criado com sucesso")
      }
      router.refresh()
      setIsDialogOpen(false)
    } catch (error) {
      toast.error("Erro ao salvar plano: " + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este plano?")) return
    try {
      setIsLoading(true)
      await deletePlan(id)
      toast.success("Plano excluído com sucesso")
      router.refresh()
    } catch (error) {
      toast.error("Erro ao excluir plano: " + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const updateConfig = (field: string, value: any) => {
    if (!editingPlan?.config) return
    setEditingPlan({
      ...editingPlan,
      config: { ...editingPlan.config, [field]: value }
    })
  }

  const toggleModule = (module: string) => {
    if (!editingPlan?.config) return
    const current = editingPlan.config.allowed_modules || []
    const updated = current.includes(module)
      ? current.filter(m => m !== module)
      : [...current, module]
    updateConfig("allowed_modules", updated)
  }

  const toggleFeature = (feature: string) => {
    if (!editingPlan?.config) return
    const current = editingPlan.config.features || []
    const updated = current.includes(feature)
      ? current.filter(f => f !== feature)
      : [...current, feature]
    updateConfig("features", updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Planos Disponíveis</h2>
        <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" /> Novo Plano
        </Button>
      </div>

      <div className="border rounded-lg bg-white dark:bg-slate-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Módulos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell><Badge variant="outline">{plan.slug}</Badge></TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {plan.config.allowed_modules.slice(0, 3).map(m => (
                      <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                    ))}
                    {plan.config.allowed_modules.length > 3 && (
                      <Badge variant="secondary" className="text-xs">+{plan.config.allowed_modules.length - 3}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {plan.active ? (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Ativo</Badge>
                  ) : (
                    <Badge variant="destructive">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(plan)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(plan.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan?.id ? "Editar Plano" : "Novo Plano"}</DialogTitle>
          </DialogHeader>

          {editingPlan && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Plano</Label>
                  <Input 
                    value={editingPlan.name} 
                    onChange={e => setEditingPlan({...editingPlan, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug (Identificador)</Label>
                  <Input 
                    value={editingPlan.slug} 
                    onChange={e => setEditingPlan({...editingPlan, slug: e.target.value})}
                    disabled={!!editingPlan.id} // Não editar slug de plano existente por segurança
                  />
                </div>
              </div>

              <Tabs defaultValue="limits" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="limits">Limites e Cotas</TabsTrigger>
                  <TabsTrigger value="modules">Módulos</TabsTrigger>
                  <TabsTrigger value="features">Features & Config</TabsTrigger>
                </TabsList>
                
                <TabsContent value="limits" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {LIMIT_FIELDS.map(field => {
                      const value = (editingPlan.config as any)[field.key]
                      const isUnlimited = value === null

                      return (
                        <div key={field.key} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>{field.label}</Label>
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                id={`unlimited-${field.key}`}
                                checked={isUnlimited}
                                onCheckedChange={(checked) => {
                                  updateConfig(field.key, checked ? null : 10)
                                }}
                              />
                              <Label htmlFor={`unlimited-${field.key}`} className="text-xs text-muted-foreground">Ilimitado</Label>
                            </div>
                          </div>
                          <Input 
                            type="number" 
                            disabled={isUnlimited}
                            value={isUnlimited ? "" : value}
                            onChange={e => updateConfig(field.key, parseInt(e.target.value))}
                            placeholder={isUnlimited ? "Ilimitado" : "0"}
                          />
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="modules" className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                    {MODULES.map(module => (
                      <div key={module} className="flex items-center gap-2">
                        <Checkbox 
                          id={`mod-${module}`}
                          checked={editingPlan.config?.allowed_modules.includes(module)}
                          onCheckedChange={() => toggleModule(module)}
                        />
                        <Label htmlFor={`mod-${module}`} className="capitalize">{module}</Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="features" className="mt-4 space-y-4">
                  <div className="space-y-4 p-4 border rounded-lg">
                    <Label className="text-lg font-semibold">Features Especiais</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {FEATURES.map(feature => (
                        <div key={feature} className="flex items-center gap-2">
                          <Checkbox 
                            id={`feat-${feature}`}
                            checked={editingPlan.config?.features.includes(feature)}
                            onCheckedChange={() => toggleFeature(feature)}
                          />
                          <Label htmlFor={`feat-${feature}`}>{feature}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Nível de Suporte</Label>
                    <Input 
                      value={editingPlan.config?.support_level}
                      onChange={e => updateConfig("support_level", e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
