"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Clock, FileText, MapPin, UsersIcon, Scale, AlertTriangle, Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
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

const eventTypes = [
  { value: "audiencia", label: "Audiência", icon: Scale, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
  { value: "prazo", label: "Prazo", icon: Clock, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
  { value: "vencimento", label: "Vencimento", icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" },
  { value: "reuniao", label: "Reunião", icon: UsersIcon, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
  { value: "diligencia", label: "Diligência", icon: MapPin, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200" },
  { value: "protocolo", label: "Protocolo", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
]

export function CalendarQuickAdd({ onEventAdded }: { onEventAdded?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [eventType, setEventType] = useState("")
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("medium")
  const [dbError, setDbError] = useState(false)
  const [copied, setCopied] = useState(false)
  
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
    if (!title || !eventType || !date) return
    
    setLoading(true)
    setDbError(false)
    try {
      await createEvent({
        title,
        type: eventType,
        date,
        start_time: time,
        priority,
        description: "",
        location: ""
      })
      
      setTitle("")
      setEventType("")
      setPriority("medium")
      setIsOpen(false)
      onEventAdded?.()
    } catch (error: any) {
      console.error("Failed to create event", error)
      if (error.message?.includes("Could not find the table") || error.message?.includes("relation \"public.events\" does not exist")) {
        setDbError(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const eventsSql = `CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  type TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own events" ON events;
CREATE POLICY "Users can view their own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own events" ON events;
CREATE POLICY "Users can insert their own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own events" ON events;
CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own events" ON events;
CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (auth.uid() = user_id);`

  const copySql = () => {
    navigator.clipboard.writeText(eventsSql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) setDbError(false)
    }}>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm h-12 text-base font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar Novo Evento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Evento na Agenda</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para agendar um novo compromisso jurídico.
          </DialogDescription>
        </DialogHeader>

        {dbError ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 my-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 text-destructive font-semibold mb-2">
              <AlertTriangle className="h-5 w-5" />
              Erro de Configuração do Banco de Dados
            </div>
            <p className="text-sm text-destructive/80 mb-3 leading-relaxed">
              A tabela de <strong>eventos</strong> não foi encontrada no seu banco de dados Supabase. 
              Para corrigir, você precisa criar a tabela manualmente.
            </p>
            
            <div className="bg-card border p-3 rounded-md mb-3 relative group">
              <pre className="text-[10px] font-mono overflow-x-auto whitespace-pre-wrap h-32 text-foreground/80">
                {eventsSql}
              </pre>
              <div className="absolute top-2 right-2">
                 <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={copySql}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
               <Button 
                variant="destructive" 
                className="w-full"
                onClick={copySql}
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "SQL Copiado!" : "Copiar Código SQL"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-1">
                Copie o código e execute no SQL Editor do Supabase.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            <div>
              <Label className="text-sm font-medium text-foreground mb-3 block">Tipo de Evento</Label>
              <div className="grid grid-cols-3 gap-3">
                {eventTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setEventType(type.value)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all h-24",
                      eventType === type.value
                        ? cn("border-2 shadow-sm ring-1 ring-primary/20", type.bg, type.border)
                        : "border-border bg-card hover:bg-muted/50 hover:border-primary/30",
                    )}
                  >
                    <type.icon className={cn("h-6 w-6", type.color)} />
                    <span className="text-xs font-medium text-center leading-tight">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="quick-title" className="text-sm font-medium">
                  Título do Evento
                </Label>
                <Input
                  id="quick-title"
                  placeholder="Ex: Audiência de Conciliação - Processo 123"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quick-date" className="text-sm font-medium">
                    Data
                  </Label>
                  <Input 
                    id="quick-date" 
                    type="date" 
                    className="mt-2" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="quick-time" className="text-sm font-medium">
                    Hora
                  </Label>
                  <Input 
                    id="quick-time" 
                    type="time" 
                    className="mt-2" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Prioridade</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica (Prazo Fatal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          {!dbError && (
            <Button onClick={handleQuickAdd} disabled={!title || !eventType || loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </span>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Salvar Agenda
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
