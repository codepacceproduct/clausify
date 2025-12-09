import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Building2, FileText, CheckCircle2 } from "lucide-react"

export function BillingInfo() {
  return (
    <div className="space-y-6">
      {/* Seção do Plano Atual */}
      <Card className="border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-900/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Plano Atual</CardTitle>
              <CardDescription>Detalhes da sua assinatura ativa</CardDescription>
            </div>
            <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Ativo
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Professional</h3>
            <p className="text-muted-foreground mt-1">Renova em 15 de Janeiro de 2025</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-2xl font-bold">R$ 299,00<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
            <p className="text-xs text-muted-foreground mt-1">Cobrado mensalmente</p>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 border-t px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
            Cancelar Assinatura
          </Button>
          <Button variant="outline" size="sm">
            Alterar Plano
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Forma de Pagamento</CardTitle>
          </div>
          <CardDescription>Gerencie seus métodos de pagamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-sm">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <div className="font-medium flex items-center gap-2">
                  Mastercard final 4532
                  <Badge variant="secondary" className="text-[10px] h-5">Principal</Badge>
                </div>
                <div className="text-sm text-muted-foreground">Expira em 12/2026</div>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                Editar
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                Remover
              </Button>
            </div>
          </div>
          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
            <CreditCard className="mr-2 h-4 w-4" />
            Adicionar Novo Cartão
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Informações de Faturamento</CardTitle>
          </div>
          <CardDescription>Dados para emissão de notas fiscais</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Nome da Empresa</Label>
                <Input id="company" placeholder="Sua Empresa Ltda" defaultValue="Oliveira Advogados Associados" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" defaultValue="12.345.678/0001-90" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" placeholder="Rua, número" defaultValue="Av. Paulista, 1000" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" placeholder="São Paulo" defaultValue="São Paulo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input id="state" placeholder="SP" defaultValue="SP" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">CEP</Label>
                <Input id="zip" placeholder="00000-000" defaultValue="01310-100" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" type="button">Cancelar</Button>
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Notas Fiscais</CardTitle>
          </div>
          <CardDescription>Configurações de emissão de notas fiscais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg">
              <div>
                <div className="font-medium">Email para envio de NF-e</div>
                <div className="text-sm text-muted-foreground">financeiro@oliveira-advogados.com.br</div>
              </div>
              <Button variant="outline" size="sm">
                Alterar Email
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Emissão automática</div>
                <div className="text-sm text-muted-foreground">Notas emitidas automaticamente após pagamento</div>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
