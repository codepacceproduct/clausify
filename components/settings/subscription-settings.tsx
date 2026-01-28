"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CurrentPlan } from "@/components/current-plan"
import { SubscriptionPlans } from "@/components/subscription-plans"
import { BillingInfo, BillingDetails } from "@/components/billing-info"
import { PaymentHistory, Payment } from "@/components/payment-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreditCard, History, Loader2, AlertTriangle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getAuthToken } from "@/lib/auth"
import { createClient } from "@/lib/supabase/client"

interface SubscriptionData {
  plan: string
  status: string
  amount: number
  interval: string
  current_period_end: string
  role: string
  pending_plan?: string
}

export function SubscriptionSettings() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subtab = searchParams.get("subtab") || "overview"

  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [invoices, setInvoices] = useState<Payment[]>([])
  const [billing, setBilling] = useState<BillingDetails | undefined>(undefined)
  
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const setSubtab = (val: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("subtab", val)
    router.replace(`?${params.toString()}`)
  }

  const handleCancelSubscription = async () => {
    setIsCancelling(true)
    try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token

        const res = await fetch("/api/subscription", {
            method: "DELETE",
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        
        if (!res.ok) throw new Error("Erro ao cancelar assinatura")
        
        toast.success("Assinatura cancelada com sucesso. Você agora está no plano Free.")
        setShowCancelDialog(false)
        
        // Update local state immediately for better UX
        setSubscription(prev => prev ? { ...prev, plan: "free", status: "active", amount: 0 } : null)
        
        // Refresh full data
        router.refresh()
        window.location.reload()
    } catch (error) {
        console.error(error)
        toast.error("Não foi possível cancelar a assinatura")
    } finally {
        setIsCancelling(false)
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token

        const res = await fetch("/api/subscription", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          cache: "no-store",
        })
        
        if (res.status === 404 || res.status === 401) {
          // Sem organização, assumir plano basic padrão
          setSubscription({
            plan: "basic",
            status: "active",
            amount: 0,
            interval: "month",
            current_period_end: new Date().toISOString(),
            role: "owner"
          })
          return
        }

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
        // toast.error("Erro ao carregar informações da assinatura")
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
            pendingPlan={subscription?.pending_plan}
            onCancel={() => setShowCancelDialog(true)}
            onUpgrade={() => setSubtab("plans")}
          />
          
          {/* Removido histórico de pagamento e detalhes de faturamento conforme solicitado */}
        </TabsContent>

        <TabsContent value="plans" className="space-y-6 mt-6">
          <SubscriptionPlans currentPlan={subscription?.plan} />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento da Assinatura</CardTitle>
              <CardDescription>Opções avançadas para sua assinatura ativa.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
               <div>
                  <p className="font-medium">Cancelar Assinatura</p>
                  <p className="text-sm text-muted-foreground">Ao cancelar, você perderá acesso aos recursos premium ao fim do ciclo atual.</p>
               </div>
               <Button variant="destructive" onClick={() => setShowCancelDialog(true)}>
                  Cancelar Assinatura
               </Button>
            </CardContent>
          </Card>

          <BillingInfo billing={billing} />
          <PaymentHistory payments={invoices} />
        </TabsContent>
      </Tabs>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Cancelar Assinatura
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos recursos premium imediatamente e voltará para o plano Free.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)} disabled={isCancelling}>
              Manter Assinatura
            </Button>
            <Button variant="destructive" onClick={handleCancelSubscription} disabled={isCancelling}>
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelando...
                </>
              ) : (
                "Confirmar Cancelamento"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
