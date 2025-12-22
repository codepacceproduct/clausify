"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Download, Eye, GitBranch, Clock, FileText, User, ArrowRight } from "lucide-react"

interface ContractVersion {
  id: string
  contractName: string
  version: string
  status: "draft" | "review" | "approved" | "active" | "expired"
  createdBy: {
    name: string
    avatar: string
  }
  createdAt: string
  changes: number
  notes: string
  previousVersion?: string
}

const versions: ContractVersion[] = [
  {
    id: "1",
    contractName: "Contrato de Prestação de Serviços - Alpha Tech",
    version: "3.0",
    status: "active",
    createdBy: { name: "Maria Silva", avatar: "" },
    createdAt: "20/01/2025 às 14:30",
    changes: 8,
    notes: "Versão final aprovada com ajustes de valores e prazos",
    previousVersion: "2.1",
  },
  {
    id: "2",
    contractName: "Contrato de Prestação de Serviços - Alpha Tech",
    version: "2.1",
    status: "expired",
    createdBy: { name: "Carlos Mendes", avatar: "" },
    createdAt: "15/01/2025 às 10:15",
    changes: 3,
    notes: "Correções nas cláusulas de confidencialidade",
    previousVersion: "2.0",
  },
  {
    id: "3",
    contractName: "Contrato de Prestação de Serviços - Alpha Tech",
    version: "2.0",
    status: "expired",
    createdBy: { name: "Maria Silva", avatar: "" },
    createdAt: "10/01/2025 às 16:45",
    changes: 12,
    notes: "Grande revisão com novos termos de pagamento",
    previousVersion: "1.0",
  },
  {
    id: "4",
    contractName: "NDA - Beta Corporation",
    version: "1.2",
    status: "active",
    createdBy: { name: "Ana Costa", avatar: "" },
    createdAt: "18/01/2025 às 09:00",
    changes: 2,
    notes: "Atualização do período de confidencialidade",
    previousVersion: "1.1",
  },
  {
    id: "5",
    contractName: "Contrato de Locação - Sede SP",
    version: "1.0",
    status: "review",
    createdBy: { name: "Pedro Alves", avatar: "" },
    createdAt: "19/01/2025 às 11:30",
    changes: 0,
    notes: "Versão inicial para revisão",
  },
]

// helper para ordenar datas no formato "dd/mm/aaaa às HH:MM"
function parseBrDate(value: string): number {
  const [datePart, timePart] = value.split(" às ")
  if (!datePart) return 0
  const [day, month, year] = datePart.split("/").map(Number)
  const [hour = 0, minute = 0] = (timePart || "").split(":").map(Number)
  return new Date(year || 0, (month || 1) - 1, day || 1, hour, minute).getTime()
}

export function VersionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredVersions = versions.filter((v) => {
    const matchesSearch = v.contractName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || v.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // métricas dinâmicas para o resumo
  const uniqueContracts = new Set(versions.map((v) => v.contractName))
  const activeContracts = new Set(
    versions.filter((v) => v.status === "active").map((v) => v.contractName),
  )
  const reviewContracts = new Set(
    versions.filter((v) => v.status === "review").map((v) => v.contractName),
  )
  const collaborators = new Set(versions.map((v) => v.createdBy.name))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20"
      case "draft":
        return "bg-muted text-muted-foreground border-border"
      case "review":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      case "approved":
        return "bg-primary/10 text-primary border-primary/20"
      case "expired":
        return "bg-muted text-muted-foreground border-border"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "draft":
        return "Rascunho"
      case "review":
        return "Em Revisão"
      case "approved":
        return "Aprovado"
      case "expired":
        return "Expirado"
      default:
        return status
    }
  }

  // Group versions by contract
  const groupedVersions = filteredVersions.reduce(
    (acc, version) => {
      if (!acc[version.contractName]) {
        acc[version.contractName] = []
      }
      acc[version.contractName].push(version)
      return acc
    },
    {} as Record<string, ContractVersion[]>,
  )

  // Ordenar versões de cada contrato por data (mais recente primeiro)
  Object.keys(groupedVersions).forEach((name) => {
    groupedVersions[name].sort(
      (a, b) => parseBrDate(b.createdAt) - parseBrDate(a.createdAt),
    )
  })

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{versions.length}</p>
                <p className="text-xs text-muted-foreground">Total de Versões</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <FileText className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeContracts.size}</p>
                <p className="text-xs text-muted-foreground">Contratos Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reviewContracts.size}</p>
                <p className="text-xs text-muted-foreground">Em Revisão</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{collaborators.size}</p>
                <p className="text-xs text-muted-foreground">Colaboradores</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contratos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="review">Em Revisão</SelectItem>
                <SelectItem value="draft">Rascunhos</SelectItem>
                <SelectItem value="expired">Expirados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Versions by Contract */}
      <div className="space-y-6">
        {Object.entries(groupedVersions).map(([contractName, contractVersions]) => (
          <Card key={contractName}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {contractName}
              </CardTitle>
              <CardDescription>
                {contractVersions.length}{" "}
                {contractVersions.length === 1 ? "versão" : "versões"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-auto max-h-[400px]">
                <div className="space-y-3">
                  {contractVersions.map((version, index) => (
                    <div
                      key={version.id}
                      className={`p-4 border rounded-lg transition-colors hover:bg-muted/50 ${
                        version.status === "active" ? "border-success/30 bg-success/5" : ""
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                version.status === "active" ? "bg-success/10" : "bg-muted"
                              }`}
                            >
                              <span className="text-sm font-bold">v{version.version}</span>
                            </div>
                            {index < contractVersions.length - 1 && <div className="w-0.5 h-8 bg-border mt-2" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">Versão {version.version}</span>
                              <Badge variant="outline" className={getStatusColor(version.status)}>
                                {getStatusLabel(version.status)}
                              </Badge>
                              {version.previousVersion && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <ArrowRight className="h-3 w-3" />
                                  de v{version.previousVersion}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{version.notes}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={version.createdBy.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-[8px]">
                                    {version.createdBy.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                {version.createdBy.name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {version.createdAt}
                              </span>
                              {version.changes > 0 && (
                                <span className="flex items-center gap-1">
                                  <GitBranch className="h-3 w-3" />
                                  {version.changes} alterações
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-13 lg:ml-0">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
