"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarQuickAdd } from "@/components/calendar-quick-add"
import { ChevronLeft, ChevronRight, Clock, MapPin, FileText, AlertTriangle, UsersIcon, Scale, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

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

const mockEvents = [
  {
    id: "1",
    title: "Audiência de Conciliação",
    date: "2025-01-22",
    time: "14:00",
    type: "audiencia",
    processo: "1234567-89.2024.8.26.0100",
    vara: "2ª Vara Cível",
    local: "Fórum Central",
    cliente: "João Silva",
    observacoes: "Levar proposta de acordo",
  },
  {
    id: "2",
    title: "Prazo Contestação",
    date: "2025-01-25",
    time: "23:59",
    type: "prazo",
    processo: "9876543-21.2024.8.26.0100",
    observacoes: "Prazo fatal - 15 dias",
  },
  {
    id: "3",
    title: "Vencimento Contrato",
    date: "2025-01-28",
    time: "00:00",
    type: "vencimento",
    cliente: "Empresa XYZ Ltda",
    contrato: "Contrato de Locação",
  },
  {
    id: "4",
    title: "Reunião com Cliente",
    date: "2025-01-23",
    time: "10:00",
    type: "reuniao",
    cliente: "Maria Santos",
    local: "Escritório",
    observacoes: "Discutir estratégia processual",
  },
]

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [searchTerm, setSearchTerm] = useState("")

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return mockEvents.filter((e) => e.date === dateStr)
  }

  const getEventTypeConfig = (type: string) => {
    const configs = {
      audiencia: { color: "bg-red-500", icon: Scale, label: "Audiência" },
      prazo: { color: "bg-amber-500", icon: Clock, label: "Prazo" },
      vencimento: { color: "bg-orange-500", icon: AlertTriangle, label: "Vencimento" },
      reuniao: { color: "bg-blue-500", icon: UsersIcon, label: "Reunião" },
      diligencia: { color: "bg-purple-500", icon: MapPin, label: "Diligência" },
      protocolo: { color: "bg-emerald-500", icon: FileText, label: "Protocolo" },
    }
    return configs[type as keyof typeof configs] || configs.reuniao
  }

  const selectedEvents = selectedDate ? mockEvents.filter((e) => e.date === selectedDate) : []

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Calendário Jurídico</h1>
          <p className="text-muted-foreground mt-1">Gerencie audiências, prazos e compromissos</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Calendar */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 bg-transparent">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-lg font-semibold min-w-[180px] text-center">
                      {monthNames[month]} {year}
                    </h2>
                    <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 bg-transparent">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Hoje
                </Button>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square p-1" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  const dayEvents = getEventsForDate(day)
                  const isSelected = selectedDate === dateStr
                  const isToday = new Date().toISOString().split("T")[0] === dateStr

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(dateStr)}
                      className={cn(
                        "aspect-square p-2 rounded-lg transition-all text-sm relative",
                        isSelected
                          ? "bg-emerald-500 text-white font-medium shadow-sm"
                          : isToday
                            ? "bg-emerald-50 dark:bg-emerald-950 font-medium"
                            : "hover:bg-muted",
                      )}
                    >
                      <span>{day}</span>
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {dayEvents.slice(0, 3).map((event) => {
                            const config = getEventTypeConfig(event.type)
                            return <div key={event.id} className={cn("w-1 h-1 rounded-full", config.color)} />
                          })}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <CalendarQuickAdd />

            {/* Selected Date Events */}
            {selectedDate && (
              <Card className="p-4">
                <h3 className="font-medium text-sm mb-3">
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                  })}
                </h3>
                {selectedEvents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedEvents.map((event) => {
                      const config = getEventTypeConfig(event.type)
                      return (
                        <div key={event.id} className="p-3 bg-muted/50 rounded-lg space-y-1">
                          <div className="flex items-start gap-2">
                            <config.icon className={cn("h-4 w-4 mt-0.5", config.color.replace("bg-", "text-"))} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{event.title}</p>
                              <p className="text-xs text-muted-foreground">{event.time}</p>
                              {event.processo && (
                                <p className="text-xs text-muted-foreground mt-1">Proc: {event.processo}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">Nenhum evento</p>
                )}
              </Card>
            )}

            {/* Today's Events */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="h-4 w-4 text-emerald-500" />
                <h3 className="font-medium text-sm">Hoje</h3>
              </div>
              <div className="space-y-2">
                {mockEvents.slice(0, 3).map((event) => {
                  const config = getEventTypeConfig(event.type)
                  return (
                    <div key={event.id} className="flex items-start gap-2 p-2 hover:bg-muted/50 rounded-lg">
                      <config.icon className={cn("h-4 w-4 mt-0.5", config.color.replace("bg-", "text-"))} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
