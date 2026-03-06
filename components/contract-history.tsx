"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Eye,
  Download,
  RotateCcw,
  MoreHorizontal,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Trash2,
} from "lucide-react"
import { ContractHistorySkeleton } from "@/components/contracts/skeletons"
import { cn } from "@/lib/utils"

export function ContractHistoryList({ 
  onSelect, 
  onReanalyze, 
  onDelete, 
  onExportPDF,
  refreshTrigger = 0,
  initialData = []
}: { 
  onSelect?: (id: string) => void, 
  onReanalyze?: (id: string) => void,
  onDelete?: (id: string) => void,
  onExportPDF?: (id: string) => void,
  refreshTrigger?: number,
  initialData?: any[]
}) {
  const [contracts, setContracts] = useState<any[]>(initialData)
  const [isLoading, setIsLoading] = useState(initialData.length === 0)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")

  useEffect(() => {
    // If we have initial data and haven't triggered a refresh, don't fetch
    if (initialData.length > 0 && refreshTrigger === 0) {
      setIsLoading(false)
      return
    }
    fetchContracts()
  }, [refreshTrigger])

  const fetchContracts = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/contracts/list")
      if (res.ok) {
        const data = await res.json()
        setContracts(data.contracts || [])
      }
    } catch (error) {
      console.error("Failed to fetch history", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <ContractHistorySkeleton />
  }

  const analysisHistory = contracts.map(c => ({
    id: c.id,
    contractName: c.name,
    client: c.client_name || "Cliente não informado",
    type: c.type || "Geral",
    analyzedAt: new Date(c.created_at).toLocaleString("pt-BR"),
    duration: "—", 
    status: (c.status === "analyzed" ? "completed" : c.status === "uploaded" ? "pending" : "failed") as "completed" | "pending" | "failed",
    riskLevel: (c.risk_level || "unknown") as "low" | "medium" | "high" | "unknown",
    findings: c.analysis?.issues ? {
        high: c.analysis.issues.filter((i:any) => i.severity === 'high').length,
        medium: c.analysis.issues.filter((i:any) => i.severity === 'medium').length,
        low: c.analysis.issues.filter((i:any) => i.severity === 'low').length,
    } : { high: 0, medium: 0, low: 0 }
  }))

  const filteredHistory = analysisHistory.filter((item) => {
    const matchesSearch =
      item.contractName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesRisk = riskFilter === "all" || item.riskLevel === riskFilter
    return matchesSearch && matchesStatus && matchesRisk
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
            <CheckCircle className="h-3 w-3 mr-1" />
            Concluída
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20 transition-colors">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Falhou
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20 transition-colors">
            <Clock className="h-3 w-3 mr-1" />
            Processando
          </Badge>
        )
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-sm">Baixo</Badge>
      case "medium":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shadow-sm">Médio</Badge>
      case "high":
        return <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 shadow-sm">Alto</Badge>
      default:
        return <Badge variant="outline" className="text-muted-foreground border-border">N/A</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">{analysisHistory.length}</p>
                <p className="text-xs text-muted-foreground font-medium">Total de Análises</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">{analysisHistory.filter((a) => a.status === "completed").length}</p>
                <p className="text-xs text-muted-foreground font-medium">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">{analysisHistory.filter((a) => a.riskLevel === "high").length}</p>
                <p className="text-xs text-muted-foreground font-medium">Alto Risco</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">14 min</p>
                <p className="text-xs text-muted-foreground font-medium">Tempo Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="tracking-tight">Histórico de Análises</CardTitle>
              <CardDescription>Gerencie seus contratos e visualizações anteriores</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar contrato..."
                  className="pl-9 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                  <SelectItem value="pending">Processando</SelectItem>
                  <SelectItem value="failed">Falhas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="w-[300px] font-semibold text-foreground">Contrato</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground">Risco</TableHead>
                  <TableHead className="font-semibold text-foreground">Data</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Nenhum contrato encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((contract) => (
                    <TableRow key={contract.id} className="group hover:bg-muted/30 border-b border-border/50">
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors">{contract.contractName}</span>
                          <span className="text-xs text-muted-foreground">{contract.client} • {contract.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(contract.status)}</TableCell>
                      <TableCell>{getRiskBadge(contract.riskLevel)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{contract.analyzedAt}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onSelect?.(contract.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onExportPDF?.(contract.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Exportar PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onReanalyze?.(contract.id)}>
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Reanalisar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => onDelete?.(contract.id)}
                                className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
