import { LayoutWrapper } from "@/components/layout-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <LayoutWrapper>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <Skeleton className="h-9 w-48" />
          </div>
          <div className="hidden space-y-6 pb-16 md:block">
            <div className="space-y-0.5">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <div className="flex-1 lg:max-w-7xl mx-auto w-full">
                {/* Settings Nav */}
                <div className="mb-8 flex space-x-2 overflow-x-auto">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-24" />
                    ))}
                </div>
                
                {/* Content */}
                <div className="space-y-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-px w-full" />
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full max-w-sm" />
                        <Skeleton className="h-10 w-full max-w-sm" />
                        <Skeleton className="h-32 w-full max-w-xl" />
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
