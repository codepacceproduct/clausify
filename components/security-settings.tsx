import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Shield, Key, Smartphone, AlertTriangle } from "lucide-react"

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Alterar Senha</CardTitle>
          </div>
          <CardDescription>Atualize sua senha regularmente para maior segurança</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input id="currentPassword" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input id="newPassword" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" />
            </div>
            <div className="flex justify-end pt-4">
              <Button>Atualizar Senha</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Autenticação de Dois Fatores (2FA)</CardTitle>
          </div>
          <CardDescription>Adicione uma camada extra de segurança à sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div className="space-y-0.5">
              <Label htmlFor="2fa-enabled" className="text-base">
                Ativar 2FA
              </Label>
              <p className="text-sm text-muted-foreground">Requer código adicional ao fazer login</p>
            </div>
            <Switch id="2fa-enabled" />
          </div>
          <div className="p-4 border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-3">
              Configure um aplicativo autenticador para gerar códigos de verificação
            </p>
            <Button variant="outline" size="sm">
              Configurar Autenticador
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Sessões Ativas</CardTitle>
          </div>
          <CardDescription>Gerencie dispositivos conectados à sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <div className="flex-1">
                <div className="font-medium text-foreground flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Sessão Atual
                </div>
                <div className="text-sm text-muted-foreground mt-1">Chrome em Windows • São Paulo, SP • Agora</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-foreground">Safari em MacBook Pro</div>
                <div className="text-sm text-muted-foreground mt-1">São Paulo, SP • Há 2 dias</div>
              </div>
              <Button variant="outline" size="sm">
                Encerrar
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-foreground">Chrome em iPhone</div>
                <div className="text-sm text-muted-foreground mt-1">São Paulo, SP • Há 5 dias</div>
              </div>
              <Button variant="outline" size="sm">
                Encerrar
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Encerrar Todas as Outras Sessões
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600 dark:text-red-400">Zona de Perigo</CardTitle>
          </div>
          <CardDescription>Ações irreversíveis que afetam sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="font-medium text-foreground">Excluir Conta</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Exclui permanentemente sua conta e todos os dados associados
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Excluir Conta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
