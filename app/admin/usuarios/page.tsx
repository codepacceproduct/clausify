import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersTable } from "@/components/admin/users-table"
import { getUsers } from "@/app/actions/users"
import { getPlans } from "@/actions/plans"
import { Users } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  const [users, plans] = await Promise.all([
    getUsers(),
    getPlans()
  ])

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground flex items-center gap-3">
          <Users className="w-8 h-8 text-emerald-500" />
          Gerenciamento de Usuários
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Gerencie permissões, planos e acesso dos usuários da plataforma.
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
          <CardDescription>
            Lista completa de usuários com informações de plano e permissões.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} plans={plans} />
        </CardContent>
      </Card>
    </div>
  )
}
