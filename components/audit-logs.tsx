"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, FileText, Upload, Edit, Trash2, Eye, User, Calendar } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const logs = [
  {
    id: 1,
    user: "Dr. Ricardo Silva",
    action: "download",
    resource: "Contrato Alpha Tech v2.0",
    timestamp: "28/01/2025 14:32",
    ip: "192.168.1.100",
    status: "success" as const,
  },
  {
    id: 2,
    user: "Ana Paula Mendes",
    action: "upload",
    resource: "Contrato Beta Construção",
    timestamp: "28/01/2025 14:15",
    ip: "192.168.1.105",
    status: "success" as const,
  },
  {
    id: 3,
    user: "Carlos Alberto",
    action: "edit",
    resource: "Cláusula de Confidencialidade",
    timestamp: "28/01/2025 13:48",
    ip: "192.168.1.112",
    status: "success" as const,
  },
  {
    id: 4,
    user: "Usuário Desconhecido",
    action: "login",
    resource: "Sistema",
    timestamp: "28/01/2025 13:22",
    ip: "203.45.67.89",
    status: "failed" as const,
  },
  {
    id: 5,
    user: "Dr. Ricardo Silva",
    action: "view",
    resource: "Portfólio Completo",
    timestamp: "28/01/2025 12:55",
    ip: "192.168.1.100",
    status: "success" as const,
  },
  {
    id: 6,
    user: "Julia Santos",
    action: "delete",
    resource: "Rascunho Contrato Gamma",
    timestamp: "28/01/2025 11:30",
    ip: "192.168.1.118",
    status: "success" as const,
  },
  {
    id: 7,
    user: "Usuário Desconhecido",
    action: "login",
    resource: "Sistema",
    timestamp: "28/01/2025 10:45",
    ip: "203.45.67.89",
    status: "failed" as const,
  },
  {
    id: 8,
    user: "Marcos Oliveira",
    action: "upload",
    resource: "Template NDA Atualizado",
    timestamp: "28/01/2025 10:12",
    ip: "192.168.1.125",
    status: "success" as const,
  },
  {
    id: 9,
    user: "Ana Paula Mendes",
    action: "compare",
    resource: "Alpha Tech v1.0 vs v2.0",
    timestamp: "28/01/2025 09:38",
    ip: "192.168.1.105",
    status: "success" as const,
  },
  {
    id: 10,
    user: "Dr. Ricardo Silva",
    action: "download",
    resource: "Relatório Mensal",
    timestamp: "28/01/2025 09:05",
    ip: "192.168.1.100",
    status: "success" as const,
  },
]

const actionIcons = {
  download: Download,
  upload: Upload,
  edit: Edit,
  delete: Trash2,
  view: Eye,
  login: User,
  compare: FileText,
}

const actionLabels = {
  download: "Download",
  upload: "Upload",
  edit: "Edição",
  delete: "Exclusão",
  view: "Visualização",
  login: "Login",
  compare: "Comparação",
}

export function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = filterAction === "all" || log.action === filterAction
    const matchesStatus = filterStatus === "all" || log.status === filterStatus
    return matchesSearch && matchesAction && matchesStatus
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Registro de Auditoria</CardTitle>
            <CardDescription>Histórico completo de atividades no sistema</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Logs
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por usuário ou recurso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Ação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="download">Download</SelectItem>
              <SelectItem value="upload">Upload</SelectItem>
              <SelectItem value="edit">Edição</SelectItem>
              <SelectItem value="delete">Exclusão</SelectItem>
              <SelectItem value="view">Visualização</SelectItem>
              <SelectItem value="login">Login</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="success">Sucesso</SelectItem>
              <SelectItem value="failed">Falha</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logs List */}
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const ActionIcon = actionIcons[log.action as keyof typeof actionIcons]
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      log.status === "failed" ? "bg-destructive/10" : "bg-primary/10"
                    }`}
                  >
                    <ActionIcon
                      className={`h-5 w-5 ${log.status === "failed" ? "text-destructive" : "text-primary"}`}
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{log.user}</p>
                      <Badge variant="secondary" className="text-xs">
                        {actionLabels[log.action as keyof typeof actionLabels]}
                      </Badge>
                      <Badge
                        className={
                          log.status === "success"
                            ? "bg-success/10 text-success hover:bg-success/20 text-xs"
                            : "bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs"
                        }
                      >
                        {log.status === "success" ? "Sucesso" : "Falha"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.resource}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {log.timestamp}
                      </span>
                      <span>•</span>
                      <span>IP: {log.ip}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
