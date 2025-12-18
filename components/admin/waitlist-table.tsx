"use client"

import { useState, useEffect, useTransition } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Mail, CheckCircle2 } from "lucide-react"
import type { WaitlistLead } from "@/lib/admin/waitlist"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { updateWaitlistStatus } from "@/app/actions/waitlist"
import { toast } from "sonner"

interface WaitlistTableProps {
  leads: WaitlistLead[]
}

export function WaitlistTable({ leads }: WaitlistTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [localLeads, setLocalLeads] = useState(leads)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setLocalLeads(leads)
  }, [leads])

  const filteredLeads = localLeads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleStatusUpdate = (id: string, status: WaitlistLead["status"]) => {
    // Optimistic update
    setLocalLeads(localLeads.map((lead) => (lead.id === id ? { ...lead, status } : lead)))

    startTransition(async () => {
      try {
        await updateWaitlistStatus(id, status)
        toast.success("Status atualizado com sucesso")
      } catch (error) {
        toast.error("Erro ao atualizar status")
        // Revert (simplified: strictly we should restore previous state, but next revalidation might fix it)
      }
    })
  }

  const getStatusBadge = (status: WaitlistLead["status"]) => {
    const variants = {
      pending: { variant: "secondary" as const, label: "Pendente" },
      contacted: { variant: "default" as const, label: "Contatado" },
      converted: { variant: "default" as const, label: "Convertido", className: "bg-emerald-500 hover:bg-emerald-600" },
    }
    const config = variants[status] || variants.pending
    return (
      <Badge variant={config.variant} className={config?.className}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fonte</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Nenhum lead encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">#{lead.position}</TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                  <TableCell>{lead.company || "-"}</TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {lead.source}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(lead.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(`mailto:${lead.email}`)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Enviar email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(lead.id, "contacted")}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Marcar como contatado
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(lead.id, "converted")}>
                          <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                          Marcar como convertido
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
    </div>
  )
}
