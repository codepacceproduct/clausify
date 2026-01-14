"use client"

import { useState } from "react"
import { Search, Plus, Bell, Smartphone, Mail, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface MonitoringAddProps {
  onAdd: (data: any) => void
  onCancel: () => void
}

export function MonitoringAdd({ onAdd, onCancel }: MonitoringAddProps) {
  const [processNumber, setProcessNumber] = useState("")
  const [nickname, setNickname] = useState("")
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    whatsapp: false
  })
  const [isValidating, setIsValidating] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsValidating(true)
    
    // Simulate validation
    setTimeout(() => {
      onAdd({
        processNumber,
        nickname: nickname || `Processo ${processNumber}`,
        notifications,
        status: "active",
        lastUpdate: new Date().toISOString(),
        movements: 0
      })
      setIsValidating(false)
    }, 1500)
  }

  return (
    <Card className="w-full border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-950 dark:to-slate-900/50">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Plus className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl">Novo Monitoramento</CardTitle>
        </div>
        <CardDescription>
          Cadastre um processo para receber atualizações automáticas em tempo real.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="process-number">Número do Processo</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="process-number"
                  placeholder="Ex: 1234567-89.2023.8.26.0100"
                  className="pl-9 border-emerald-100 dark:border-emerald-900 focus-visible:ring-emerald-500"
                  value={processNumber}
                  onChange={(e) => setProcessNumber(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: CNJ (20 dígitos) ou numeração antiga.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">Apelido (Opcional)</Label>
              <Input
                id="nickname"
                placeholder="Ex: Ação de Cobrança - Cliente X"
                className="border-emerald-100 dark:border-emerald-900 focus-visible:ring-emerald-500"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-emerald-100 dark:border-emerald-900">
              <Label className="text-base font-medium flex items-center gap-2">
                <Bell className="h-4 w-4 text-emerald-500" />
                Canais de Notificação
              </Label>
              
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center justify-between space-x-2 border rounded-lg p-3 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <Label htmlFor="email-notif" className="font-normal cursor-pointer">E-mail</Label>
                  </div>
                  <Switch 
                    id="email-notif" 
                    checked={notifications.email}
                    onCheckedChange={(c) => setNotifications(prev => ({ ...prev, email: c }))}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between space-x-2 border rounded-lg p-3 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-slate-500" />
                    <Label htmlFor="push-notif" className="font-normal cursor-pointer">Push</Label>
                  </div>
                  <Switch 
                    id="push-notif" 
                    checked={notifications.push}
                    onCheckedChange={(c) => setNotifications(prev => ({ ...prev, push: c }))}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between space-x-2 border rounded-lg p-3 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-green-500 text-green-500 h-5 px-1 text-[10px]">WPP</Badge>
                    <Label htmlFor="wpp-notif" className="font-normal cursor-pointer">WhatsApp</Label>
                  </div>
                  <Switch 
                    id="wpp-notif" 
                    checked={notifications.whatsapp}
                    onCheckedChange={(c) => setNotifications(prev => ({ ...prev, whatsapp: c }))}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]"
              disabled={isValidating || !processNumber}
            >
              {isValidating ? (
                <>Validando...</>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Iniciar Monitoramento
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
