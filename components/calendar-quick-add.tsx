"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Clock, FileText, MapPin, UsersIcon, Scale, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createEvent } from "@/app/actions/calendar"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const eventTypes = [
  { value: "audiencia", label: "Audiência", icon: Scale, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
  { value: "prazo", label: "Prazo", icon: Clock, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
  { value: "vencimento", label: "Vencimento", icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" },
  { value: "reuniao", label: "Reunião", icon: UsersIcon, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
  { value: "diligencia", label: "Diligência", icon: MapPin, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200" },
  { value: "protocolo", label: "Protocolo", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
]

export function CalendarQuickAdd({ onEventCreated }: { onEventCreated?: (event: any) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [eventType, setEventType] = useState("")
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("medium")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  
  // Initialize with local date
  const [date, setDate] = useState(() => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })
  
  const [time, setTime] = useState("09:00")
  const [loading, setLoading] = useState(false)

  const handleQuickAdd = async () => {
    if (!title || !eventType || !date) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }
    
    setLoading(true)
    try {
      const newEvent = await createEvent({
        title,
        type: eventType,
        date,
        start_time: time,
        priority,
        description,
        status: 'pending',
        location: location
      })
      
      setTitle("")
      setEventType("")
      setPriority("medium")
      setDescription("")
      setLocation("")
      setIsOpen(false)
      toast.success("Evento criado com sucesso!")
      onEventCreated?.(newEvent)
    } catch (error: any) {
      console.error("Failed to create event", error)
      toast.error("Erro ao criar evento")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto" id="quick-add-trigger">
          <Plus className="h-4 w-4" />
          <span>Novo Evento</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Evento</DialogTitle>
          <DialogDescription>
            Adicione um novo compromisso à sua agenda jurídica.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Audiência Trabalhista"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className={cn("h-4 w-4", type.color)} />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Fórum Central, Sala 3"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Observações</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes adicionais..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleQuickAdd} disabled={loading}>
            {loading ? "Criando..." : "Criar Evento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
