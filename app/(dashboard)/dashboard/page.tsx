import { LayoutWrapper } from "@/components/layout-wrapper"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { RiskOverviewChart } from "@/components/risk-overview-chart"
import { ContractActivityChart } from "@/components/contract-activity-chart"
import { RecentContracts } from "@/components/recent-contracts"
import { RiskAlerts } from "@/components/risk-alerts"
import { WelcomeOwnerToast } from "@/components/welcome-owner-toast"

export default function DashboardPage() {
  return (
    <LayoutWrapper>
      <WelcomeOwnerToast />
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Visão geral da sua carteira de contratos</p>
      </div>

      <DashboardMetrics />

      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
        <RiskOverviewChart />
        <ContractActivityChart />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentContracts />
        </div>
        <RiskAlerts />
      </div>
    </LayoutWrapper>
  )
}
