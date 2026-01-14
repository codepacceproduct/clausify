"use client"

import { BellRing, CheckCircle2, Clock, Trash2, MoreVertical, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

interface MonitoredTarget {
  id: string
  name: string
  document: string
  type: "pf" | "pj"
  status: "active" | "paused"
  lastCheck: string
  foundActions: number
}

interface NewActionsResultProps {
  onBack: () => void
}

const MOCK_TARGETS: MonitoredTarget[] = [
  {
    id: "1",
    name: "Tech Solutions Ltda",
    document: "12.345.678/0001-90",
    type: "pj",
    status: "active",
    lastCheck: "Há 5 minutos",
    foundActions: 2
  },
  {
    id: "2",
    name: "Carlos Eduardo Silva",
    document: "123.456.789-00",
    type: "pf",
    status: "active",
    lastCheck: "Há 1 hora",
    foundActions: 0
  }
]

export function NewActionsResult({ onBack }: NewActionsResultProps) {
  const [targets, setTargets] = useState<MonitoredTarget[]>(MOCK_TARGETS)

  const handleDelete = (id: string) => {
    setTargets(targets.filter(t => t.id !== id))
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BellRing className="h-6 w-6 text-amber-500" />
            Alvos Monitorados
          </h1>
          <p className="text-muted-foreground">
            Gerencie os CNPJs e CPFs que estão sendo rastreados para novas distribuições.
          </p>
        </div>
        <Button onClick={onBack} className="bg-amber-600 hover:bg-amber-700 text-white">
          + Adicionar Novo Alvo
        </Button>
      </div>

      <div className="grid gap-4">
        {targets.map((target) => (
          <Card key={target.id} className="hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{target.name}</h3>
                    <Badge variant={target.type === 'pj' ? 'secondary' : 'outline'}>
                      {target.type === 'pj' ? 'Empresa' : 'Pessoa Física'}
                    </Badge>
                  </div>
                  <p className="text-sm font-mono text-muted-foreground">
                    {target.document}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Última verificação: {target.lastCheck}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Monitoramento Ativo
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {target.foundActions > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium animate-pulse">
                      <Bell className="h-4 w-4" />
                      {target.foundActions} Novas Ações
                    </div>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(target.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remover Monitoramento
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {targets.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center space-y-4">
              <div className="mx-auto p-4 rounded-full bg-slate-100 dark:bg-slate-900 w-fit">
                <BellRing className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Nenhum alvo monitorado</h3>
                <p className="text-muted-foreground">
                  Adicione um CPF ou CNPJ para começar a receber alertas de novas ações.
                </p>
              </div>
              <Button variant="outline" onClick={onBack}>
                Começar Agora
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full shrink-0">
            <BellRing className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">Como funciona o Alerta?</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
              Nosso sistema varre diariamente os diários oficiais e sistemas de distribuição dos tribunais. 
              Assim que uma nova ação é distribuída contra um dos alvos monitorados, você recebe uma notificação imediata.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
