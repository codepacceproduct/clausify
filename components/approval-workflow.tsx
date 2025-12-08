"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit2, Trash2, Users, ArrowRight, GripVertical, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getAuthToken } from "@/lib/auth"
import { toast } from "sonner"

interface WorkflowLevel {
  id: string
  level: number
  role: string
  approvers: string[]
  isRequired: boolean
  autoApprove?: {
    enabled: boolean
    condition: string
    value: number
  }
}

interface Workflow {
  id: string
  name: string
  description: string
  contractTypes: string[]
  levels: WorkflowLevel[]
  isActive: boolean
}

export function ApprovalWorkflow() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState("")
  const [newWorkflowDesc, setNewWorkflowDesc] = useState("")
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("workflows")
        .select("id,name,description,contract_types,levels,is_active")
        .order("created_at", { ascending: false })
      const rows = (data || []) as any[]
      const mapped: Workflow[] = rows.map((r) => ({
        id: String(r.id),
        name: String(r.name || "Fluxo"),
        description: String(r.description || ""),
        contractTypes: Array.isArray(r.contract_types) ? r.contract_types : [],
        levels: Array.isArray(r.levels) ? r.levels : [],
        isActive: Boolean(r.is_active ?? true),
      }))
      setWorkflows(mapped)
    }
    load()
  }, [])

  const handleCreateWorkflow = async () => {
    if (!newWorkflowName.trim()) return
    setIsCreating(true)
    try {
      const headers: any = { "Content-Type": "application/json" }
      const token = getAuthToken()
      if (token) headers.Authorization = `Bearer ${token}`
      const res = await fetch(`/api/workflows/create`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name: newWorkflowName.trim(), description: newWorkflowDesc.trim(), contractTypes: [], levels: [] }),
      })
      if (!res.ok) throw new Error(`Erro ao criar fluxo`)
      const j = await res.json()
      const w = j?.workflow || {}
      const wf: Workflow = {
        id: String(w.id || `${Date.now()}`),
        name: String(w.name || newWorkflowName.trim()),
        description: String(w.description || newWorkflowDesc.trim()),
        contractTypes: Array.isArray(w.contract_types) ? w.contract_types : [],
        levels: Array.isArray(w.levels) ? w.levels : [],
        isActive: Boolean(w.is_active ?? true),
      }
      setWorkflows((prev) => [wf, ...prev])
      toast.success("Fluxo criado com sucesso")
      setIsCreateOpen(false)
      setNewWorkflowName("")
      setNewWorkflowDesc("")
    } catch {
      toast.error("Não foi possível criar o fluxo")
    }
    setIsCreating(false)
  }

  const openEdit = (wf: Workflow) => {
    setEditId(wf.id)
    setEditName(wf.name)
    setEditDesc(wf.description || "")
    setIsEditOpen(true)
  }

  const saveEdit = async () => {
    if (!editId) return
    const headers: any = { "Content-Type": "application/json" }
    const token = getAuthToken()
    if (token) headers.Authorization = `Bearer ${token}`
    try {
      const res = await fetch(`/api/workflows/update`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ id: editId, name: editName.trim(), description: editDesc.trim() }),
      })
      if (!res.ok) throw new Error("Erro ao salvar fluxo")
      const j = await res.json()
      const w = j?.workflow
      setWorkflows((prev) => prev.map((x) => (x.id === editId ? {
        id: String(w?.id || editId),
        name: String(w?.name || editName.trim()),
        description: String(w?.description || editDesc.trim()),
        contractTypes: Array.isArray(w?.contract_types) ? w.contract_types : x.contractTypes,
        levels: Array.isArray(w?.levels) ? w.levels : x.levels,
        isActive: Boolean(w?.is_active ?? x.isActive),
      } : x)))
      toast.success("Fluxo atualizado")
      setIsEditOpen(false)
      setEditId(null)
    } catch {
      toast.error("Não foi possível atualizar o fluxo")
    }
  }

  const confirmDelete = (wf: Workflow) => {
    setDeleteId(wf.id)
    setIsDeleting(true)
  }

  const doDelete = async () => {
    if (!deleteId) { setIsDeleting(false); return }
    const headers: any = { "Content-Type": "application/json" }
    const token = getAuthToken()
    if (token) headers.Authorization = `Bearer ${token}`
    try {
      const res = await fetch(`/api/workflows/delete`, { method: "DELETE", headers, body: JSON.stringify({ id: deleteId }) })
      if (!res.ok) throw new Error("Erro ao apagar fluxo")
      setWorkflows((prev) => prev.filter((x) => x.id !== deleteId))
      toast.success("Fluxo apagado")
    } catch {
      toast.error("Não foi possível apagar o fluxo")
    }
    setIsDeleting(false)
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Fluxos de Aprovação</h2>
          <p className="text-sm text-muted-foreground">Configure os níveis hierárquicos para cada tipo de contrato</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Fluxo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Fluxo de Aprovação</DialogTitle>
              <DialogDescription>Configure um novo workflow de aprovação para seus contratos</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Fluxo</label>
                <Input
                  placeholder="Ex: Fluxo Padrão - 3 Níveis"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Input
                  placeholder="Descreva o propósito deste fluxo"
                  value={newWorkflowDesc}
                  onChange={(e) => setNewWorkflowDesc(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipos de Contrato</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="servicos">Prestação de Serviços</SelectItem>
                    <SelectItem value="locacao">Locação</SelectItem>
                    <SelectItem value="nda">NDA</SelectItem>
                    <SelectItem value="fornecimento">Fornecimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateWorkflow} disabled={isCreating}>{isCreating ? "Criando..." : "Criar Fluxo"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{workflow.name}</CardTitle>
                    <Badge variant={workflow.isActive ? "default" : "secondary"}>
                      {workflow.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <CardDescription>{workflow.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(workflow)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => confirmDelete(workflow)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Contract Types */}
                <div className="flex flex-wrap gap-2">
                  {workflow.contractTypes.map((type, index) => (
                    <Badge key={index} variant="outline">
                      {type}
                    </Badge>
                  ))}
                </div>

                {/* Levels Visualization */}
                <div className="flex flex-wrap items-center gap-2">
                  {workflow.levels.map((level, index) => (
                    <div key={level.id} className="flex items-center">
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg border">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Nível {level.level}</span>
                          <span className="text-sm font-medium">{level.role}</span>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{level.approvers.length}</span>
                        </div>
                        {level.isRequired && <CheckCircle className="h-3.5 w-3.5 text-success" />}
                      </div>
                      {index < workflow.levels.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Approvers Details */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Aprovadores por Nível</h4>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {workflow.levels.map((level) => (
                      <div key={level.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Nível {level.level} - {level.role}
                          </span>
                          {level.isRequired && (
                            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                              Obrigatório
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1">
                          {level.approvers.map((approver, idx) => (
                            <p key={idx} className="text-sm">
                              {approver}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Fluxo</DialogTitle>
            <DialogDescription>Atualize o nome e a descrição do fluxo</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nome</label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Descrição</label>
              <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
            <Button onClick={saveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleting} onOpenChange={(o) => { if (!o) { setIsDeleting(false); setDeleteId(null) } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apagar Fluxo</DialogTitle>
            <DialogDescription>Tem certeza que deseja apagar este fluxo? Esta ação não pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleting(false); setDeleteId(null) }}>Cancelar</Button>
            <Button variant="destructive" onClick={doDelete}>Apagar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
