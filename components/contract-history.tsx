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

export function ContractHistoryList({ 
  onSelect, 
  onReanalyze, 
  onDelete, 
  onExportPDF,
  refreshTrigger = 0
}: { 
  onSelect?: (id: string) => void, 
  onReanalyze?: (id: string) => void,
  onDelete?: (id: string) => void,
  onExportPDF?: (id: string) => void,
  refreshTrigger?: number
}) {
  const [contracts, setContracts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")

  useEffect(() => {
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
          <Badge className="bg-success/10 text-success hover:bg-success/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Concluída
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Falhou
          </Badge>
        )
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Processando
          </Badge>
        )
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Baixo</Badge>
      case "medium":
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">Médio</Badge>
      case "high":
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Alto</Badge>
      default:
        return <Badge variant="secondary">N/A</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analysisHistory.length}</p>
                <p className="text-xs text-muted-foreground">Total de Análises</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analysisHistory.filter((a) => a.status === "completed").length}</p>
                <p className="text-xs text-muted-foreground">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analysisHistory.filter((a) => a.riskLevel === "high").length}</p>
                <p className="text-xs text-muted-foreground">Alto Risco</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">14 min</p>
                <p className="text-xs text-muted-foreground">Tempo Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Análises</CardTitle>
          <CardDescription>Todas as análises realizadas na plataforma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por contrato, cliente ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Risco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="low">Baixo</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={`rounded-md border overflow-x-auto transition-opacity duration-200 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] sm:w-[300px]">Contrato</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Risco</TableHead>
                <TableHead className="hidden lg:table-cell">Achados</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[250px] sm:max-w-[300px]">
                    <div>
                      <p className="font-medium text-sm truncate" title={item.contractName}>{item.contractName}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.client}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="whitespace-nowrap">{item.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap">{item.analyzedAt}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="hidden md:table-cell">{getRiskBadge(item.riskLevel)}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {item.status === "completed" ? (
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1" title="Alto Risco">
                          <div className="h-2 w-2 rounded-full bg-destructive" />
                          <span className="font-medium text-muted-foreground">{item.findings.high}</span>
                        </div>
                        <div className="flex items-center gap-1" title="Médio Risco">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                          <span className="font-medium text-muted-foreground">{item.findings.medium}</span>
                        </div>
                        <div className="flex items-center gap-1" title="Baixo Risco">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="font-medium text-muted-foreground">{item.findings.low}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onReanalyze?.(item.id)}
                        className="text-muted-foreground hover:text-primary"
                        title="Reanalisar Contrato"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onSelect?.(item.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Relatório
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onExportPDF?.(item.id)}>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onReanalyze?.(item.id)}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reanalisar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete?.(item.id)} className="text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
