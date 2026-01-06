"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Plus, Clock, FileText, MapPin, UsersIcon, Scale, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const eventTypes = [
  { value: "audiencia", label: "Audiência", icon: Scale, color: "text-red-500" },
  { value: "prazo", label: "Prazo Processual", icon: Clock, color: "text-amber-500" },
  { value: "vencimento", label: "Vencimento", icon: AlertTriangle, color: "text-orange-500" },
  { value: "reuniao", label: "Reunião", icon: UsersIcon, color: "text-blue-500" },
  { value: "diligencia", label: "Diligência", icon: MapPin, color: "text-purple-500" },
  { value: "protocolo", label: "Protocolo", icon: FileText, color: "text-emerald-500" },
]

export function CalendarQuickAdd({ onEventAdded }: { onEventAdded?: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [eventType, setEventType] = useState("")
  const [title, setTitle] = useState("")

  const handleQuickAdd = () => {
    if (!title || !eventType) return
    // Add event logic here
    setTitle("")
    setEventType("")
    setIsExpanded(false)
    onEventAdded?.()
  }

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Evento Rápido
      </Button>
    )
  }

  return (
    <Card className="p-4 border-emerald-500/20 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Novo Evento</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
            Cancelar
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <Label className="text-xs">Tipo de Evento</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {eventTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setEventType(type.value)}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border text-sm transition-all",
                    eventType === type.value
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                      : "border-border hover:border-emerald-300",
                  )}
                >
                  <type.icon className={cn("h-4 w-4", type.color)} />
                  <span className="text-xs">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="quick-title" className="text-xs">
              Título
            </Label>
            <Input
              id="quick-title"
              placeholder="Ex: Audiência de Conciliação"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="quick-date" className="text-xs">
                Data
              </Label>
              <Input id="quick-date" type="date" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="quick-time" className="text-xs">
                Hora
              </Label>
              <Input id="quick-time" type="time" className="mt-1" />
            </div>
          </div>

          <Button onClick={handleQuickAdd} className="w-full bg-emerald-500 hover:bg-emerald-600" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>
    </Card>
  )
}
