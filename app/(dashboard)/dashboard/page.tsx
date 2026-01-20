import { Suspense } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { RecentContracts } from "@/components/recent-contracts"
import { RiskAlerts } from "@/components/risk-alerts"
import { RiskOverviewWrapper } from "@/components/dashboard/risk-overview-wrapper"
import { ActivityDataWrapper } from "@/components/dashboard/activity-data-wrapper"
import { 
  DashboardMetricsSkeleton, 
  ChartSkeleton, 
  RecentContractsSkeleton, 
  RiskAlertsSkeleton 
} from "@/components/dashboard/skeletons"

export default function DashboardPage() {
  return (
    <LayoutWrapper>
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Visão geral da sua carteira de contratos</p>
      </div>

      <Suspense fallback={<DashboardMetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <RiskOverviewWrapper />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <ActivityDataWrapper />
        </Suspense>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Suspense fallback={<RecentContractsSkeleton />}>
            <RecentContracts />
          </Suspense>
        </div>
        <Suspense fallback={<RiskAlertsSkeleton />}>
          <RiskAlerts />
        </Suspense>
      </div>
    </LayoutWrapper>
  )
}
