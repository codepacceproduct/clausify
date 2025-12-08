"use client"

import { useEffect, useMemo, useState } from "react"
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
import { supabase } from "@/lib/supabase"
import { getAuthToken, getUserEmail } from "@/lib/auth"

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
  previewUrl?: string | null
}

function sanitizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-_.]/g, "-").replace(/-+/g, "-")
}

export function ApprovalPending() {
  const [comment, setComment] = useState("")
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [items, setItems] = useState<PendingApproval[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("approvals")
        .select("id, contract_name, client, value, type, current_level, total_levels, submitted_by, submitted_at, deadline, priority, comments, previous_approvals, status")
        .eq("status", "pending")
        .order("submitted_at", { ascending: false })
      const rows = (data || []) as any[]
      const mapped: PendingApproval[] = rows.map((r) => ({
        id: String(r.id),
        contractName: String(r.contract_name || ""),
        client: String(r.client || ""),
        value: String(r.value || ""),
        type: String(r.type || ""),
        currentLevel: Number(r.current_level || 1),
        totalLevels: Number(r.total_levels || 1),
        submittedBy: { name: String(r.submitted_by || "Usuário"), avatar: "", role: "" },
        submittedAt: r.submitted_at ? new Date(r.submitted_at).toLocaleString("pt-BR") : "",
        deadline: r.deadline ? new Date(r.deadline).toLocaleDateString("pt-BR") : "",
        priority: (String(r.priority || "medium") as any),
        comments: Array.isArray(r.comments) ? r.comments : [],
        previousApprovals: Array.isArray(r.previous_approvals) ? r.previous_approvals : [],
        previewUrl: null,
      }))
      setItems(mapped)
    }
    load()
  }, [])

  const fetchPreviewUrl = async (contractName: string): Promise<string | null> => {
    try {
      const token = getAuthToken()
      const r = await fetch(`/api/contracts/list`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
      const j = await r.json().catch(() => ({ items: [] }))
      const files: { name: string; signedUrl: string | null }[] = j.items || []
      const safe = sanitizeName(contractName)
      const found = files.find((f) => sanitizeName(f.name).includes(safe)) || files[0]
      return found?.signedUrl || null
    } catch {
      return null
    }
  }

  const handleApprove = async (id: string) => {
    setIsApproving(true)
    const email = getUserEmail() || ""
    const now = new Date()
    const newComment = comment.trim()
    const { data: rows } = await supabase.from("approvals").select("comments").eq("id", id).limit(1)
    const existing = rows?.[0]?.comments || []
    const updatedComments = newComment
      ? [...existing, { id: `${now.getTime()}`, user: email || "", avatar: "", role: "", text: newComment, date: now.toLocaleString("pt-BR") }]
      : existing
    await supabase.from("approvals").update({ status: "approved", comments: updatedComments }).eq("id", id)
    try {
      const tk = getAuthToken()
      const headers: any = { "Content-Type": "application/json" }
      if (tk) headers.Authorization = `Bearer ${tk}`
      await fetch(`/api/audit/logs/record`, { method: "POST", headers, body: JSON.stringify({ action: "approve", resource: id, status: "success" }) })
    } catch {}
    setComment("")
    setIsApproving(false)
    setItems((prev) => prev.filter((p) => p.id !== id))
  }

  const handleReject = async (id: string) => {
    setIsRejecting(true)
    const email = getUserEmail() || ""
    const now = new Date()
    const newComment = comment.trim()
    const { data: rows } = await supabase.from("approvals").select("comments").eq("id", id).limit(1)
    const existing = rows?.[0]?.comments || []
    const updatedComments = newComment
      ? [...existing, { id: `${now.getTime()}`, user: email || "", avatar: "", role: "", text: newComment, date: now.toLocaleString("pt-BR") }]
      : existing
    await supabase.from("approvals").update({ status: "rejected", comments: updatedComments }).eq("id", id)
    try {
      const tk = getAuthToken()
      const headers: any = { "Content-Type": "application/json" }
      if (tk) headers.Authorization = `Bearer ${tk}`
      await fetch(`/api/audit/logs/record`, { method: "POST", headers, body: JSON.stringify({ action: "reject", resource: id, status: "success" }) })
    } catch {}
    setComment("")
    setIsRejecting(false)
    setItems((prev) => prev.filter((p) => p.id !== id))
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

  const summary = useMemo(() => {
    const pending = items.length
    const high = items.filter((i) => i.priority === "high").length
    const now = new Date()
    const recentApproved = 0
    const avgDays = Math.round(
      items.reduce((acc, i) => {
        const sub = i.submittedAt ? new Date(i.submittedAt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")).getTime() : now.getTime()
        return acc + (now.getTime() - sub) / (1000 * 60 * 60 * 24)
      }, 0) / Math.max(1, items.length)
    )
    return { pending, high, recentApproved, avgDays }
  }, [items])

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
                <p className="text-2xl font-bold">{summary.pending}</p>
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
                <p className="text-2xl font-bold">{summary.high}</p>
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
                <p className="text-2xl font-bold">{summary.recentApproved}</p>
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
                <p className="text-2xl font-bold">{summary.avgDays} dias</p>
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
            {items.map((approval) => (
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

                  <Dialog onOpenChange={async (open) => {
                    if (!open) return
                    const url = await fetchPreviewUrl(approval.contractName)
                    setItems((prev) => prev.map((p) => (p.id === approval.id ? { ...p, previewUrl: url } : p)))
                  }}>
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
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Pré-visualização</h4>
                              <div className="border rounded-lg overflow-hidden">
                                {approval.previewUrl ? (
                                  <iframe src={approval.previewUrl} className="w-full h-64" />
                                ) : (
                                  <div className="p-4 text-sm text-muted-foreground">Arquivo não encontrado para este contrato</div>
                                )}
                              </div>
                            </div>
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
                        <Button variant="destructive" onClick={() => handleReject(approval.id)} disabled={isRejecting || isApproving}>
                          {isRejecting ? (
                            "Rejeitando..."
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeitar
                            </>
                          )}
                        </Button>
                        <Button onClick={() => handleApprove(approval.id)} disabled={isApproving || isRejecting}>
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
