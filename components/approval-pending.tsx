"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  MessageSquare,
  ChevronRight,
  AlertTriangle,
  User,
  Building,
  DollarSign,
  Calendar,
} from "lucide-react"

interface PendingApproval {
  id: string
  contractName: string
  client: string
  value: string
  type: string
  currentLevel: number
  totalLevels: number
  submittedBy: {
    name: string
    avatar: string
    role: string
  }
  submittedAt: string
  deadline: string
  priority: "high" | "medium" | "low"
  comments: Array<{
    id: string
    user: string
    avatar: string
    role: string
    text: string
    date: string
  }>
  previousApprovals: Array<{
    level: number
    role: string
    approver: string
    status: "approved" | "rejected" | "pending"
    date?: string
    comment?: string
  }>
}

const pendingApprovals: PendingApproval[] = [
  {
    id: "1",
    contractName: "Contrato de Prestação de Serviços - Alpha Tech",
    client: "Alpha Tech Solutions",
    value: "R$ 450.000,00",
    type: "Prestação de Serviços",
    currentLevel: 2,
    totalLevels: 3,
    submittedBy: {
      name: "Maria Silva",
      avatar: "",
      role: "Analista Jurídico",
    },
    submittedAt: "20/01/2025 às 14:30",
    deadline: "25/01/2025",
    priority: "high",
    comments: [
      {
        id: "c1",
        user: "Carlos Mendes",
        avatar: "",
        role: "Analista Sr.",
        text: "Contrato revisado. Cláusulas de confidencialidade adequadas ao padrão da empresa.",
        date: "21/01/2025 às 09:15",
      },
    ],
    previousApprovals: [
      {
        level: 1,
        role: "Analista",
        approver: "Carlos Mendes",
        status: "approved",
        date: "21/01/2025",
        comment: "Aprovado com ressalvas menores",
      },
      { level: 2, role: "Gestor", approver: "Você", status: "pending" },
      { level: 3, role: "Diretor", approver: "Roberto Lima", status: "pending" },
    ],
  },
  {
    id: "2",
    contractName: "Acordo de Confidencialidade - Beta Corp",
    client: "Beta Corporation",
    value: "N/A",
    type: "NDA",
    currentLevel: 2,
    totalLevels: 2,
    submittedBy: {
      name: "João Santos",
      avatar: "",
      role: "Analista Jurídico",
    },
    submittedAt: "19/01/2025 às 10:00",
    deadline: "22/01/2025",
    priority: "medium",
    comments: [],
    previousApprovals: [
      { level: 1, role: "Analista", approver: "Ana Costa", status: "approved", date: "20/01/2025" },
      { level: 2, role: "Gestor", approver: "Você", status: "pending" },
    ],
  },
  {
    id: "3",
    contractName: "Contrato de Locação Comercial - Sede SP",
    client: "Imobiliária Central",
    value: "R$ 85.000,00/mês",
    type: "Locação",
    currentLevel: 3,
    totalLevels: 3,
    submittedBy: {
      name: "Pedro Alves",
      avatar: "",
      role: "Coordenador",
    },
    submittedAt: "18/01/2025 às 16:45",
    deadline: "23/01/2025",
    priority: "high",
    comments: [
      {
        id: "c2",
        user: "Ana Costa",
        avatar: "",
        role: "Analista",
        text: "Valores estão acima da média de mercado. Sugiro renegociação.",
        date: "19/01/2025 às 11:30",
      },
      {
        id: "c3",
        user: "Carlos Mendes",
        avatar: "",
        role: "Gestor",
        text: "Localização estratégica justifica o valor. Aprovado com esta ressalva.",
        date: "20/01/2025 às 14:00",
      },
    ],
    previousApprovals: [
      {
        level: 1,
        role: "Analista",
        approver: "Ana Costa",
        status: "approved",
        date: "19/01/2025",
        comment: "Aprovado com ressalvas",
      },
      {
        level: 2,
        role: "Gestor",
        approver: "Carlos Mendes",
        status: "approved",
        date: "20/01/2025",
        comment: "Aprovado",
      },
      { level: 3, role: "Diretor", approver: "Você", status: "pending" },
    ],
  },
]

export function ApprovalPending() {
  const [comment, setComment] = useState("")
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  const handleApprove = async () => {
    setIsApproving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsApproving(false)
    setComment("")
  }

  const handleReject = async () => {
    setIsRejecting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRejecting(false)
    setComment("")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "medium":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta Prioridade"
      case "medium":
        return "Média Prioridade"
      default:
        return "Baixa Prioridade"
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingApprovals.length}</p>
                <p className="text-xs text-muted-foreground">Aguardando Aprovação</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">Alta Prioridade</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Aprovados (Mês)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">2.3 dias</p>
                <p className="text-xs text-muted-foreground">Tempo Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending List */}
      <Card>
        <CardHeader>
          <CardTitle>Contratos Pendentes de Aprovação</CardTitle>
          <CardDescription>Revise e aprove os contratos aguardando sua decisão</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{approval.contractName}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building className="h-3.5 w-3.5" />
                            {approval.client}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5" />
                            {approval.value}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className={getPriorityColor(approval.priority)}>
                        {getPriorityLabel(approval.priority)}
                      </Badge>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center gap-2">
                      {approval.previousApprovals.map((step, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                              step.status === "approved"
                                ? "bg-success/10 text-success"
                                : step.status === "pending"
                                  ? "bg-amber-500/10 text-amber-600 ring-2 ring-amber-500/30"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {step.status === "approved" ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : step.status === "pending" ? (
                              <Clock className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {step.role}
                          </div>
                          {index < approval.previousApprovals.length - 1 && (
                            <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Enviado por {approval.submittedBy.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Prazo: {approval.deadline}
                      </span>
                      {approval.comments.length > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {approval.comments.length} comentário(s)
                        </span>
                      )}
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        Revisar
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>Revisão de Contrato</DialogTitle>
                        <DialogDescription>{approval.contractName}</DialogDescription>
                      </DialogHeader>

                      <ScrollArea className="max-h-[60vh] pr-4">
                        <div className="space-y-6">
                          {/* Contract Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Cliente</p>
                              <p className="text-sm font-medium">{approval.client}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Valor</p>
                              <p className="text-sm font-medium">{approval.value}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Tipo</p>
                              <p className="text-sm font-medium">{approval.type}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Prazo de Aprovação</p>
                              <p className="text-sm font-medium">{approval.deadline}</p>
                            </div>
                          </div>

                          {/* Approval Flow */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium">Fluxo de Aprovação</h4>
                            <div className="space-y-2">
                              {approval.previousApprovals.map((step, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center justify-between p-3 rounded-lg border ${
                                    step.status === "pending" ? "bg-amber-500/5 border-amber-500/20" : "bg-muted/50"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-1.5 rounded-full ${
                                        step.status === "approved"
                                          ? "bg-success/10"
                                          : step.status === "pending"
                                            ? "bg-amber-500/10"
                                            : "bg-muted"
                                      }`}
                                    >
                                      {step.status === "approved" ? (
                                        <CheckCircle className="h-4 w-4 text-success" />
                                      ) : step.status === "pending" ? (
                                        <Clock className="h-4 w-4 text-amber-600" />
                                      ) : (
                                        <XCircle className="h-4 w-4 text-muted-foreground" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        Nível {step.level}: {step.role}
                                      </p>
                                      <p className="text-xs text-muted-foreground">{step.approver}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    {step.status === "approved" && (
                                      <>
                                        <Badge
                                          variant="outline"
                                          className="bg-success/10 text-success border-success/20"
                                        >
                                          Aprovado
                                        </Badge>
                                        {step.date && <p className="text-xs text-muted-foreground mt-1">{step.date}</p>}
                                      </>
                                    )}
                                    {step.status === "pending" && (
                                      <Badge
                                        variant="outline"
                                        className="bg-amber-500/10 text-amber-600 border-amber-500/20"
                                      >
                                        Aguardando
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Comments */}
                          {approval.comments.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium">Comentários Anteriores</h4>
                              <div className="space-y-3">
                                {approval.comments.map((c) => (
                                  <div key={c.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={c.avatar || "/placeholder.svg"} />
                                      <AvatarFallback>
                                        {c.user
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">{c.user}</p>
                                        <span className="text-xs text-muted-foreground">• {c.role}</span>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">{c.text}</p>
                                      <p className="text-xs text-muted-foreground mt-2">{c.date}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Add Comment */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Adicionar Comentário</label>
                            <Textarea
                              placeholder="Digite seu comentário sobre este contrato..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>
                      </ScrollArea>

                      <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button variant="destructive" onClick={handleReject} disabled={isRejecting || isApproving}>
                          {isRejecting ? (
                            "Rejeitando..."
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeitar
                            </>
                          )}
                        </Button>
                        <Button onClick={handleApprove} disabled={isApproving || isRejecting}>
                          {isApproving ? (
                            "Aprovando..."
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Aprovar
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
