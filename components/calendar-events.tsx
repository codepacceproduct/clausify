"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Bell,
  AlertTriangle,
  Clock,
  FileText,
  Trash2,
  Edit2,
  Building,
} from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: "vencimento" | "renovacao" | "obrigacao" | "reuniao"
  contractName: string
  client: string
  priority: "high" | "medium" | "low"
  reminder: string
  status: "pending" | "completed"
}

const allEvents: Event[] = [
  {
    id: "1",
    title: "Vencimento do Contrato",
    description: "Contrato de prestação de serviços expira em 30 dias",
    date: "2025-01-25",
    time: "09:00",
    type: "vencimento",
    contractName: "Contrato de Serviços Alpha Tech",
    client: "Alpha Tech Solutions",
    priority: "high",
    reminder: "7 dias antes",
    status: "pending",
  },
  {
    id: "2",
    title: "Renovação Automática",
    description: "NDA será renovado automaticamente se não houver manifestação",
    date: "2025-01-28",
    time: "00:00",
    type: "renovacao",
    contractName: "NDA Beta Corporation",
    client: "Beta Corporation",
    priority: "medium",
    reminder: "15 dias antes",
    status: "pending",
  },
  {
    id: "3",
    title: "Pagamento Mensal",
    description: "Vencimento do aluguel mensal da sede",
    date: "2025-01-30",
    time: "23:59",
    type: "obrigacao",
    contractName: "Locação Sede SP",
    client: "Imobiliária Central",
    priority: "high",
    reminder: "5 dias antes",
    status: "pending",
  },
  {
    id: "4",
    title: "Reunião de Revisão",
    description: "Revisão trimestral do contrato de fornecimento",
    date: "2025-01-22",
    time: "14:00",
    type: "reuniao",
    contractName: "Contrato TechSupply",
    client: "TechSupply Ltda",
    priority: "low",
    reminder: "1 dia antes",
    status: "completed",
  },
  {
    id: "5",
    title: "Entrega de Relatório",
    description: "Prazo para entrega do relatório trimestral",
    date: "2025-01-24",
    time: "18:00",
    type: "obrigacao",
    contractName: "Contrato Consultoria",
    client: "Consultoria XYZ",
    priority: "medium",
    reminder: "3 dias antes",
    status: "pending",
  },
]

export function CalendarEvents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createDate, setCreateDate] = useState<Date | undefined>(undefined)

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.contractName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || event.type === typeFilter
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "vencimento":
        return <AlertTriangle className="h-4 w-4" />
      case "renovacao":
        return <Clock className="h-4 w-4" />
      case "obrigacao":
        return <FileText className="h-4 w-4" />
      case "reuniao":
        return <Calendar className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "vencimento":
        return "bg-destructive/10 text-destructive"
      case "renovacao":
        return "bg-amber-500/10 text-amber-600"
      case "obrigacao":
        return "bg-primary/10 text-primary"
      case "reuniao":
        return "bg-blue-500/10 text-blue-600"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "vencimento":
        return "Vencimento"
      case "renovacao":
        return "Renovação"
      case "obrigacao":
        return "Obrigação"
      case "reuniao":
        return "Reunião"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="vencimento">Vencimentos</SelectItem>
                <SelectItem value="renovacao">Renovações</SelectItem>
                <SelectItem value="obrigacao">Obrigações</SelectItem>
                <SelectItem value="reuniao">Reuniões</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Evento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Evento</DialogTitle>
                  <DialogDescription>Adicione um novo evento ao calendário de contratos</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Título</label>
                    <Input placeholder="Ex: Vencimento do Contrato" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição</label>
                    <Textarea placeholder="Descreva o evento..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data</label>
                      <DatePicker value={createDate} onChange={setCreateDate} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Hora</label>
                      <Input type="time" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tipo</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vencimento">Vencimento</SelectItem>
                          <SelectItem value="renovacao">Renovação</SelectItem>
                          <SelectItem value="obrigacao">Obrigação</SelectItem>
                          <SelectItem value="reuniao">Reunião</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Prioridade</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="low">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contrato Relacionado</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o contrato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Contrato Alpha Tech</SelectItem>
                        <SelectItem value="2">NDA Beta Corporation</SelectItem>
                        <SelectItem value="3">Locação Sede SP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lembrete</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Quando lembrar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1d">1 dia antes</SelectItem>
                        <SelectItem value="3d">3 dias antes</SelectItem>
                        <SelectItem value="7d">7 dias antes</SelectItem>
                        <SelectItem value="15d">15 dias antes</SelectItem>
                        <SelectItem value="30d">30 dias antes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsCreateOpen(false)}>Criar Evento</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Eventos</CardTitle>
          <CardDescription>Lista completa de eventos e prazos contratuais</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 border rounded-lg transition-colors hover:bg-muted/50 ${
                    event.status === "completed" ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(event.type)}`}>{getTypeIcon(event.type)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{event.title}</h3>
                          {event.status === "completed" && (
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              Concluído
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {event.contractName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {event.client}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bell className="h-3 w-3" />
                            {event.reminder}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(event.date + "T12:00:00").toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="outline" className={getTypeColor(event.type)}>
                          {getTypeLabel(event.type)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            event.priority === "high"
                              ? "border-destructive text-destructive"
                              : event.priority === "medium"
                                ? "border-amber-500 text-amber-600"
                                : ""
                          }
                        >
                          {event.priority === "high" ? "Alta" : event.priority === "medium" ? "Média" : "Baixa"}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
