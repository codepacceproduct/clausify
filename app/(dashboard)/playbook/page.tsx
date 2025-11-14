import { LayoutWrapper } from "@/components/layout-wrapper"
import { PlaybookLibrary } from "@/components/playbook-library"
import { PlaybookTemplates } from "@/components/playbook-templates"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PlaybookPage() {
  return (
    <LayoutWrapper>
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Playbook Jurídico</h1>
        <p className="text-muted-foreground mt-1">Biblioteca de cláusulas e templates aprovados</p>
      </div>

      <Tabs defaultValue="clauses" className="w-full">
        <TabsList>
          <TabsTrigger value="clauses">Cláusulas Padrão</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="fallbacks">Fallback Clauses</TabsTrigger>
        </TabsList>

        <TabsContent value="clauses" className="space-y-6">
          <PlaybookLibrary />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <PlaybookTemplates />
        </TabsContent>

        <TabsContent value="fallbacks" className="space-y-6">
          <div className="text-center py-12 text-muted-foreground">Cláusulas de fallback serão exibidas aqui</div>
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  )
}
