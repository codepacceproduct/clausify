import { LayoutWrapper } from "@/components/layout-wrapper"
import { 
  DashboardMetricsSkeleton, 
  ChartSkeleton, 
  RecentContractsSkeleton, 
  RiskAlertsSkeleton 
} from "@/components/dashboard/skeletons"

export default function DashboardLoading() {
  return (
    <LayoutWrapper>
      <div className="space-y-1">
        <div className="h-9 w-48 bg-muted animate-pulse rounded-md" />
        <div className="h-5 w-72 bg-muted animate-pulse rounded-md mt-2" />
      </div>

      <DashboardMetricsSkeleton />

      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentContractsSkeleton />
        </div>
        <RiskAlertsSkeleton />
      </div>
    </LayoutWrapper>
  )
}
