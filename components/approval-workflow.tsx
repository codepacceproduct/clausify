"use client"

import { useState } from "react"
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

const workflows: Workflow[] = [
  {
    id: "1",
    name: "Fluxo Padrão - 3 Níveis",
    description: "Workflow completo com análise, gestão e diretoria",
    contractTypes: ["Prestação de Serviços", "Locação", "Fornecimento"],
    isActive: true,
    levels: [
      { id: "l1", level: 1, role: "Analista Jurídico", approvers: ["Carlos Mendes", "Ana Costa"], isRequired: true },
      { id: "l2", level: 2, role: "Gestor Jurídico", approvers: ["Patricia Lima"], isRequired: true },
      { id: "l3", level: 3, role: "Diretor", approvers: ["Roberto Silva"], isRequired: true },
    ],
  },
  {
    id: "2",
    name: "Fluxo Simplificado - NDA",
    description: "Aprovação rápida para acordos de confidencialidade",
    contractTypes: ["NDA", "Termo de Confidencialidade"],
    isActive: true,
    levels: [
      { id: "l1", level: 1, role: "Analista Jurídico", approvers: ["Carlos Mendes", "Ana Costa"], isRequired: true },
      { id: "l2", level: 2, role: "Gestor Jurídico", approvers: ["Patricia Lima"], isRequired: true },
    ],
  },
  {
    id: "3",
    name: "Fluxo Alto Valor",
    description: "Para contratos acima de R$ 500.000,00",
    contractTypes: ["Todos os tipos"],
    isActive: true,
    levels: [
      { id: "l1", level: 1, role: "Analista Jurídico", approvers: ["Carlos Mendes", "Ana Costa"], isRequired: true },
      { id: "l2", level: 2, role: "Gestor Jurídico", approvers: ["Patricia Lima"], isRequired: true },
      { id: "l3", level: 3, role: "Diretor Jurídico", approvers: ["Roberto Silva"], isRequired: true },
      { id: "l4", level: 4, role: "CEO", approvers: ["João Martins"], isRequired: true },
    ],
  },
]

export function ApprovalWorkflow() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState("")
  const [newWorkflowDesc, setNewWorkflowDesc] = useState("")

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
              <Button onClick={() => setIsCreateOpen(false)}>Criar Fluxo</Button>
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
                  <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
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
    </div>
  )
}
