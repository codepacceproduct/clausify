"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GitBranch, FileText, Clock, CheckCircle, Edit3, Upload, MessageSquare, Eye } from "lucide-react"

interface TimelineEvent {
  id: string
  type: "created" | "edited" | "approved" | "commented" | "uploaded"
  version: string
  user: {
    name: string
    avatar: string
    role: string
  }
  date: string
  description: string
  details?: string
}

const timelineData: TimelineEvent[] = [
  {
    id: "1",
    type: "approved",
    version: "3.0",
    user: { name: "Roberto Silva", avatar: "", role: "Diretor" },
    date: "20/01/2025 às 14:30",
    description: "Versão 3.0 aprovada e ativada",
    details: "Aprovação final após revisão completa",
  },
  {
    id: "2",
    type: "commented",
    version: "3.0",
    user: { name: "Patricia Lima", avatar: "", role: "Gestora" },
    date: "20/01/2025 às 11:15",
    description: "Comentário adicionado",
    details: "Valores e prazos estão de acordo com o orçamento aprovado",
  },
  {
    id: "3",
    type: "edited",
    version: "3.0",
    user: { name: "Maria Silva", avatar: "", role: "Analista" },
    date: "19/01/2025 às 16:45",
    description: "Cláusulas 3, 5 e 8 modificadas",
    details: "Ajustes de prazo (12→24 meses) e valor (R$250k→R$350k)",
  },
  {
    id: "4",
    type: "created",
    version: "3.0",
    user: { name: "Maria Silva", avatar: "", role: "Analista" },
    date: "19/01/2025 às 14:00",
    description: "Versão 3.0 criada",
    details: "Nova versão baseada na v2.1",
  },
  {
    id: "5",
    type: "approved",
    version: "2.1",
    user: { name: "Patricia Lima", avatar: "", role: "Gestora" },
    date: "15/01/2025 às 10:15",
    description: "Versão 2.1 aprovada",
    details: "Correções de confidencialidade aprovadas",
  },
  {
    id: "6",
    type: "edited",
    version: "2.1",
    user: { name: "Carlos Mendes", avatar: "", role: "Analista Sr." },
    date: "14/01/2025 às 15:30",
    description: "Cláusula 10 modificada",
    details: "Período de confidencialidade ajustado",
  },
  {
    id: "7",
    type: "uploaded",
    version: "2.0",
    user: { name: "Maria Silva", avatar: "", role: "Analista" },
    date: "10/01/2025 às 16:45",
    description: "Documento anexado",
    details: "Anexo A - Especificações Técnicas",
  },
  {
    id: "8",
    type: "created",
    version: "1.0",
    user: { name: "Maria Silva", avatar: "", role: "Analista" },
    date: "01/01/2025 às 09:00",
    description: "Contrato criado",
    details: "Versão inicial do contrato",
  },
]

const contracts = [
  { id: "1", name: "Contrato Alpha Tech" },
  { id: "2", name: "NDA Beta Corporation" },
  { id: "3", name: "Contrato de Locação - Sede SP" },
]

export function VersionTimeline() {
  const [selectedContract, setSelectedContract] = useState("1")

  const getEventIcon = (type: string) => {
    switch (type) {
      case "created":
        return <FileText className="h-4 w-4" />
      case "edited":
        return <Edit3 className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "commented":
        return <MessageSquare className="h-4 w-4" />
      case "uploaded":
        return <Upload className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "created":
        return "bg-primary/10 text-primary border-primary/20"
      case "edited":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      case "approved":
        return "bg-success/10 text-success border-success/20"
      case "commented":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "uploaded":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getEventLabel = (type: string) => {
    switch (type) {
      case "created":
        return "Criação"
      case "edited":
        return "Edição"
      case "approved":
        return "Aprovação"
      case "commented":
        return "Comentário"
      case "uploaded":
        return "Upload"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Contract Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">Selecione um Contrato</h3>
              <p className="text-sm text-muted-foreground">Visualize a linha do tempo completa de alterações</p>
            </div>
            <Select value={selectedContract} onValueChange={setSelectedContract}>
              <SelectTrigger className="w-full sm:w-72">
                <SelectValue placeholder="Selecione o contrato" />
              </SelectTrigger>
              <SelectContent>
                {contracts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Linha do Tempo - {contracts.find((c) => c.id === selectedContract)?.name}
          </CardTitle>
          <CardDescription>Histórico completo de todas as alterações e eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

              {/* Events */}
              <div className="space-y-6">
                {timelineData.map((event, index) => (
                  <div key={event.id} className="relative flex gap-4">
                    {/* Icon */}
                    <div
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-background ${getEventColor(event.type)}`}
                    >
                      {getEventIcon(event.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getEventColor(event.type)}>
                            {getEventLabel(event.type)}
                          </Badge>
                          <Badge variant="secondary">v{event.version}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.date}
                        </span>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg border">
                        <p className="font-medium">{event.description}</p>
                        {event.details && <p className="text-sm text-muted-foreground mt-1">{event.details}</p>}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={event.user.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-[10px]">
                              {event.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-medium">{event.user.name}</span>
                            <span className="text-muted-foreground">• {event.user.role}</span>
                          </div>
                        </div>
                      </div>

                      {/* View Version Button */}
                      {(event.type === "created" || event.type === "approved") && (
                        <Button variant="ghost" size="sm" className="mt-2">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver versão {event.version}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
