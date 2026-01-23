import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, ArrowUpRight } from "lucide-react"

export interface CurrentPlanProps {
  plan: string
  status: string
  amount: string
  interval: string
  nextBillingDate: string
  onCancel?: () => void
  onUpgrade?: () => void
}

export function CurrentPlan({ plan, status, amount, interval, nextBillingDate, onCancel, onUpgrade }: CurrentPlanProps) {
  const isFree = plan.toLowerCase() === "free"
  
  // Mapeamento de nomes de exibição
  const displayMap: Record<string, string> = {
    free: "Free",
    basic: "Starter",
    starter: "Starter",
    básico: "Starter",
    pro: "Pro",
    professional: "Pro",
    enterprise: "Office",
    office: "Office"
  }
  
  const displayPlan = displayMap[plan.toLowerCase()] || plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();

  // Definição das permissões por plano
  const planFeatures: Record<string, string[]> = {
    free: [
      "5 mensagens ClausiChat/dia",
      "5 consultas processuais/dia",
      "Acesso limitado a calculadoras",
      "1 usuário",
      "Sem suporte"
    ],
    basic: [
      "50 análises/mês",
      "1 usuário", 
      "Suporte por email",
      "10GB armazenamento",
      "Relatórios básicos"
    ],
    básico: [ // Alias para basic (nome de exibição)
      "50 análises/mês",
      "1 usuário", 
      "Suporte por email",
      "10GB armazenamento",
      "Relatórios básicos"
    ],
    starter: [ // Alias para basic se necessário
      "50 análises/mês",
      "1 usuário", 
      "Suporte por email",
      "10GB armazenamento",
      "Relatórios básicos"
    ],
    professional: [
      "Análises ilimitadas",
      "5 usuários inclusos",
      "Suporte prioritário",
      "500GB armazenamento",
      "API de integração",
      "Relatórios avançados"
    ],
    pro: [ // Alias para professional
      "Análises ilimitadas",
      "5 usuários inclusos",
      "Suporte prioritário",
      "500GB armazenamento",
      "API de integração",
      "Relatórios avançados"
    ],
    office: [
      "Análises ilimitadas",
      "Usuários ilimitados",
      "Suporte 24/7 dedicado",
      "Armazenamento ilimitado",
      "API completa",
      "Personalização completa",
      "Treinamento incluso"
    ],
    enterprise: [ // Alias antigo mantido por compatibilidade
      "Análises ilimitadas",
      "Usuários ilimitados",
      "Suporte 24/7 dedicado",
      "Armazenamento ilimitado",
      "API completa",
      "Personalização completa",
      "Treinamento incluso"
    ]
  };

  const currentFeatures = planFeatures[plan.toLowerCase()] || planFeatures['free'];

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-xl sm:text-2xl">Plano {displayPlan}</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100">
                {status === 'active' ? 'Ativo' : status}
              </Badge>
            </div>
            <CardDescription className="text-sm sm:text-base">
              {isFree ? "Plano gratuito sem cobrança" : `Próxima cobrança em ${nextBillingDate}`}
            </CardDescription>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{amount}</div>
            <div className="text-sm text-muted-foreground">por {interval === 'month' ? 'mês' : 'ano'}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {currentFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Check className="h-3 w-3 text-green-700 dark:text-green-100" />
              </div>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {!isFree && (
            <Button variant="outline" className="flex-1 bg-transparent border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950/50" onClick={onCancel}>
              Cancelar Assinatura
            </Button>
          )}
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={onUpgrade}>
            {isFree ? "Fazer Upgrade" : "Alterar Plano"}
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
