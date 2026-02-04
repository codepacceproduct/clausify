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
  Trash2,
  List,
  LayoutGrid,
  AlignLeft,
  CheckCircle2,
  Clock3
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getEvents, deleteEvent, updateEvent, type Event, type EventStatus } from "@/app/actions/calendar"
import { CalendarQuickAdd } from "@/components/calendar-quick-add"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addDays, 
  isSameDay, 
  isSameMonth, 
  parseISO, 
  isToday, 
  isPast, 
  isFuture,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"

const eventTypes = {
  audiencia: { color: "bg-red-500", text: "text-red-500", border: "border-red-200", bgLight: "bg-red-50", icon: Scale, label: "Audiência" },
  prazo: { color: "bg-amber-500", text: "text-amber-500", border: "border-amber-200", bgLight: "bg-amber-50", icon: Clock, label: "Prazo" },
  vencimento: { color: "bg-orange-500", text: "text-orange-500", border: "border-orange-200", bgLight: "bg-orange-50", icon: AlertTriangle, label: "Vencimento" },
  reuniao: { color: "bg-blue-500", text: "text-blue-500", border: "border-blue-200", bgLight: "bg-blue-50", icon: UsersIcon, label: "Reunião" },
  diligencia: { color: "bg-purple-500", text: "text-purple-500", border: "border-purple-200", bgLight: "bg-purple-50", icon: MapPin, label: "Diligência" },
  protocolo: { color: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-200", bgLight: "bg-emerald-50", icon: FileText, label: "Protocolo" },
}

const statusColors = {
  pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
  completed: "text-green-600 bg-green-50 border-green-200",
  cancelled: "text-gray-500 bg-gray-50 border-gray-200",
  overdue: "text-red-600 bg-red-50 border-red-200"
}

interface CalendarioContentProps {
  initialEvents: Event[]
}

export function CalendarioContent({ initialEvents }: CalendarioContentProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("month")
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [loading, setLoading] = useState(false)
  
  // Ref to track if it's the first render to avoid double fetching
  const isFirstRender = useRef(true)

  const fetchEvents = useCallback(async () => {
    // Skip fetch on first render since we have initialEvents
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    setLoading(true)
    try {
      let start, end;

      if (viewMode === 'month' || viewMode === 'list') {
        start = format(startOfMonth(currentDate), 'yyyy-MM-dd')
        end = format(endOfMonth(currentDate), 'yyyy-MM-dd')
      } else {
        start = format(startOfWeek(currentDate, { weekStartsOn: 0 }), 'yyyy-MM-dd')
        end = format(endOfWeek(currentDate, { weekStartsOn: 0 }), 'yyyy-MM-dd')
      }
      
      const data = await getEvents(start, end)
      setEvents(data)
    } catch (error) {
      console.error("Failed to fetch events", error)
      toast.error("Erro ao carregar eventos")
    } finally {
      setLoading(false)
    }
  }, [currentDate, viewMode])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  useEffect(() => {
    // Default to list view on mobile for better UX
    if (window.innerWidth < 768) {
      setViewMode("list")
    }
  }, [])

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'month') {
      setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1))
    } else if (viewMode === 'week') {
      setCurrentDate(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1))
    } else {
      setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1))
    }
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return events.filter((e) => e.date === dateStr)
  }

  const selectedDateEvents = events.filter(e => e.date === format(selectedDate, 'yyyy-MM-dd'))

  const handleDeleteEvent = async (id: string) => {
    try {
      setLoading(true)
      await deleteEvent(id)
      setEvents(prev => prev.filter(e => e.id !== id))
      toast.success("Evento excluído")
    } catch (error) {
      console.error("Failed to delete event", error)
      toast.error("Erro ao excluir evento")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (event: Event) => {
    try {
      const newStatus = event.status === 'completed' ? 'pending' : 'completed'
      // Optimistic update
      setEvents(prev => prev.map(e => e.id === event.id ? { ...e, status: newStatus } : e))
      
      await updateEvent(event.id, { status: newStatus })
    } catch (error) {
      console.error("Failed to update status", error)
      toast.error("Erro ao atualizar status")
      // Revert optimistic update
      fetchEvents()
    }
  }

  const handleEventCreated = (newEvent: Event) => {
    setEvents(prev => [...prev, newEvent])
    // If the new event is in the current view, it will show up automatically
    // If we want to jump to it:
    const eventDate = parseISO(newEvent.date)
    if (!isSameMonth(eventDate, currentDate)) {
      setCurrentDate(eventDate)
    }
    setSelectedDate(eventDate)
  }

  // Generate calendar days for month view
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  // Generate week days
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  return (
    <LayoutWrapper>
      <div className="flex flex-col space-y-6 lg:h-[calc(100vh-100px)] h-auto min-h-[600px]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground flex items-center gap-2">
              <CalendarIcon className="h-8 w-8 text-primary" />
              Agenda Jurídica
            </h1>
            <p className="text-muted-foreground mt-1">Gerencie prazos, audiências e reuniões com eficiência.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <Button variant="outline" onClick={goToToday} className="hidden sm:flex">Hoje</Button>
            
            <div className="flex items-center bg-muted rounded-lg p-1 mr-2">
              <Button 
                variant={viewMode === "month" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("month")}
                className="h-8 px-3"
              >
                <LayoutGrid className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Mês</span>
              </Button>
              <Button 
                variant={viewMode === "week" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("week")}
                className="h-8 px-3"
              >
                <Clock3 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Semana</span>
              </Button>
              <Button 
                variant={viewMode === "list" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("list")}
                className="h-8 px-3"
              >
                <List className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Lista</span>
              </Button>
            </div>

            <CalendarQuickAdd onEventCreated={handleEventCreated} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-full h-auto min-h-0">
          {/* Main Calendar Area */}
          <div className={cn("flex flex-col lg:h-full h-[500px] min-h-0 space-y-4 transition-all duration-300", viewMode === 'list' ? "lg:col-span-12 h-auto" : "lg:col-span-8")}>
            <Card className="flex-1 flex flex-col border-none shadow-md overflow-hidden bg-background">
              <div className="p-4 border-b flex items-center justify-between bg-card/50">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold capitalize flex items-center gap-2">
                    {format(currentDate, "MMMM", { locale: ptBR })} 
                    <span className="text-muted-foreground font-normal">{format(currentDate, "yyyy")}</span>
                  </h2>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => navigateDate('prev')} className="h-8 w-8">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigateDate('next')} className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {loading && <span className="text-xs text-muted-foreground animate-pulse">Atualizando...</span>}
              </div>
              
              <div className="flex-1 overflow-y-auto bg-background">
                {/* Month View */}
                {viewMode === "month" && (
                  <div className="h-full flex flex-col p-4">
                    <div className="grid grid-cols-7 mb-2">
                      {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 auto-rows-fr flex-1">
                      {calendarDays.map((day, index) => {
                        const dayEvents = getEventsForDate(day)
                        const isSelected = isSameDay(day, selectedDate)
                        const isCurrentMonth = isSameMonth(day, currentDate)
                        const isTodayDate = isToday(day)

                        return (
                          <div
                            key={day.toISOString()}
                            onClick={() => setSelectedDate(day)}
                            className={cn(
                              "min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border rounded-lg cursor-pointer transition-all hover:border-primary/50 flex flex-col gap-1 overflow-hidden relative",
                              isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border/50 bg-card",
                              !isCurrentMonth && "opacity-40 bg-muted/50",
                              isTodayDate && !isSelected && "border-blue-300 bg-blue-50/50 dark:bg-blue-950/20"
                            )}
                          >
                            <span className={cn(
                              "text-xs sm:text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full mb-1",
                              isTodayDate ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                            )}>
                              {format(day, "d")}
                            </span>
                            <div className="flex flex-col gap-1 overflow-hidden">
                              {dayEvents.slice(0, 3).map((event) => {
                                const type = eventTypes[event.type as keyof typeof eventTypes] || eventTypes.prazo
                                const isCompleted = event.status === 'completed'
                                return (
                                  <div
                                    key={event.id}
                                    className={cn(
                                      "text-[10px] truncate px-1.5 py-0.5 rounded-sm font-medium flex items-center gap-1",
                                      isCompleted ? "bg-gray-100 text-gray-500 line-through" : cn(type.bgLight, type.text)
                                    )}
                                  >
                                    <div className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", isCompleted ? "bg-gray-400" : type.color)} />
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
                  </div>
                )}

                {/* Week View */}
                {viewMode === "week" && (
                  <div className="h-full flex flex-col p-4">
                    <div className="grid grid-cols-7 h-full gap-2">
                      {weekDays.map((day) => {
                        const dayEvents = getEventsForDate(day)
                        const isTodayDate = isToday(day)
                        const isSelected = isSameDay(day, selectedDate)

                        return (
                          <div 
                            key={day.toISOString()} 
                            className={cn(
                              "flex flex-col border rounded-lg overflow-hidden bg-card cursor-pointer transition-all",
                              isSelected ? "border-primary ring-1 ring-primary" : "border-border",
                              isTodayDate && !isSelected && "border-blue-300 bg-blue-50/20"
                            )}
                            onClick={() => setSelectedDate(day)}
                          >
                            <div className={cn("p-2 text-center border-b", isTodayDate ? "bg-primary/10" : "bg-muted/30")}>
                              <div className="text-xs font-medium text-muted-foreground capitalize">
                                {format(day, "EEE", { locale: ptBR })}
                              </div>
                              <div className={cn(
                                "text-lg font-bold mx-auto w-8 h-8 flex items-center justify-center rounded-full mt-1",
                                isTodayDate ? "bg-primary text-primary-foreground" : "text-foreground"
                              )}>
                                {format(day, "d")}
                              </div>
                            </div>
                            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                              {dayEvents.map((event) => {
                                const type = eventTypes[event.type as keyof typeof eventTypes] || eventTypes.prazo
                                return (
                                  <div
                                    key={event.id}
                                    className={cn(
                                      "p-2 rounded text-xs border flex flex-col gap-1",
                                      event.status === 'completed' ? "bg-gray-50 border-gray-100 opacity-60" : cn(type.bgLight, type.border)
                                    )}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className={cn("font-medium truncate", type.text)}>{event.start_time}</span>
                                    </div>
                                    <span className="font-medium truncate leading-tight">{event.title}</span>
                                    {event.location && (
                                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground truncate">
                                        <MapPin className="h-3 w-3 flex-shrink-0" />
                                        <span className="truncate">{event.location}</span>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="p-4 space-y-6 max-w-4xl mx-auto w-full">
                    {events.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>Nenhum evento neste período.</p>
                      </div>
                    ) : (
                      events.map((event) => {
                        const type = eventTypes[event.type as keyof typeof eventTypes] || eventTypes.prazo
                        const Icon = type.icon
                        const eventDate = parseISO(event.date)
                        const isOverdue = isPast(eventDate) && !isToday(eventDate) && event.status !== 'completed'
                        
                        return (
                          <div 
                            key={event.id} 
                            className={cn(
                              "group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-all",
                              isOverdue ? "border-red-200 bg-red-50/10" : "border-border"
                            )}
                          >
                            <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1 min-w-[100px]">
                              <div className="text-2xl font-bold text-foreground">
                                {format(eventDate, "dd")}
                              </div>
                              <div className="text-sm font-medium text-muted-foreground uppercase">
                                {format(eventDate, "MMM", { locale: ptBR })}
                              </div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {format(eventDate, "EEEE", { locale: ptBR })}
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                  <h3 className={cn("font-semibold text-lg flex items-center gap-2", event.status === 'completed' && "line-through text-muted-foreground")}>
                                    {event.title}
                                    {isOverdue && <Badge variant="destructive" className="text-[10px] px-1.5 h-5">Vencido</Badge>}
                                  </h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{event.start_time || "Dia todo"}</span>
                                    {event.location && (
                                      <>
                                        <span>•</span>
                                        <MapPin className="h-3.5 w-3.5" />
                                        <span>{event.location}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className={cn("capitalize gap-1 pl-1 pr-2", type.bgLight, type.text, type.border)}>
                                    <Icon className="h-3 w-3" />
                                    {type.label}
                                  </Badge>
                                </div>
                              </div>
                              
                              {event.description && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                  {event.description}
                                </p>
                              )}
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-center gap-2 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-4 mt-2 sm:mt-0">
                              <Button
                                variant={event.status === 'completed' ? "default" : "outline"}
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleToggleStatus(event); }}
                                className={cn("w-full sm:w-auto", event.status === 'completed' && "bg-green-600 hover:bg-green-700")}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                {event.status === 'completed' ? "Concluído" : "Concluir"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}
                                className="w-full sm:w-auto text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar / Details - Visible on all screens, stacked on mobile */}
          {viewMode !== 'list' && (
            <div className="lg:col-span-4 flex flex-col lg:h-full h-[400px] min-h-0 space-y-4">
              <Card className="flex-1 flex flex-col border-none shadow-md overflow-hidden bg-background">
                <div className="p-4 border-b bg-card/50">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
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
                        const isOverdue = isPast(parseISO(event.date)) && !isToday(parseISO(event.date)) && event.status !== 'completed'

                        return (
                          <div
                            key={event.id}
                            className={cn(
                              "group flex items-start gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-all relative overflow-hidden",
                              event.status === 'completed' ? "opacity-70" : "",
                              isOverdue ? "border-red-200 bg-red-50/10" : ""
                            )}
                          >
                            <div className={cn("p-2 rounded-lg mt-0.5", type.bgLight, type.text)}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={cn("font-medium text-sm truncate", event.status === 'completed' && "line-through text-muted-foreground")}>
                                  {event.title}
                                </h4>
                                {event.start_time && (
                                  <span className="text-xs text-muted-foreground whitespace-nowrap bg-muted px-1.5 py-0.5 rounded">
                                    {event.start_time}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                {event.description || "Sem descrição"}
                              </p>
                              {event.location && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className={cn("text-[10px] px-1.5 h-5 font-normal", type.border, type.text)}>
                                  {type.label}
                                </Badge>
                                {isOverdue && (
                                  <Badge variant="destructive" className="text-[10px] px-1.5 h-5 font-normal">
                                    Vencido
                                  </Badge>
                                )}
                                {event.status === 'completed' && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 h-5 font-normal bg-green-100 text-green-700">
                                    Concluído
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2 bg-card/80 backdrop-blur-sm rounded p-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleToggleStatus(event)}
                                title={event.status === 'completed' ? "Reabrir" : "Concluir"}
                              >
                                <CheckCircle2 className={cn("h-4 w-4", event.status === 'completed' ? "text-green-600" : "text-muted-foreground")} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteEvent(event.id)}
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  )
}
