"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Filter, Download, CheckCircle, XCircle, FileText, User, Building } from "lucide-react"

interface HistoryItem {
  id: string
  contractName: string
  client: string
  value: string
  type: string
  status: "approved" | "rejected" | "pending"
  submittedBy: string
  submittedAt: string
  completedAt: string
  totalTime: string
  approvals: Array<{
    level: number
    role: string
    approver: string
    status: "approved" | "rejected"
    date: string
    comment?: string
  }>
}

const historyData: HistoryItem[] = [
  {
    id: "1",
    contractName: "Contrato de Prestação de Serviços - TechCorp",
    client: "TechCorp Solutions",
    value: "R$ 320.000,00",
    type: "Prestação de Serviços",
    status: "approved",
    submittedBy: "Maria Silva",
    submittedAt: "10/01/2025",
    completedAt: "15/01/2025",
    totalTime: "5 dias",
    approvals: [
      {
        level: 1,
        role: "Analista",
        approver: "Carlos Mendes",
        status: "approved",
        date: "11/01/2025",
        comment: "Cláusulas adequadas",
      },
      {
        level: 2,
        role: "Gestor",
        approver: "Patricia Lima",
        status: "approved",
        date: "13/01/2025",
        comment: "Valores dentro do orçamento",
      },
      { level: 3, role: "Diretor", approver: "Roberto Silva", status: "approved", date: "15/01/2025" },
    ],
  },
  {
    id: "2",
    contractName: "NDA - Parceria Estratégica",
    client: "Global Partners Inc",
    value: "N/A",
    type: "NDA",
    status: "approved",
    submittedBy: "João Santos",
    submittedAt: "12/01/2025",
    completedAt: "14/01/2025",
    totalTime: "2 dias",
    approvals: [
      { level: 1, role: "Analista", approver: "Ana Costa", status: "approved", date: "13/01/2025" },
      { level: 2, role: "Gestor", approver: "Patricia Lima", status: "approved", date: "14/01/2025" },
    ],
  },
  {
    id: "3",
    contractName: "Contrato de Locação - Filial RJ",
    client: "Imobiliária Premium",
    value: "R$ 45.000,00/mês",
    type: "Locação",
    status: "rejected",
    submittedBy: "Pedro Alves",
    submittedAt: "08/01/2025",
    completedAt: "12/01/2025",
    totalTime: "4 dias",
    approvals: [
      {
        level: 1,
        role: "Analista",
        approver: "Carlos Mendes",
        status: "approved",
        date: "09/01/2025",
        comment: "Valor acima do mercado, mas localização justifica",
      },
      {
        level: 2,
        role: "Gestor",
        approver: "Patricia Lima",
        status: "rejected",
        date: "12/01/2025",
        comment: "Orçamento não permite este valor mensal. Renegociar.",
      },
    ],
  },
  {
    id: "4",
    contractName: "Contrato de Fornecimento - Equipamentos TI",
    client: "TechSupply Ltda",
    value: "R$ 180.000,00",
    type: "Fornecimento",
    status: "approved",
    submittedBy: "Maria Silva",
    submittedAt: "05/01/2025",
    completedAt: "10/01/2025",
    totalTime: "5 dias",
    approvals: [
      { level: 1, role: "Analista", approver: "Ana Costa", status: "approved", date: "06/01/2025" },
      { level: 2, role: "Gestor", approver: "Patricia Lima", status: "approved", date: "08/01/2025" },
      { level: 3, role: "Diretor", approver: "Roberto Silva", status: "approved", date: "10/01/2025" },
    ],
  },
]

export function ApprovalHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)

  const filteredHistory = historyData.filter((item) => {
    const matchesSearch =
      item.contractName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por contrato ou cliente..."
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
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="rejected">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Aprovações</CardTitle>
          <CardDescription>Registro completo de todas as decisões de aprovação</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedItem?.id === item.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">{item.contractName}</h3>
                        <Badge
                          variant={item.status === "approved" ? "default" : "destructive"}
                          className={
                            item.status === "approved"
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                          }
                        >
                          {item.status === "approved" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" /> Aprovado
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" /> Rejeitado
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building className="h-3.5 w-3.5" />
                          {item.client}
                        </span>
                        <span>{item.value}</span>
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {item.submittedBy}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="text-muted-foreground">Enviado em</p>
                        <p className="font-medium">{item.submittedAt}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Concluído em</p>
                        <p className="font-medium">{item.completedAt}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Tempo Total</p>
                        <p className="font-medium">{item.totalTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Approval Timeline (shown when selected) */}
                  {selectedItem?.id === item.id && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-3">Linha do Tempo de Aprovação</h4>
                      <div className="space-y-3">
                        {item.approvals.map((approval, index) => (
                          <div key={index} className="flex gap-3">
                            <div
                              className={`p-1.5 rounded-full h-fit ${
                                approval.status === "approved" ? "bg-success/10" : "bg-destructive/10"
                              }`}
                            >
                              {approval.status === "approved" ? (
                                <CheckCircle className="h-4 w-4 text-success" />
                              ) : (
                                <XCircle className="h-4 w-4 text-destructive" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">
                                    Nível {approval.level}: {approval.role}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {approval.approver} • {approval.date}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    approval.status === "approved"
                                      ? "bg-success/10 text-success border-success/20"
                                      : "bg-destructive/10 text-destructive border-destructive/20"
                                  }
                                >
                                  {approval.status === "approved" ? "Aprovado" : "Rejeitado"}
                                </Badge>
                              </div>
                              {approval.comment && (
                                <p className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded">
                                  "{approval.comment}"
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
