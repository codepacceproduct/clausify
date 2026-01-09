"use client"

import { useState, useEffect, useCallback } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarQuickAdd } from "@/components/calendar-quick-add"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  Search,
  Filter,
  MoreHorizontal,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getEvents, deleteEvent, type Event } from "@/app/actions/calendar"

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

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("month")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch events for the current month view (plus padding for week view if needed)
      // Use local date string to avoid timezone issues with toISOString()
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
    setSelectedDate(today.toISOString().split('T')[0])
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
      await fetchEvents()
    } catch (error) {
      console.error("Failed to delete event", error)
    } finally {
      setLoading(false)
    }
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
              
              <div className="flex-1 p-4">
                <div className="grid grid-cols-7 mb-4">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 h-[calc(100%-40px)] auto-rows-fr">
                  {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className="p-2" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1
                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    const isToday = toLocalDateString(new Date()) === dateStr
                    const isSelected = selectedDate === dateStr
                    const dayEvents = getEventsForDate(day)

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(dateStr)}
                        className={cn(
                          "relative p-2 rounded-lg border transition-all hover:border-primary/50 text-left flex flex-col items-start gap-1 group min-h-[80px]",
                          isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-transparent hover:bg-muted/50",
                          isToday && !isSelected && "bg-muted/30 border-muted-foreground/20"
                        )}
                      >
                        <span className={cn(
                          "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full transition-colors",
                          isToday ? "bg-primary text-primary-foreground" : "text-foreground",
                          isSelected && !isToday && "text-primary"
                        )}>
                          {day}
                        </span>
                        
                        <div className="flex flex-col gap-1 w-full mt-1">
                          {dayEvents.slice(0, 3).map((event, i) => {
                            const config = eventTypes[event.type as keyof typeof eventTypes] || eventTypes.reuniao
                            return (
                              <div 
                                key={event.id} 
                                className={cn(
                                  "text-[10px] px-1.5 py-0.5 rounded-sm truncate w-full font-medium flex items-center gap-1",
                                  config.bgLight, config.text
                                )}
                              >
                                <div className={cn("w-1 h-1 rounded-full shrink-0", config.color)} />
                                {event.start_time || event.time} {event.title}
                              </div>
                            )
                          })}
                          {dayEvents.length > 3 && (
                            <div className="text-[10px] text-muted-foreground px-1">
                              + {dayEvents.length - 3} mais
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Side Panel (Agenda) */}
          <div className="lg:col-span-4 flex flex-col h-full min-h-0 space-y-4">
            {/* Quick Add Widget */}
            <CalendarQuickAdd onEventAdded={fetchEvents} />

            {/* Selected Date Agenda */}
            <Card className="flex-1 flex flex-col border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3 border-b bg-card">
                <CardTitle className="text-base font-medium flex items-center justify-between">
                  <span>
                    {selectedDate ? (() => {
                      const [y, m, d] = selectedDate.split('-').map(Number)
                      const date = new Date(y, m - 1, d)
                      return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', weekday: 'long' })
                    })() : "Selecione uma data"}
                  </span>
                  {selectedDateEvents.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedDateEvents.length} eventos
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <div className="p-4 space-y-4">
                    {selectedDateEvents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground space-y-2">
                        <CalendarIcon className="h-10 w-10 opacity-20" />
                        <p>Nenhum evento para este dia.</p>
                      </div>
                    ) : (
                      <div className="relative border-l border-border ml-3 space-y-6">
                         {selectedDateEvents.map((event) => {
                           const config = eventTypes[event.type as keyof typeof eventTypes] || eventTypes.reuniao
                           return (
                             <div key={event.id} className="relative pl-6 group">
                               {/* Timeline Dot */}
                               <div className={cn(
                                 "absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background ring-2 ring-offset-0",
                                 config.color,
                                 "ring-border group-hover:ring-primary transition-all"
                               )} />
                               
                               <div className="bg-card hover:bg-accent/50 p-3 rounded-lg border border-border transition-all shadow-sm hover:shadow-md cursor-pointer group-hover:border-primary/30">
                                 <div className="flex items-start justify-between mb-2">
                                   <div className="flex items-center gap-2">
                                     <Badge variant="outline" className={cn("text-xs font-normal", config.bgLight, config.text, config.border)}>
                                       {config.label}
                                     </Badge>
                                     {event.priority === 'critical' && (
                                       <Badge variant="destructive" className="text-[10px] h-5 px-1.5">Urgente</Badge>
                                    )}
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100 data-[state=open]:opacity-100">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem 
                                        className="text-destructive focus:text-destructive cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDeleteEvent(event.id)
                                        }}
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir Evento
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                
                                <h4 className="font-semibold text-sm text-foreground mb-1">{event.title}</h4>
                                 
                                 <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                                   <div className="flex items-center gap-1.5 text-foreground/80 font-medium">
                                     <Clock className="h-3.5 w-3.5" />
                                     {event.start_time || event.time}
                                     {event.end_time && ` - ${event.end_time}`}
                                   </div>
                                   
                                   {event.location && (
                                     <div className="flex items-center gap-1.5">
                                       <MapPin className="h-3.5 w-3.5" />
                                       {event.location}
                                     </div>
                                   )}
                                 </div>
                               </div>
                             </div>
                           )
                         })}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
