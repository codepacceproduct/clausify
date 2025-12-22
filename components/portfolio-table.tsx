"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, MoreHorizontal, AlertTriangle, Calendar, GitBranch, CheckSquare, FileSearch } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const contracts = [
  {
    id: "CT-2025-001",
    client: "Empresa Alpha Tech Ltda",
    type: "Prestação de Serviços",
    value: "R$ 250.000",
    startDate: "15/01/2025",
    endDate: "15/01/2026",
    status: "active" as const,
    risk: "low" as const,
    daysToExpire: 348,
  },
  {
    id: "CT-2025-002",
    client: "Construtora Beta S/A",
    type: "Contrato de Obra",
    value: "R$ 1.800.000",
    startDate: "10/01/2025",
    endDate: "10/07/2025",
    status: "active" as const,
    risk: "medium" as const,
    daysToExpire: 163,
  },
  {
    id: "CT-2024-458",
    client: "Imobiliária Gamma",
    type: "Locação Comercial",
    value: "R$ 45.000",
    startDate: "20/12/2024",
    endDate: "20/02/2025",
    status: "active" as const,
    risk: "low" as const,
    daysToExpire: 23,
    nearExpiry: true,
  },
  {
    id: "CT-2024-412",
    client: "Indústria Delta Manufatura",
    type: "Fornecimento",
    value: "R$ 3.200.000",
    startDate: "05/11/2024",
    endDate: "05/11/2026",
    status: "active" as const,
    risk: "high" as const,
    daysToExpire: 642,
  },
  {
    id: "CT-2024-389",
    client: "Startup Epsilon Ventures",
    type: "Investimento",
    value: "R$ 500.000",
    startDate: "01/10/2024",
    endDate: "01/10/2029",
    status: "pending" as const,
    risk: "medium" as const,
    daysToExpire: 1825,
  },
  {
    id: "CT-2024-301",
    client: "Tech Zeta Corporation",
    type: "Parceria",
    value: "R$ 800.000",
    startDate: "15/08/2024",
    endDate: "15/01/2025",
    status: "expired" as const,
    risk: "low" as const,
    daysToExpire: -13,
  },
  {
    id: "CT-2024-256",
    client: "Consultoria Eta Business",
    type: "Prestação de Serviços",
    value: "R$ 120.000",
    startDate: "01/07/2024",
    endDate: "01/01/2025",
    status: "expired" as const,
    risk: "low" as const,
    daysToExpire: -27,
  },
  {
    id: "CT-2024-198",
    client: "Transportadora Theta Logística",
    type: "Fornecimento",
    value: "R$ 950.000",
    startDate: "10/05/2024",
    endDate: "10/05/2025",
    status: "active" as const,
    risk: "medium" as const,
    daysToExpire: 112,
  },
]

type Contract = (typeof contracts)[number]

export function PortfolioTable() {
  const router = useRouter()
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const openDetails = (contract: Contract) => {
    setSelectedContract(contract)
    setIsDetailsOpen(true)
  }

  const handleViewVersions = (contractId: string) => {
    router.push(`/versionamento?contract=${contractId}`)
  }

  const handleRequestApproval = (contractId: string) => {
    router.push(`/aprovacoes?contract=${contractId}`)
  }

  const handleAnalyze = (contractId: string) => {
    router.push(`/contratos?action=analyze&contract=${contractId}`)
  }

  const handleAddToCalendar = (contractId: string) => {
    router.push(`/calendario?add=${contractId}`)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="gap-2">
        <CardTitle className="text-base sm:text-lg">Contratos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <Table className="min-w-[720px] text-sm">
            <TableHeader className="bg-muted/40">
              <TableRow className="text-xs sm:text-sm text-muted-foreground">
                <TableHead className="whitespace-nowrap">Cliente</TableHead>
                <TableHead className="hidden md:table-cell whitespace-nowrap">Tipo</TableHead>
                <TableHead className="hidden lg:table-cell whitespace-nowrap">Valor</TableHead>
                <TableHead className="hidden md:table-cell whitespace-nowrap">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Vigência
                  </span>
                </TableHead>
                <TableHead className="hidden lg:table-cell whitespace-nowrap">Risco</TableHead>
                <TableHead className="text-right whitespace-nowrap">Status</TableHead>
                <TableHead className="hidden md:table-cell text-right pr-4 whitespace-nowrap">Ações</TableHead>
                <TableHead className="md:hidden text-right pr-4">Detalhes</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id} className="text-xs sm:text-sm">
                  <TableCell className="font-medium whitespace-nowrap">{contract.client}</TableCell>
                  <TableCell className="hidden md:table-cell whitespace-nowrap">{contract.type}</TableCell>
                  <TableCell className="hidden lg:table-cell whitespace-nowrap">{contract.value}</TableCell>
                  <TableCell className="hidden md:table-cell whitespace-nowrap">
                    {contract.startDate} - {contract.endDate}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge
                      variant={
                        contract.risk === "high" ? "destructive" : contract.risk === "medium" ? "default" : "secondary"
                      }
                    >
                      {contract.risk === "high" ? "Alto" : contract.risk === "medium" ? "Médio" : "Baixo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        contract.status === "active"
                          ? "secondary"
                          : contract.status === "pending"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {contract.status === "active" ? "Ativo" : contract.status === "pending" ? "Pendente" : "Encerrado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAnalyze(contract.id)}>
                          <FileSearch className="h-4 w-4 mr-2" />
                          Reanalisar com IA
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewVersions(contract.id)}>
                          <GitBranch className="h-4 w-4 mr-2" />
                          Ver Versões
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRequestApproval(contract.id)}>
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Solicitar Aprovação
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddToCalendar(contract.id)}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Adicionar ao Calendário
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Cancelar Contrato</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="md:hidden text-right pr-4">
                    <Button size="sm" variant="secondary" onClick={() => openDetails(contract)}>
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedContract?.client}</DialogTitle>
            <DialogDescription>{selectedContract?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Tipo:</strong> {selectedContract?.type}
            </p>
            <p>
              <strong>Valor:</strong> {selectedContract?.value}
            </p>
            <p>
              <strong>Vigência:</strong> {selectedContract?.startDate} — {selectedContract?.endDate}
            </p>
            <p>
              <strong>Status:</strong> {selectedContract?.status}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
