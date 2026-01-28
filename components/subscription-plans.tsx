import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Sparkles, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

import { CheckoutModal } from "@/components/checkout-modal"
import { CouponModal } from "@/components/coupon-modal"

const plans = [
  {
    name: "Starter",
    price: "R$ 99,00",
    period: "/mês",
    description: "Para você",
    credits: "50 análises",
    features: [
      { text: "50 análises/mês", included: true },
      { text: "1 usuário", included: true },
      { text: "Suporte por email", included: true },
      { text: "10GB armazenamento", included: true },
      { text: "Relatórios básicos", included: true },
      { text: "API de integração", included: false },
      { text: "Personalização", included: false },
    ],
    popular: false,
    buttonText: "Contratar plano",
  },
  {
    name: "Pro",
    price: "R$ 299,00",
    period: "/mês",
    description: "Para sua empresa ou advogados",
    credits: "Análises ilimitadas",
    features: [
      { text: "Análises ilimitadas", included: true },
      { text: "5 usuários inclusos", included: true },
      { text: "Suporte prioritário", included: true },
      { text: "500GB armazenamento", included: true },
      { text: "API de integração", included: true },
      { text: "Relatórios avançados", included: true },
      { text: "Personalização", included: false },
    ],
    popular: true,
    buttonText: "Contratar plano",
  },
  {
    name: "Office",
    price: "Pay as you go",
    period: "/mês",
    description: "Para quem vai usar a Clausify no seu workflow",
    credits: "Volume personalizado",
    features: [
      { text: "Análises ilimitadas", included: true },
      { text: "Usuários ilimitados", included: true },
      { text: "Suporte 24/7 dedicado", included: true },
      { text: "Armazenamento ilimitado", included: true },
      { text: "API completa", included: true },
      { text: "Personalização completa", included: true },
      { text: "Treinamento incluso", included: true },
    ],
    popular: false,
    buttonText: "Falar com a gente",
  },
]

export interface SubscriptionPlansProps {
  currentPlan?: string
}

export function SubscriptionPlans({ currentPlan }: SubscriptionPlansProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false)
  const [pendingPlan, setPendingPlan] = useState<string | null>(null)
  const [pixData, setPixData] = useState<{ qrCode: string; copyPaste: string; expiresAt: string } | null>(null)
  const [paymentId, setPaymentId] = useState<string>("")
  const [amount, setAmount] = useState<number>(0)
  const [invoiceUrl, setInvoiceUrl] = useState<string>("")
  const [selectedPlanName, setSelectedPlanName] = useState<string>("")
  
  const router = useRouter()

  const handleSubscribeClick = (planName: string) => {
    if (planName === "Office") {
        window.location.href = "mailto:vendas@clausify.com.br"
        return
    }
    setPendingPlan(planName)
    setIsCouponModalOpen(true)
  }

  const handleSubscribe = async (hasCoupon: boolean) => {
    if (!pendingPlan) return
    const planName = pendingPlan
    setIsCouponModalOpen(false)

    // Normalizar nome do plano para o formato da API
    let apiPlan = planName.toLowerCase()
    
    // Mapeamento dos novos nomes visuais para os IDs da API
    if (apiPlan === "starter") apiPlan = "basic"
    if (apiPlan === "pro") apiPlan = "pro" // ou "professional" dependendo do backend, mas "pro" é comum
    if (apiPlan === "office") apiPlan = "enterprise"

    try {
      setLoading(planName)
      setSelectedPlanName(planName)
      
      // Get token
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
            plan: apiPlan,
            hasCoupon: hasCoupon
        }),
      })

      if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || "Erro ao iniciar checkout")
      }
      
      const data = await res.json()

      if (data.mode === 'redirect' && data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
      }
      
      setPixData({
          qrCode: data.pixQrCode,
          copyPaste: data.pixCopyPaste,
          expiresAt: data.expiresAt
      })
      setPaymentId(data.paymentId)
      setAmount(data.amount)
      setInvoiceUrl(data.invoiceUrl)
      setIsCheckoutOpen(true)
      
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Não foi possível iniciar o checkout")
    } finally {
      setLoading(null)
      setPendingPlan(null)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        pixData={pixData}
        amount={amount}
        paymentId={paymentId}
        planName={selectedPlanName}
        invoiceUrl={invoiceUrl}
      />
      
      <CouponModal 
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onSelect={handleSubscribe}
        planName={pendingPlan || ""}
      />

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Escolha seu plano</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Selecione o plano que melhor atende às suas necessidades.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => {
          // Lógica de verificação do plano atual
          const isCurrent = 
            (currentPlan?.toLowerCase() === "basic" && plan.name === "Starter") ||
            (currentPlan?.toLowerCase() === "pro" && plan.name === "Pro") ||
            (currentPlan?.toLowerCase() === "enterprise" && plan.name === "Office") ||
            (currentPlan?.toLowerCase() === plan.name.toLowerCase())

          const isProcessing = loading === plan.name
          const isPopular = plan.popular

          return (
            <div 
              key={plan.name} 
              className={`relative flex flex-col p-6 bg-white dark:bg-zinc-900 rounded-2xl transition-all duration-200 ${
                isPopular 
                  ? "border-2 border-emerald-500 shadow-xl scale-105 z-10" 
                  : "border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    Mais popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 min-h-[40px]">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className={`font-bold text-gray-900 dark:text-white ${plan.price.length > 10 ? "text-3xl" : "text-4xl"}`}>
                    {plan.price}
                  </span>
                  {plan.price !== "Pay as you go" && (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{plan.period}</span>
                  )}
                </div>
                {plan.credits && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                    {plan.credits}
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${feature.included ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-600"}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribeClick(plan.name)}
                disabled={isCurrent || isProcessing}
                className={`w-full h-11 rounded-lg font-semibold transition-all ${
                  isPopular
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg"
                    : "bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : isCurrent ? (
                  "Plano Atual"
                ) : (
                  plan.buttonText
                )}
              </Button>
            </div>
          )
        })}
      </div>

      {currentPlan === "Free" && (
        <div className="mt-12 text-center">
          <Button variant="outline" className="border-gray-200 text-gray-500 hover:text-gray-900">
            Manter plano atual (Free)
          </Button>
        </div>
      )}
    </div>
  )
}
