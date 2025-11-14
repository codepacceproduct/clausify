import { LayoutWrapper } from "@/components/layout-wrapper"
import { VersionComparator } from "@/components/version-comparator"
import { ComparisonHistory } from "@/components/comparison-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ComparatorPage() {
  return (
    <LayoutWrapper>
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Comparador de Versões</h1>
        <p className="text-muted-foreground mt-1">Compare diferentes versões de contratos lado a lado</p>
      </div>

      <Tabs defaultValue="compare" className="w-full">
        <TabsList>
          <TabsTrigger value="compare">Nova Comparação</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="compare" className="space-y-6">
          <VersionComparator />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <ComparisonHistory />
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  )
}
