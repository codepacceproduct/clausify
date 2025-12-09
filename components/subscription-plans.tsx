"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, Sparkles } from "lucide-react"
import { useState } from "react"

const plans = [
  {
    id: "basic",
    name: "Básico",
    priceMonthly: 99,
    priceYearly: 990,
    description: "Ideal para pequenos escritórios",
    features: ["50 análises/mês", "1 usuário", "Suporte por email", "10GB armazenamento", "Relatórios básicos"],
    popular: false,
  },
  {
    id: "pro",
    name: "Professional",
    priceMonthly: 299,
    priceYearly: 2990,
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
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: 0,
    priceYearly: 0,
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

export function SubscriptionPlans() {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly")
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const currentPlanId = "pro" // TODO: substituir pelo plano real do usuário

  const handleCheckout = async (planId: string) => {
    setLoadingPlan(planId)
    try {
      // Placeholder para futura integração Cakto: cria sessão de checkout na nossa API
      const res = await fetch("/api/billing/cakto/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, cycle }),
      })
      if (!res.ok) throw new Error("Falha ao iniciar checkout")
      const { checkoutUrl } = await res.json().catch(() => ({ checkoutUrl: null }))
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (e) {
      console.error(e)
      alert("Não foi possível iniciar o checkout. Tente novamente.")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Escolha o Plano Ideal</h2>
        <p className="text-muted-foreground text-sm mb-6">Todos os planos incluem 14 dias de garantia</p>

        <div className="flex items-center gap-4 bg-muted/30 p-1 rounded-full border">
          <Label 
            htmlFor="billing-cycle" 
            className={`cursor-pointer px-3 py-1.5 rounded-full transition-colors ${cycle === 'monthly' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
            onClick={() => setCycle("monthly")}
          >
            Mensal
          </Label>
          <Switch
            id="billing-cycle"
            checked={cycle === "yearly"}
            onCheckedChange={(checked) => setCycle(checked ? "yearly" : "monthly")}
          />
          <Label 
            htmlFor="billing-cycle" 
            className={`cursor-pointer px-3 py-1.5 rounded-full transition-colors ${cycle === 'yearly' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
            onClick={() => setCycle("yearly")}
          >
            Anual <span className="text-xs text-emerald-600 font-medium ml-1">(Economize 2 meses)</span>
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative flex flex-col transition-all duration-200 ${
              plan.popular 
                ? "border-2 border-emerald-500 shadow-xl scale-105 z-10 bg-card" 
                : "border bg-card/50 hover:bg-card hover:shadow-md"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1 text-sm gap-1 shadow-sm h-8">
                  <Sparkles className="h-3 w-3" />
                  Mais Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{plan.description}</CardDescription>
              <div className="mt-6">
                {plan.id !== "enterprise" ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      R$ {cycle === "monthly" ? plan.priceMonthly : plan.priceYearly}
                    </span>
                    <span className="text-muted-foreground text-sm">/{cycle === "monthly" ? "mês" : "ano"}</span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-foreground">Personalizado</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mt-0.5">
                      <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.id === "enterprise" ? (
                <Button className="w-full" variant="outline">Falar com Vendas</Button>
              ) : (
                <Button
                  className={`w-full font-semibold h-11 ${
                    plan.id === currentPlanId
                      ? 'bg-emerald-500 text-white hover:bg-emerald-500 disabled:opacity-100 border-0' 
                      : (plan.popular ? "default" : "")
                  }`}
                  variant={plan.id === currentPlanId ? "default" : (plan.popular ? "default" : "outline")}
                  disabled={loadingPlan === plan.id || plan.id === currentPlanId}
                  onClick={() => plan.id !== currentPlanId ? handleCheckout(plan.id) : undefined}
                >
                  {plan.id === currentPlanId ? "Plano Atual" : (loadingPlan === plan.id ? "Carregando..." : "Selecionar Plano")}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
