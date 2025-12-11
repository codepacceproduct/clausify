import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, ArrowUpRight } from "lucide-react"

export function CurrentPlan() {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-xl sm:text-2xl">Plano Professional</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100">
                Ativo
              </Badge>
            </div>
            <CardDescription className="text-sm sm:text-base">Próxima cobrança em 15 de Janeiro, 2025</CardDescription>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">R$ 299,00</div>
            <div className="text-sm text-muted-foreground">por mês</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-3 w-3 text-green-700 dark:text-green-100" />
            </div>
            <span className="text-sm">Análises ilimitadas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-3 w-3 text-green-700 dark:text-green-100" />
            </div>
            <span className="text-sm">5 usuários inclusos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-3 w-3 text-green-700 dark:text-green-100" />
            </div>
            <span className="text-sm">Suporte prioritário</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-3 w-3 text-green-700 dark:text-green-100" />
            </div>
            <span className="text-sm">API de integração</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-3 w-3 text-green-700 dark:text-green-100" />
            </div>
            <span className="text-sm">Armazenamento 500GB</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-3 w-3 text-green-700 dark:text-green-100" />
            </div>
            <span className="text-sm">Relatórios avançados</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1 bg-transparent">
            Cancelar Assinatura
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            Fazer Upgrade
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
