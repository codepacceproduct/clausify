"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, MoreHorizontal, AlertTriangle, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

export function PortfolioTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contratos da Carteira</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Vigência</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risco</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-mono text-xs">{contract.id}</TableCell>
                <TableCell className="font-medium">{contract.client}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{contract.type}</Badge>
                </TableCell>
                <TableCell className="font-medium">{contract.value}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{contract.endDate}</div>
                    {contract.nearExpiry && (
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Calendar className="h-3 w-3" />
                        <span>{contract.daysToExpire} dias</span>
                      </div>
                    )}
                    {contract.status === "expired" && (
                      <div className="flex items-center gap-1 text-xs text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Vencido</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      contract.status === "active"
                        ? "default"
                        : contract.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                    className={
                      contract.status === "active"
                        ? "bg-success/10 text-success hover:bg-success/20"
                        : contract.status === "pending"
                          ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                          : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    }
                  >
                    {contract.status === "active" ? "Ativo" : contract.status === "pending" ? "Pendente" : "Vencido"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      contract.risk === "low"
                        ? "bg-success/10 text-success hover:bg-success/20"
                        : contract.risk === "medium"
                          ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                          : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    }
                  >
                    {contract.risk === "low" ? "Baixo" : contract.risk === "medium" ? "Médio" : "Alto"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
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
                      <DropdownMenuItem>Analisar Novamente</DropdownMenuItem>
                      <DropdownMenuItem>Comparar Versões</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Cancelar Contrato</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, contracts.length)}{" "}
            de {contracts.length} contratos
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(Math.ceil(contracts.length / itemsPerPage), currentPage + 1))}
              disabled={currentPage >= Math.ceil(contracts.length / itemsPerPage)}
            >
              Próxima
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
