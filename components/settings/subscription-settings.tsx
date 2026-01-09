"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CurrentPlan } from "@/components/current-plan"
import { SubscriptionPlans } from "@/components/subscription-plans"
import { BillingInfo, BillingDetails } from "@/components/billing-info"
import { PaymentHistory, Payment } from "@/components/payment-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, History, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface SubscriptionData {
  plan: string
  status: string
  amount: number
  interval: string
  current_period_end: string
  role: string
}

export function SubscriptionSettings() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subtab = searchParams.get("subtab") || "overview"

  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [invoices, setInvoices] = useState<Payment[]>([])
  const [billing, setBilling] = useState<BillingDetails | undefined>(undefined)

  const setSubtab = (val: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("subtab", val)
    router.replace(`?${params.toString()}`)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/subscription")
        if (!res.ok) throw new Error("Falha ao carregar assinatura")
        const data = await res.json()
        setSubscription(data.subscription)
        setInvoices(data.invoices.map((inv: any) => ({
          id: inv.id || "INV-???",
          date: inv.date || new Date().toISOString(),
          amount: inv.amount ? `R$ ${inv.amount}` : "R$ 0,00",
          status: inv.status || "pending",
          method: inv.method
        })))
        setBilling(data.billing)
      } catch (error) {
        console.error(error)
        toast.error("Erro ao carregar informações da assinatura")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  const latestInvoice = invoices.length > 0 ? invoices[0] : null

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Assinatura e Cobrança</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie seu plano, método de pagamento e visualize seu histórico.
        </p>
      </div>

      <Tabs value={subtab} onValueChange={setSubtab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="billing">Faturamento</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <CurrentPlan 
            plan={subscription?.plan || "Free"} 
            status={subscription?.status || "active"} 
            amount={subscription?.amount ? `R$ ${subscription.amount},00` : "R$ 0,00"} 
            interval={subscription?.interval || "month"}
            nextBillingDate={subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString('pt-BR') : "N/A"}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Método de Pagamento
                </CardTitle>
                <CardDescription>
                  Cartão principal para cobrança
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-16 bg-muted rounded flex items-center justify-center text-xs font-semibold">
                    VISA
                  </div>
                  <div>
                    <p className="text-sm font-medium">**** **** **** 4242</p>
                    <p className="text-xs text-muted-foreground">Expira em 12/28</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Última Fatura
                </CardTitle>
                <CardDescription>
                  {latestInvoice ? `Emitida em ${new Date(latestInvoice.date).toLocaleDateString('pt-BR')}` : "Nenhuma fatura encontrada"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {latestInvoice ? (
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{latestInvoice.amount}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${latestInvoice.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100' : 'bg-yellow-100 text-yellow-700'}`}>
                      {latestInvoice.status === 'paid' ? 'Paga' : latestInvoice.status}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Sem histórico recente</div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <PaymentHistory payments={invoices} />
        </TabsContent>

        <TabsContent value="plans" className="space-y-6 mt-6">
          <SubscriptionPlans currentPlan={subscription?.plan} />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 mt-6">
          <BillingInfo billing={billing} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
