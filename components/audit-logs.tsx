"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, FileText, Upload, Edit, Trash2, Eye, User, Calendar } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getUserEmail, getAuthToken } from "@/lib/auth"

type LogItem = {
  id: string | number
  user: string
  action: "login" | "download" | "upload" | "edit" | "delete" | "view" | "compare"
  resource: string
  timestamp: string
  ip: string | null
  status: "success" | "failed"
}

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
  const [logs, setLogs] = useState<LogItem[]>([])

  useEffect(() => {
    const email = getUserEmail()
    if (!email) return
    ;(async () => {
      try {
        const token = getAuthToken()
        const r = await fetch(`/api/audit/logs/list`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
        const j = await r.json()
        const rows: any[] = j.logs || []
        const mapped: LogItem[] = rows.map((s) => ({
          id: s.id,
          user: s.email || email,
          action: s.action,
          resource: s.resource,
          timestamp: new Date(s.timestamp).toLocaleString(),
          ip: s.ip || null,
          status: s.status,
        }))
        setLogs(mapped)
        const ips = Array.from(new Set(rows.map((s) => s.ip).filter(Boolean))) as string[]
        await Promise.all(
          ips.map((ip) => {
            const tk = getAuthToken()
            const headers: any = { "Content-Type": "application/json" }
            if (tk) headers.Authorization = `Bearer ${tk}`
            return fetch(`/api/audit/logs/record`, { method: "POST", headers, body: JSON.stringify({ ip, resource: "Sistema", action: "ip_change" }) }).catch(() => {})
          })
        )
      } catch {}
    })()
  }, [])

  const filteredLogs = useMemo(() => {
    const matchesSearch =
      (searchTerm ? (l: LogItem) => l.user.toLowerCase().includes(searchTerm.toLowerCase()) || l.resource.toLowerCase().includes(searchTerm.toLowerCase()) : () => true)
    const actionFilter = filterAction === "all" ? () => true : (l: LogItem) => l.action === filterAction
    const statusFilter = filterStatus === "all" ? () => true : (l: LogItem) => l.status === filterStatus
    return logs.filter((l) => matchesSearch(l) && actionFilter(l) && statusFilter(l))
  }, [logs, searchTerm, filterAction, filterStatus])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Registro de Auditoria</CardTitle>
            <CardDescription>Histórico completo de atividades no sistema</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const email = getUserEmail()
              if (!email) return
              const token = getAuthToken()
              const res = await fetch(`/api/audit/logs/export`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
              const blob = await res.blob()
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `audit-logs-${new Date().toISOString().slice(0,10)}.csv`
              document.body.appendChild(a)
              a.click()
              a.remove()
              URL.revokeObjectURL(url)
            }}
          >
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
