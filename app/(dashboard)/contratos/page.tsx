import { LayoutWrapper } from "@/components/layout-wrapper"
import { ContractUpload } from "@/components/contract-upload"
import { ContractAnalysis } from "@/components/contract-analysis"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ContractsPage() {
  return (
    <LayoutWrapper>
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Análise de Contratos</h1>
        <p className="text-muted-foreground mt-1">Faça upload e analise contratos com IA jurídica</p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList>
          <TabsTrigger value="upload">Novo Upload</TabsTrigger>
          <TabsTrigger value="analysis">Análise em Andamento</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <ContractUpload />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <ContractAnalysis />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="text-center py-12 text-muted-foreground">Histórico de análises será exibido aqui</div>
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  )
}
