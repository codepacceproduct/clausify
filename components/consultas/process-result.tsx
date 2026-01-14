"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, ChevronLeft, Calendar } from "lucide-react"

interface ProcessEvent {
  id: string
  date: string
  description: string
  details?: string
  translation?: string
  nextStep?: string
}

interface ProcessResultProps {
  processNumber: string
  title: string
  status: string
  events: ProcessEvent[]
  onBack: () => void
}

export function ProcessResult({ processNumber, title, status, events, onBack }: ProcessResultProps) {
  const latestEvent = events[0]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground pl-0"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Voltar para busca
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground font-mono mt-1">Nº {processNumber}</p>
        </div>
        <Badge variant="outline" className="w-fit bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1.5 text-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
          {status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Timeline */}
        <Card className="lg:col-span-1 bg-slate-950 text-slate-200 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Linha do tempo</CardTitle>
            <p className="text-xs text-slate-500">Do mais recente ao mais antigo</p>
          </CardHeader>
          <CardContent>
            <div className="relative pl-4 border-l border-slate-800 space-y-8">
              {events.map((event, index) => (
                <div key={event.id} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-slate-950 ${index === 0 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  
                  <div className="flex flex-col gap-1">
                    <span className={`text-xs font-mono ${index === 0 ? 'text-emerald-500 font-bold' : 'text-slate-500'}`}>
                      {event.date}
                    </span>
                    <p className={`text-sm ${index === 0 ? 'text-white font-medium' : 'text-slate-400'}`}>
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-950 border-slate-800 overflow-hidden">
            <CardHeader className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg text-white">Última atualização (detalhes)</CardTitle>
                <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-20 bg-emerald-500 rounded-full" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-2xl font-bold text-white">
                  <Calendar className="h-6 w-6 text-slate-500" />
                  {latestEvent.date}
                </div>
                
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
                  <p className="text-slate-300">
                    {latestEvent.details || latestEvent.description}
                  </p>
                  
                  {latestEvent.translation && (
                    <div className="pl-4 border-l-4 border-emerald-500">
                      <p className="text-xs text-emerald-500 font-bold mb-1 uppercase tracking-wider">Tradução rápida:</p>
                      <p className="text-white font-medium text-lg">
                        {latestEvent.translation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {latestEvent.nextStep && (
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-slate-300">Próximo passo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">{latestEvent.nextStep}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              Falar com o Escritório
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
