import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Building2, FileText } from "lucide-react"

export interface BillingDetails {
  legal_name?: string
  tax_id?: string
  email?: string
  address?: string
  city?: string
  state?: string
  zip?: string
}

interface BillingInfoProps {
  billing?: BillingDetails
}

export function BillingInfo({ billing }: BillingInfoProps) {
  return (
    <div className="space-y-6">
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
                <Input id="company" placeholder="Sua Empresa Ltda" defaultValue={billing?.legal_name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" defaultValue={billing?.tax_id} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" placeholder="Rua, número" defaultValue={billing?.address} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" placeholder="São Paulo" defaultValue={billing?.city} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input id="state" placeholder="SP" defaultValue={billing?.state} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">CEP</Label>
                <Input id="zip" placeholder="00000-000" defaultValue={billing?.zip} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar Alterações</Button>
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
                <div className="text-sm text-muted-foreground">{billing?.email || "Não configurado"}</div>
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
