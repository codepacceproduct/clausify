"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { MonitoringList, MonitoredProcess } from "@/components/consultas/monitoring-list"
import { MonitoringAdd } from "@/components/consultas/monitoring-add"
import { Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock Data
const INITIAL_PROCESSES: MonitoredProcess[] = [
  {
    id: "1",
    processNumber: "1023456-78.2023.8.26.0100",
    nickname: "Ação Indenizatória - Silva vs Souza",
    status: "active",
    lastUpdate: "2024-01-10T14:30:00Z",
    movements: 2,
    notifications: { email: true, push: true, whatsapp: false }
  },
  {
    id: "2",
    processNumber: "0004567-12.2022.4.03.6100",
    nickname: "Execução Fiscal - Empresa ABC",
    status: "suspended",
    lastUpdate: "2023-12-15T09:00:00Z",
    movements: 0,
    notifications: { email: true, push: false, whatsapp: false }
  },
  {
    id: "3",
    processNumber: "5001234-56.2024.8.13.0024",
    nickname: "Divórcio Consensual",
    status: "active",
    lastUpdate: "2024-01-12T16:45:00Z",
    movements: 0,
    notifications: { email: true, push: true, whatsapp: true }
  }
]

export default function MonitoramentoPage() {
  const [viewState, setViewState] = useState<"list" | "add">("list")
  const [processes, setProcesses] = useState<MonitoredProcess[]>(INITIAL_PROCESSES)
  const [filter, setFilter] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const handleAddProcess = (newProcess: any) => {
    const process: MonitoredProcess = {
      ...newProcess,
      id: Math.random().toString(36).substr(2, 9),
    }
    setProcesses([process, ...processes])
    setViewState("list")
  }

  const handleDelete = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id))
  }

  const handleStatusChange = (id: string, status: MonitoredProcess["status"]) => {
    setProcesses(processes.map(p => 
      p.id === id ? { ...p, status } : p
    ))
  }

  const filteredProcesses = processes.filter(p => {
    const matchesSearch = p.nickname.toLowerCase().includes(filter.toLowerCase()) ||
      p.processNumber.includes(filter)
    
    if (!matchesSearch) return false

    if (activeTab === "active") return p.status === "active"
    if (activeTab === "alert") return p.movements > 0
    return true
  })

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Monitoramento Processual
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus processos e receba notificações automáticas.
            </p>
          </div>
          {viewState === "list" && (
            <Button onClick={() => setViewState("add")} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Novo Monitoramento
            </Button>
          )}
        </div>

        {viewState === "list" ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full">
                <Filter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filtrar por apelido ou número..."
                  className="pl-9"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              <Tabs defaultValue="all" className="w-full sm:w-[400px]" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="active">Ativos</TabsTrigger>
                  <TabsTrigger value="alert">Alertas</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <MonitoringList 
              processes={filteredProcesses}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-300 max-w-2xl mx-auto mt-8">
            <MonitoringAdd 
              onAdd={handleAddProcess}
              onCancel={() => setViewState("list")}
            />
          </div>
        )}
      </div>
    </LayoutWrapper>
  )
}
