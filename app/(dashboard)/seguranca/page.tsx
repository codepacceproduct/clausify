import { LayoutWrapper } from "@/components/layout-wrapper"
import { SecurityOverview } from "@/components/security-overview"
import { AuditLogs } from "@/components/audit-logs"
import { AccessControl } from "@/components/access-control"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SecurityPage() {
  return (
    <LayoutWrapper>
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Segurança e Logs</h1>
        <p className="text-muted-foreground mt-1">Monitoramento de atividades e controle de acesso</p>
      </div>

      {/* Overview */}
      <SecurityOverview />

      <Tabs defaultValue="logs" className="w-full">
        <TabsList>
          <TabsTrigger value="logs">Logs de Auditoria</TabsTrigger>
          <TabsTrigger value="access">Controle de Acesso</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          <AuditLogs />
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <AccessControl />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="text-center py-12 text-muted-foreground">Configurações de segurança serão exibidas aqui</div>
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  )
}
