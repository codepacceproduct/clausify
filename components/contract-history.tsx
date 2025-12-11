"use client"

import { useState } from "react"
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
} from "lucide-react"

const analysisHistory = [
  {
    id: "AN-2025-042",
    contractName: "Contrato Alpha Tech - Serviços de TI",
    client: "Empresa Alpha Tech Ltda",
    type: "Prestação de Serviços",
    analyzedAt: "28/01/2025 14:32",
    duration: "12 min",
    status: "completed" as const,
    riskLevel: "low" as const,
    findings: { high: 0, medium: 2, low: 5 },
  },
  {
    id: "AN-2025-041",
    contractName: "Contrato Beta Construção - Obra Civil",
    client: "Construtora Beta S/A",
    type: "Contrato de Obra",
    analyzedAt: "27/01/2025 09:15",
    duration: "18 min",
    status: "completed" as const,
    riskLevel: "high" as const,
    findings: { high: 4, medium: 6, low: 3 },
  },
  {
    id: "AN-2025-040",
    contractName: "Locação Comercial Gamma",
    client: "Imobiliária Gamma",
    type: "Locação Comercial",
    analyzedAt: "26/01/2025 16:48",
    duration: "8 min",
    status: "completed" as const,
    riskLevel: "medium" as const,
    findings: { high: 1, medium: 4, low: 2 },
  },
  {
    id: "AN-2025-039",
    contractName: "Fornecimento Delta - Insumos",
    client: "Indústria Delta Manufatura",
    type: "Fornecimento",
    analyzedAt: "25/01/2025 11:22",
    duration: "15 min",
    status: "completed" as const,
    riskLevel: "medium" as const,
    findings: { high: 2, medium: 3, low: 4 },
  },
  {
    id: "AN-2025-038",
    contractName: "Investimento Epsilon Ventures",
    client: "Startup Epsilon Ventures",
    type: "Investimento",
    analyzedAt: "24/01/2025 10:05",
    duration: "22 min",
    status: "failed" as const,
    riskLevel: "unknown" as const,
    findings: { high: 0, medium: 0, low: 0 },
  },
  {
    id: "AN-2025-037",
    contractName: "Parceria Tech Zeta",
    client: "Tech Zeta Corporation",
    type: "Parceria",
    analyzedAt: "23/01/2025 15:30",
    duration: "14 min",
    status: "completed" as const,
    riskLevel: "low" as const,
    findings: { high: 0, medium: 1, low: 6 },
  },
]

export function ContractHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")

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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead>Achados</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{item.contractName}</p>
                      <p className="text-xs text-muted-foreground">{item.client}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{item.analyzedAt}</TableCell>
                  <TableCell className="text-sm">{item.duration}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{getRiskBadge(item.riskLevel)}</TableCell>
                  <TableCell>
                    {item.status === "completed" ? (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-destructive font-medium">{item.findings.high}</span>
                        <span className="text-amber-600 font-medium">{item.findings.medium}</span>
                        <span className="text-success font-medium">{item.findings.low}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Relatório
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Exportar PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reanalisar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
