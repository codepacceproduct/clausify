import { getPlans } from "@/actions/plans"
import { PlansClient } from "./plans-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PermissoesPage() {
  const plans = await getPlans()

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Permissões</h1>
        <p className="text-muted-foreground">
          Gerencie os planos de assinatura, limites e módulos disponíveis para cada nível.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planos e Cotas</CardTitle>
          <CardDescription>
            Configure o que cada plano pode acessar e seus limites de uso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlansClient initialPlans={plans} />
        </CardContent>
      </Card>
    </div>
  )
}
