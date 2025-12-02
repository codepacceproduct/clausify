"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Mail, Clock, Shield, Users, AlertTriangle, Save } from "lucide-react"

export function ApprovalSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [autoReminder, setAutoReminder] = useState(true)
  const [reminderDays, setReminderDays] = useState("2")
  const [delegationEnabled, setDelegationEnabled] = useState(true)
  const [escalationEnabled, setEscalationEnabled] = useState(true)
  const [escalationDays, setEscalationDays] = useState("3")

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>Configure como você deseja receber alertas sobre aprovações</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Notificações por E-mail</p>
                <p className="text-xs text-muted-foreground">Receba e-mails sobre novas aprovações pendentes</p>
              </div>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Notificações Push</p>
                <p className="text-xs text-muted-foreground">Receba alertas em tempo real no navegador</p>
              </div>
            </div>
            <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Lembretes Automáticos</p>
                <p className="text-xs text-muted-foreground">Receba lembretes para aprovações pendentes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={reminderDays} onValueChange={setReminderDays} disabled={!autoReminder}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 dia</SelectItem>
                  <SelectItem value="2">2 dias</SelectItem>
                  <SelectItem value="3">3 dias</SelectItem>
                  <SelectItem value="5">5 dias</SelectItem>
                </SelectContent>
              </Select>
              <Switch checked={autoReminder} onCheckedChange={setAutoReminder} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delegation & Escalation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Delegação e Escalação
          </CardTitle>
          <CardDescription>Configure regras para delegação e escalação automática</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Permitir Delegação</p>
                <p className="text-xs text-muted-foreground">Permite delegar aprovações para outros usuários</p>
              </div>
            </div>
            <Switch checked={delegationEnabled} onCheckedChange={setDelegationEnabled} />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Escalação Automática</p>
                <p className="text-xs text-muted-foreground">Escala automaticamente após período sem resposta</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={escalationDays} onValueChange={setEscalationDays} disabled={!escalationEnabled}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 dias</SelectItem>
                  <SelectItem value="3">3 dias</SelectItem>
                  <SelectItem value="5">5 dias</SelectItem>
                  <SelectItem value="7">7 dias</SelectItem>
                </SelectContent>
              </Select>
              <Switch checked={escalationEnabled} onCheckedChange={setEscalationEnabled} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Segurança
          </CardTitle>
          <CardDescription>Configurações de segurança para o processo de aprovação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tempo de Sessão (minutos)</label>
              <Input type="number" defaultValue="30" />
              <p className="text-xs text-muted-foreground">
                Tempo máximo de inatividade antes de exigir reautenticação
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Requer MFA para Aprovações</label>
              <Select defaultValue="high-value">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Nunca</SelectItem>
                  <SelectItem value="high-value">Apenas alto valor</SelectItem>
                  <SelectItem value="always">Sempre</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Quando exigir autenticação de dois fatores</p>
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Auditoria Completa Ativada</p>
                <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                  Todas as ações de aprovação são registradas com IP, data/hora e dispositivo para conformidade e
                  auditoria.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}
