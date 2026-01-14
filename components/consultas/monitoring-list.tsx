"use client"

import { Activity, MoreVertical, Archive, PauseCircle, PlayCircle, Trash2, ExternalLink, Bell, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

export interface MonitoredProcess {
  id: string
  processNumber: string
  nickname: string
  status: "active" | "suspended" | "archived" | "error"
  lastUpdate: string
  movements: number
  notifications?: { email: boolean; push: boolean; whatsapp: boolean }
  frequency?: "daily" | "6h" | "1h"
  nextCheck?: string
}

interface MonitoringListProps {
  processes: MonitoredProcess[]
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: MonitoredProcess["status"]) => void
}

export function MonitoringList({ processes, onDelete, onStatusChange }: MonitoringListProps) {
  if (processes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
        <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900">
          <Activity className="h-8 w-8 text-slate-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Nenhum processo monitorado</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Comece adicionando um número de processo para receber notificações de novas movimentações.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {processes.map((process) => (
        <Card key={process.id} className="group hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-foreground truncate">
                    {process.nickname}
                  </h3>
                  {process.movements > 0 && (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 animate-pulse">
                      {process.movements} novos andamentos
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                  {process.processNumber}
                  <Link href={`/consultas/processual?q=${process.processNumber}`} passHref>
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-slate-400 hover:text-emerald-500">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Última atualização: {new Date(process.lastUpdate).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2 border-l pl-4 border-slate-200 dark:border-slate-800">
                    <span className="sr-only">Notificações:</span>
                    {process.frequency && (
                      <Badge variant="outline" className="h-5 px-1.5 text-[10px] bg-slate-100 dark:bg-slate-900">
                        {process.frequency === 'daily' ? '1x/dia' : process.frequency === '6h' ? '6h' : '1h'}
                      </Badge>
                    )}
                    {process.notifications?.email && <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">Email</Badge>}
                    {process.notifications?.push && <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">Push</Badge>}
                    {process.notifications?.whatsapp && <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-green-500 text-green-500">Zap</Badge>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <StatusBadge status={process.status} />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {process.status === "active" ? (
                      <DropdownMenuItem onClick={() => onStatusChange(process.id, "suspended")}>
                        <PauseCircle className="mr-2 h-4 w-4" />
                        Pausar Monitoramento
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onStatusChange(process.id, "active")}>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Retomar Monitoramento
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onStatusChange(process.id, "archived")}>
                      <Archive className="mr-2 h-4 w-4" />
                      Arquivar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600"
                      onClick={() => onDelete(process.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: MonitoredProcess["status"] }) {
  const styles = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    suspended: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    archived: "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-600 border-slate-200 dark:border-slate-800",
    error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
  }

  const labels = {
    active: "Monitorando",
    suspended: "Pausado",
    archived: "Arquivado",
    error: "Erro no Tribunal"
  }

  const icons = {
    active: Activity,
    suspended: PauseCircle,
    archived: Archive,
    error: AlertCircle
  }

  const Icon = icons[status]

  return (
    <Badge variant="outline" className={`${styles[status]} flex items-center gap-1.5 px-3 py-1`}>
      <Icon className="h-3 w-3" />
      {labels[status]}
    </Badge>
  )
}
