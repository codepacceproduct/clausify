"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  FileText, 
  AlertTriangle, 
  UsersIcon, 
  Scale, 
  Calendar as CalendarIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getEvents, deleteEvent, type Event } from "@/app/actions/calendar"
import { CalendarQuickAdd } from "@/components/calendar-quick-add"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const toLocalDateString = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

const eventTypes = {
  audiencia: { color: "bg-red-500", text: "text-red-500", border: "border-red-200", bgLight: "bg-red-50", icon: Scale, label: "Audiência" },
  prazo: { color: "bg-amber-500", text: "text-amber-500", border: "border-amber-200", bgLight: "bg-amber-50", icon: Clock, label: "Prazo" },
  vencimento: { color: "bg-orange-500", text: "text-orange-500", border: "border-orange-200", bgLight: "bg-orange-50", icon: AlertTriangle, label: "Vencimento" },
  reuniao: { color: "bg-blue-500", text: "text-blue-500", border: "border-blue-200", bgLight: "bg-blue-50", icon: UsersIcon, label: "Reunião" },
  diligencia: { color: "bg-purple-500", text: "text-purple-500", border: "border-purple-200", bgLight: "bg-purple-50", icon: MapPin, label: "Diligência" },
  protocolo: { color: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-200", bgLight: "bg-emerald-50", icon: FileText, label: "Protocolo" },
}

interface CalendarioContentProps {
  initialEvents: Event[]
}

export function CalendarioContent({ initialEvents }: CalendarioContentProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    const d = new Date()
    return toLocalDateString(d)
  })
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("month")
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [loading, setLoading] = useState(false)
  
  // Ref to track if it's the first render to avoid double fetching
  const isFirstRender = useRef(true)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  const fetchEvents = useCallback(async () => {
    // Skip fetch on first render since we have initialEvents
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    setLoading(true)
    try {
      const startDate = new Date(year, month, 1)
      const endDate = new Date(year, month + 1, 0)
      
      const start = toLocalDateString(startDate)
      const end = toLocalDateString(endDate)
      
      const data = await getEvents(start, end)
      setEvents(data)
    } catch (error) {
      console.error("Failed to fetch events", error)
    } finally {
      setLoading(false)
    }
  }, [year, month])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToToday = () => {
    const today = new Date()
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(toLocalDateString(today))
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((e) => e.date === dateStr)
  }

  const selectedDateEvents = selectedDate ? events.filter(e => e.date === selectedDate) : []

  const handleDeleteEvent = async (id: string) => {
    try {
      setLoading(true)
      await deleteEvent(id)
      
      // Manually update local state to reflect deletion immediately
      setEvents(prev => prev.filter(e => e.id !== id))
      
      // Optionally refetch to ensure sync
      // await fetchEvents() 
    } catch (error) {
      console.error("Failed to delete event", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEventCreated = (newEvent: Event) => {
    setEvents(prev => [...prev, newEvent])
  }

  return (
    <LayoutWrapper>
      <div className="flex flex-col space-y-6 h-[calc(100vh-100px)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground flex items-center gap-2">
              <CalendarIcon className="h-8 w-8 text-primary" />
              Agenda Jurídica
            </h1>
            <p className="text-muted-foreground mt-1">Gerencie prazos, audiências e reuniões com eficiência.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={goToToday}>Hoje</Button>
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button 
                variant={viewMode === "month" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("month")}
                className="h-8 px-3"
              >
                Mês
              </Button>
              <Button 
                variant={viewMode === "week" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("week")}
                className="h-8 px-3"
              >
                Semana
              </Button>
              <Button 
                variant={viewMode === "list" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("list")}
                className="h-8 px-3"
              >
                Lista
              </Button>
            </div>
            <CalendarQuickAdd onEventCreated={handleEventCreated} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
          {/* Main Calendar Area */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-0 space-y-4">
            <Card className="flex-1 flex flex-col border-none shadow-md overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between bg-card">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold capitalize">
                    {monthNames[month]} <span className="text-muted-foreground font-normal">{year}</span>
                  </h2>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   {loading && <span className="text-xs text-muted-foreground animate-pulse">Atualizando...</span>}
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto">
                {viewMode === "month" && (
                  <>
                    <div className="grid grid-cols-7 mb-4">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                        <div key={`empty-${index}`} className="h-24 sm:h-32 p-2" />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1
                        const dayEvents = getEventsForDate(day)
                        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                        const isSelected = selectedDate === dateStr
                        const isToday = toLocalDateString(new Date()) === dateStr

                        return (
                          <div
                            key={day}
                            onClick={() => setSelectedDate(dateStr)}
                            className={cn(
                              "h-24 sm:h-32 p-2 border rounded-lg cursor-pointer transition-colors hover:border-primary/50 flex flex-col gap-1 overflow-hidden relative",
                              isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card",
                              isToday && !isSelected && "border-blue-300 bg-blue-50/50 dark:bg-blue-950/20"
                            )}
                          >
                            <span className={cn(
                              "text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full mb-1",
                              isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                            )}>
                              {day}
                            </span>
                            <div className="flex flex-col gap-1 overflow-hidden">
                              {dayEvents.slice(0, 3).map((event) => {
                                const type = eventTypes[event.type as keyof typeof eventTypes] || eventTypes.prazo
                                return (
                                  <div
                                    key={event.id}
                                    className={cn(
                                      "text-[10px] truncate px-1.5 py-0.5 rounded-sm font-medium flex items-center gap-1",
                                      type.bgLight,
                                      type.text
                                    )}
                                  >
                                    <div className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", type.color)} />
                                    <span className="truncate">{event.title}</span>
                                  </div>
                                )
                              })}
                              {dayEvents.length > 3 && (
                                <span className="text-[10px] text-muted-foreground pl-1">
                                  +{dayEvents.length - 3} mais
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
                
                {/* Placeholder for other views */}
                {viewMode !== "month" && (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Modo de visualização em desenvolvimento
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar / Details */}
          <div className="lg:col-span-4 flex flex-col h-full min-h-0 space-y-4">
            <Card className="flex-1 flex flex-col border-none shadow-md overflow-hidden">
              <div className="p-4 border-b bg-card">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {selectedDate ? (
                    <>
                      {new Date(selectedDate).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </>
                  ) : "Selecione uma data"}
                </h3>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {selectedDateEvents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>Nenhum evento para este dia.</p>
                      <Button variant="link" className="mt-2 text-primary" onClick={() => document.getElementById('quick-add-trigger')?.click()}>
                        Adicionar novo evento
                      </Button>
                    </div>
                  ) : (
                    selectedDateEvents.map((event) => {
                      const type = eventTypes[event.type as keyof typeof eventTypes] || eventTypes.prazo
                      const Icon = type.icon

                      return (
                        <div
                          key={event.id}
                          className="group flex items-start gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-all"
                        >
                          <div className={cn("p-2 rounded-lg mt-0.5", type.bgLight, type.text)}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-sm truncate">{event.title}</h4>
                              {event.time && (
                                <span className="text-xs text-muted-foreground whitespace-nowrap bg-muted px-1.5 py-0.5 rounded">
                                  {event.time}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              {event.description || "Sem descrição"}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className={cn("text-[10px] px-1.5 h-5 font-normal", type.border, type.text)}>
                                {type.label}
                              </Badge>
                              {event.priority === "high" && (
                                <Badge variant="destructive" className="text-[10px] px-1.5 h-5 font-normal">
                                  Alta Prioridade
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mr-1"
                            onClick={() => handleDeleteEvent(event.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
