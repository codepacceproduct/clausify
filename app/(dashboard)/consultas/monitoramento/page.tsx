"use client"

import { useState, useEffect } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { MonitoringList, MonitoredProcess } from "@/components/consultas/monitoring-list"
import { MonitoringAdd } from "@/components/consultas/monitoring-add"
import { Plus, Filter, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMonitoredProcesses, deleteMonitoredProcess, updateMonitoringStatus } from "@/actions/monitoring"
import { toast } from "sonner"

export default function MonitoramentoPage() {
  const [viewState, setViewState] = useState<"list" | "add">("list")
  const [processes, setProcesses] = useState<MonitoredProcess[]>([])
  const [filter, setFilter] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  const loadProcesses = async () => {
    setIsLoading(true)
    try {
      const data = await getMonitoredProcesses()
      setProcesses(data as any) // Type casting for simplicity as action returns compatible shape
    } catch (error) {
      toast.error("Erro ao carregar processos monitorados")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProcesses()
  }, [])

  const handleAddProcess = () => {
    loadProcesses()
    setViewState("list")
  }

  const handleDelete = async (id: string) => {
    const result = await deleteMonitoredProcess(id)
    if (result.success) {
      setProcesses(processes.filter(p => p.id !== id))
      toast.success("Monitoramento removido")
    } else {
      toast.error("Erro ao remover monitoramento")
    }
  }

  const handleStatusChange = async (id: string, status: MonitoredProcess["status"]) => {
    // Optimistic update
    setProcesses(processes.map(p => 
      p.id === id ? { ...p, status } : p
    ))
    
    const result = await updateMonitoringStatus(id, status)
    if (!result.success) {
      // Revert if failed
      loadProcesses()
      toast.error("Erro ao atualizar status")
    }
  }

  const filteredProcesses = processes.filter(p => {
    const matchesSearch = p.nickname?.toLowerCase().includes(filter.toLowerCase()) ||
      p.processNumber?.includes(filter)
    
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
          <div className="flex items-center gap-2">
            {viewState === "list" && (
              <>
                <Button variant="outline" size="icon" onClick={loadProcesses} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                <Button onClick={() => setViewState("add")} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Monitoramento
                </Button>
              </>
            )}
          </div>
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

            {isLoading ? (
               <div className="flex items-center justify-center py-12">
                 <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
               </div>
            ) : (
              <MonitoringList 
                processes={filteredProcesses}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            )}
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
