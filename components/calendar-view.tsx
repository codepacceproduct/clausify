"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon, AlertTriangle, Clock, FileText, Bell } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: "vencimento" | "renovacao" | "obrigacao" | "reuniao"
  contractName: string
  priority: "high" | "medium" | "low"
}

const events: CalendarEvent[] = [
  {
    id: "1",
    title: "Vencimento - Alpha Tech",
    date: "2025-01-25",
    type: "vencimento",
    contractName: "Contrato de Serviços Alpha Tech",
    priority: "high",
  },
  {
    id: "2",
    title: "Renovação - Beta Corp",
    date: "2025-01-28",
    type: "renovacao",
    contractName: "NDA Beta Corporation",
    priority: "medium",
  },
  {
    id: "3",
    title: "Pagamento Mensal",
    date: "2025-01-30",
    type: "obrigacao",
    contractName: "Locação Sede SP",
    priority: "high",
  },
  {
    id: "4",
    title: "Revisão Contratual",
    date: "2025-01-22",
    type: "reuniao",
    contractName: "Contrato TechSupply",
    priority: "low",
  },
  {
    id: "5",
    title: "Entrega Relatório",
    date: "2025-01-24",
    type: "obrigacao",
    contractName: "Contrato Consultoria",
    priority: "medium",
  },
  {
    id: "6",
    title: "Vencimento Garantia",
    date: "2025-02-05",
    type: "vencimento",
    contractName: "Contrato Fornecimento",
    priority: "high",
  },
  {
    id: "7",
    title: "Reajuste Anual",
    date: "2025-02-10",
    type: "renovacao",
    contractName: "Locação Filial RJ",
    priority: "medium",
  },
]

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((e) => e.date === dateStr)
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "vencimento":
        return "bg-destructive"
      case "renovacao":
        return "bg-amber-500"
      case "obrigacao":
        return "bg-primary"
      case "reuniao":
        return "bg-blue-500"
      default:
        return "bg-muted"
    }
  }

  const selectedEvents = selectedDate ? events.filter((e) => e.date === selectedDate) : []

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {monthNames[month]} {year}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first day of month */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square p-1" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const dayEvents = getEventsForDate(day)
              const isSelected = selectedDate === dateStr
              const isToday = new Date().toISOString().split("T")[0] === dateStr

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square p-1 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : isToday
                        ? "bg-primary/10 hover:bg-primary/20"
                        : "hover:bg-muted"
                  }`}
                >
                  <div className="h-full flex flex-col">
                    <span className={`text-sm ${isSelected ? "font-bold" : ""}`}>{day}</span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-auto flex-wrap">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div key={event.id} className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(event.type)}`} />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-xs text-muted-foreground">Vencimento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs text-muted-foreground">Renovação</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Obrigação</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-muted-foreground">Reunião</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Selected Date Events */}
        {selectedDate && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Eventos em {new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${getEventTypeColor(event.type)}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.contractName}</p>
                        </div>
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
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento nesta data</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div
                    className={`p-1.5 rounded ${
                      event.type === "vencimento"
                        ? "bg-destructive/10"
                        : event.type === "renovacao"
                          ? "bg-amber-500/10"
                          : event.type === "obrigacao"
                            ? "bg-primary/10"
                            : "bg-blue-500/10"
                    }`}
                  >
                    {event.type === "vencimento" ? (
                      <AlertTriangle className={`h-4 w-4 text-destructive`} />
                    ) : event.type === "renovacao" ? (
                      <Clock className="h-4 w-4 text-amber-600" />
                    ) : (
                      <FileText className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date + "T12:00:00").toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
