import { LayoutWrapper } from "@/components/layout-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

export default function PlaybookLoading() {
  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Tabs List */}
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
        </div>

        {/* Content Area */}
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-full md:w-1/3" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full rounded-xl" />
                ))}
            </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
