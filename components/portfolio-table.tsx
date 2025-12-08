"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Calendar, GitBranch, CheckSquare, FileSearch } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAuthToken } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 3).map((p) => p[0]).join("")
  return letters.toUpperCase()
}

export function PortfolioTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  const itemsPerPage = 8
  const [orgInitials, setOrgInitials] = useState("ORG")
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    const loadOrg = async () => {
      const token = getAuthToken()
      try {
        const r = await fetch(`/api/organizations/current`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
        const j = await r.json().catch(() => ({}))
        const name = j?.organization?.name || "Org"
        setOrgInitials(initials(String(name)))
      } catch {}
    }
    const loadData = async () => {
      const { data } = await supabase
        .from("approvals")
        .select("id, contract_name, client, value, type, deadline, priority, status, submitted_at")
        .limit(1000)
      setRows(data || [])
    }
    loadOrg()
    loadData()
  }, [])

  const list = useMemo(() => {
    const now = new Date()
    return rows.map((r) => {
      const d = r.deadline ? new Date(r.deadline) : null
      const diff = d ? Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
      const nearExpiry = diff !== null && diff > 0 && diff <= 30
      const expired = diff !== null && diff < 0
      const status = expired ? "expired" : String(r.status || "pending")
      const risk = String(r.priority || "medium")
      return {
        id: String(r.id || "").slice(0, 8).toUpperCase(),
        client: r.client || r.contract_name || "",
        type: r.type || "",
        value: r.value || "",
        endDate: d ? d.toLocaleDateString("pt-BR") : "-",
        status,
        risk,
        daysToExpire: diff ?? undefined,
        nearExpiry,
      }
    })
  }, [rows])

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
            {list.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-mono text-xs">{orgInitials}-{contract.id}</TableCell>
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
                  <div className="flex flex-wrap gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleAnalyze(contract.id)}>
                      <FileSearch className="h-4 w-4 mr-2" />
                      Reanalisar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleViewVersions(contract.id)}>
                      <GitBranch className="h-4 w-4 mr-2" />
                      Versões
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleRequestApproval(contract.id)}>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Aprovação
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleAddToCalendar(contract.id)}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Calendário
                    </Button>
                    <Button variant="destructive" size="sm">
                      Cancelar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, list.length)}{" "}
            de {list.length} contratos
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
              onClick={() => setCurrentPage(Math.min(Math.ceil(list.length / itemsPerPage), currentPage + 1))}
              disabled={currentPage >= Math.ceil(list.length / itemsPerPage)}
            >
              Próxima
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
