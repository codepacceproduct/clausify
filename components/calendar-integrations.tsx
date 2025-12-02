"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Link2, Unlink, CheckCircle, AlertCircle, RefreshCw, Settings, ExternalLink } from "lucide-react"

interface Integration {
  id: string
  name: string
  icon: string
  connected: boolean
  lastSync?: string
  eventsCount?: number
  calendars?: string[]
}

const integrations: Integration[] = [
  {
    id: "google",
    name: "Google Calendar",
    icon: "🗓️",
    connected: true,
    lastSync: "Há 5 minutos",
    eventsCount: 12,
    calendars: ["Contratos Clausify", "Vencimentos", "Reuniões Jurídicas"],
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    icon: "📧",
    connected: false,
  },
  {
    id: "apple",
    name: "Apple Calendar",
    icon: "🍎",
    connected: false,
  },
]

export function CalendarIntegrations() {
  const [autoSync, setAutoSync] = useState(true)
  const [syncFrequency, setSyncFrequency] = useState("15")
  const [createEvents, setCreateEvents] = useState(true)
  const [sendReminders, setSendReminders] = useState(true)

  return (
    <div className="space-y-6">
      {/* Connected Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Integrações de Calendário
          </CardTitle>
          <CardDescription>Conecte seus calendários para sincronizar prazos e eventos automaticamente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className={`p-4 border rounded-lg ${
                integration.connected ? "bg-success/5 border-success/20" : "bg-muted/50"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{integration.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{integration.name}</h3>
                      {integration.connected ? (
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Conectado
                        </Badge>
                      ) : (
                        <Badge variant="outline">Não conectado</Badge>
                      )}
                    </div>
                    {integration.connected && (
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Última sincronização: {integration.lastSync}</span>
                        <span>{integration.eventsCount} eventos sincronizados</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {integration.connected ? (
                    <>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sincronizar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Unlink className="h-4 w-4 mr-2" />
                        Desconectar
                      </Button>
                    </>
                  ) : (
                    <Button>
                      <Link2 className="h-4 w-4 mr-2" />
                      Conectar
                    </Button>
                  )}
                </div>
              </div>

              {/* Connected Calendar Details */}
              {integration.connected && integration.calendars && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Calendários Sincronizados</h4>
                  <div className="flex flex-wrap gap-2">
                    {integration.calendars.map((cal, idx) => (
                      <Badge key={idx} variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {cal}
                      </Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      + Adicionar calendário
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Configurações de Sincronização
          </CardTitle>
          <CardDescription>Personalize como os eventos são sincronizados com seus calendários</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium">Sincronização Automática</p>
              <p className="text-xs text-muted-foreground">Sincronizar eventos automaticamente</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={syncFrequency} onValueChange={setSyncFrequency} disabled={!autoSync}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">A cada 5 min</SelectItem>
                  <SelectItem value="15">A cada 15 min</SelectItem>
                  <SelectItem value="30">A cada 30 min</SelectItem>
                  <SelectItem value="60">A cada 1 hora</SelectItem>
                </SelectContent>
              </Select>
              <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium">Criar Eventos Automaticamente</p>
              <p className="text-xs text-muted-foreground">Criar eventos no calendário para novos prazos</p>
            </div>
            <Switch checked={createEvents} onCheckedChange={setCreateEvents} />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium">Enviar Lembretes</p>
              <p className="text-xs text-muted-foreground">Receber notificações do calendário</p>
            </div>
            <Switch checked={sendReminders} onCheckedChange={setSendReminders} />
          </div>
        </CardContent>
      </Card>

      {/* Event Types to Sync */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Eventos para Sincronizar</CardTitle>
          <CardDescription>Selecione quais tipos de eventos devem ser sincronizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-sm">Vencimentos</span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm">Renovações</span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm">Obrigações</span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm">Reuniões</span>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Precisa de ajuda para conectar?</p>
              <p className="text-xs text-muted-foreground mt-1">
                Consulte nossa documentação para instruções detalhadas sobre como configurar as integrações de
                calendário.
              </p>
              <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                Ver documentação
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
