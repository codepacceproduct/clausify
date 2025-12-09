import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, ArrowUpRight } from "lucide-react"

export function CurrentPlan() {
  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              <CardTitle className="text-xl sm:text-2xl">Plano Professional</CardTitle>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800">
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
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <Check className="h-3 w-3 text-emerald-700 dark:text-emerald-100" />
            </div>
            <span className="text-sm">Análises ilimitadas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <Check className="h-3 w-3 text-emerald-700 dark:text-emerald-100" />
            </div>
            <span className="text-sm">5 usuários inclusos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <Check className="h-3 w-3 text-emerald-700 dark:text-emerald-100" />
            </div>
            <span className="text-sm">Suporte prioritário</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <Check className="h-3 w-3 text-emerald-700 dark:text-emerald-100" />
            </div>
            <span className="text-sm">API de integração</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <Check className="h-3 w-3 text-emerald-700 dark:text-emerald-100" />
            </div>
            <span className="text-sm">Armazenamento 500GB</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <Check className="h-3 w-3 text-emerald-700 dark:text-emerald-100" />
            </div>
            <span className="text-sm">Relatórios avançados</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1 bg-transparent border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            Cancelar Assinatura
          </Button>
          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
            Fazer Upgrade
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
