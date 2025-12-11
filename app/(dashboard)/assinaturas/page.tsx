import { LayoutWrapper } from "@/components/layout-wrapper"
import { SubscriptionPlans } from "@/components/subscription-plans"
import { CurrentPlan } from "@/components/current-plan"
import { PaymentHistory } from "@/components/payment-history"
import { BillingInfo } from "@/components/billing-info"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SubscriptionsPage() {
  return (
    <LayoutWrapper>
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Assinaturas e Planos</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Gerencie sua assinatura e forma de pagamento</p>
      </div>

      <CurrentPlan />

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="plans" className="flex-1 sm:flex-none">
            Planos
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex-1 sm:flex-none">
            Faturamento
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 sm:flex-none">
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <SubscriptionPlans />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <BillingInfo />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  )
}
