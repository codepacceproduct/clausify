import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const plans = [
  {
    name: "Free",
    price: "R$ 0,00",
    description: "Para testar e conhecer",
    features: [
      "5 mensagens ClausiChat/dia",
      "5 consultas processuais/dia",
      "Acesso limitado a calculadoras",
      "1 usuário",
      "Sem suporte",
    ],
    popular: false,
  },
  {
    name: "Básico",
    price: "R$ 99,00",
    description: "Ideal para pequenos escritórios",
    features: ["50 análises/mês", "1 usuário", "Suporte por email", "10GB armazenamento", "Relatórios básicos"],
    popular: false,
  },
  {
    name: "Professional",
    price: "R$ 299,00",
    description: "Perfeito para equipes médias",
    features: [
      "Análises ilimitadas",
      "5 usuários inclusos",
      "Suporte prioritário",
      "500GB armazenamento",
      "API de integração",
      "Relatórios avançados",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    description: "Soluções para grandes empresas",
    features: [
      "Análises ilimitadas",
      "Usuários ilimitados",
      "Suporte 24/7 dedicado",
      "Armazenamento ilimitado",
      "API completa",
      "Personalização completa",
      "Treinamento incluso",
    ],
    popular: false,
  },
]

export interface SubscriptionPlansProps {
  currentPlan?: string
}

export function SubscriptionPlans({ currentPlan }: SubscriptionPlansProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleSubscribe = async (planName: string) => {
    // Normalizar nome do plano para o formato da API
    // "Básico" -> "basic"
    // "Professional" -> "professional"
    // "Enterprise" -> "enterprise"
    let apiPlan = planName.toLowerCase()
    if (apiPlan === "básico") apiPlan = "basic"

    try {
      setLoading(planName)
      
      // Get token
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ plan: apiPlan }),
      })

      if (!res.ok) throw new Error("Erro ao atualizar plano")
      
      toast.success(`Plano alterado para ${planName}`)
      router.refresh()
      // Opcional: recarregar a página completa para garantir atualização de estado global se houver
      window.location.reload()
    } catch (error) {
      console.error(error)
      toast.error("Não foi possível atualizar o plano")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Escolha o Plano Ideal</h2>
        <p className="text-muted-foreground text-sm">Todos os planos incluem 14 dias de garantia</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {plans.map((plan) => {
          const isCurrent = (currentPlan?.toLowerCase() === "basic" && plan.name === "Básico") || 
                            (currentPlan?.toLowerCase() === plan.name.toLowerCase())
          const isProcessing = loading === plan.name
          
          return (
          <Card key={plan.name} className={plan.popular ? "border-2 border-blue-500 relative shadow-lg" : ""}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-500 text-white gap-1">
                  <Sparkles className="h-3 w-3" />
                  Mais Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl sm:text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.price !== "Personalizado" && <span className="text-muted-foreground text-sm">/mês</span>}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mt-0.5">
                      <Check className="h-3 w-3 text-green-700 dark:text-green-100" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"} 
                disabled={isCurrent || isProcessing}
                onClick={() => handleSubscribe(plan.name)}
              >
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCurrent
                  ? "Plano Atual"
                  : plan.price === "Personalizado"
                    ? "Falar com Vendas"
                    : "Selecionar Plano"}
              </Button>
            </CardFooter>
          </Card>
        )})}
      </div>
    </div>
  )
}
