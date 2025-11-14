import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, MessageSquare, AlertCircle } from "lucide-react"

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Notificações por Email</CardTitle>
          </div>
          <CardDescription>Escolha quando você quer receber emails</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div className="space-y-0.5">
              <Label htmlFor="email-contracts" className="text-base">
                Novos contratos analisados
              </Label>
              <p className="text-sm text-muted-foreground">Receba notificações quando análises forem concluídas</p>
            </div>
            <Switch id="email-contracts" defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div className="space-y-0.5">
              <Label htmlFor="email-alerts" className="text-base">
                Alertas de risco
              </Label>
              <p className="text-sm text-muted-foreground">Notificações de cláusulas de alto risco detectadas</p>
            </div>
            <Switch id="email-alerts" defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div className="space-y-0.5">
              <Label htmlFor="email-team" className="text-base">
                Atualizações da equipe
              </Label>
              <p className="text-sm text-muted-foreground">Quando membros adicionam comentários ou menções</p>
            </div>
            <Switch id="email-team" defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label htmlFor="email-marketing" className="text-base">
                Newsletter e atualizações
              </Label>
              <p className="text-sm text-muted-foreground">Novidades, dicas e atualizações do produto</p>
            </div>
            <Switch id="email-marketing" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Notificações Push</CardTitle>
          </div>
          <CardDescription>Receba notificações em tempo real no navegador</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div className="space-y-0.5">
              <Label htmlFor="push-enabled" className="text-base">
                Ativar notificações push
              </Label>
              <p className="text-sm text-muted-foreground">Permite que o sistema envie notificações</p>
            </div>
            <Switch id="push-enabled" defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div className="space-y-0.5">
              <Label htmlFor="push-mentions" className="text-base">
                Menções e comentários
              </Label>
              <p className="text-sm text-muted-foreground">Quando alguém mencionar você</p>
            </div>
            <Switch id="push-mentions" defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label htmlFor="push-updates" className="text-base">
                Atualizações de status
              </Label>
              <p className="text-sm text-muted-foreground">Mudanças no status dos contratos</p>
            </div>
            <Switch id="push-updates" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Resumo de Atividades</CardTitle>
          </div>
          <CardDescription>Receba resumos periódicos das atividades</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div className="space-y-0.5">
              <Label htmlFor="digest-daily" className="text-base">
                Resumo diário
              </Label>
              <p className="text-sm text-muted-foreground">Um email com o resumo do dia às 18h</p>
            </div>
            <Switch id="digest-daily" defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div className="space-y-0.5">
              <Label htmlFor="digest-weekly" className="text-base">
                Resumo semanal
              </Label>
              <p className="text-sm text-muted-foreground">Relatório semanal toda segunda às 9h</p>
            </div>
            <Switch id="digest-weekly" />
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label htmlFor="digest-monthly" className="text-base">
                Resumo mensal
              </Label>
              <p className="text-sm text-muted-foreground">Relatório completo no primeiro dia do mês</p>
            </div>
            <Switch id="digest-monthly" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
