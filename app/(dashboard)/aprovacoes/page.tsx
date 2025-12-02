"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApprovalWorkflow } from "@/components/approval-workflow"
import { ApprovalPending } from "@/components/approval-pending"
import { ApprovalHistory } from "@/components/approval-history"
import { ApprovalSettings } from "@/components/approval-settings"

export default function AprovacoesPage() {
  const [activeTab, setActiveTab] = useState("pendentes")

  return (
    <LayoutWrapper>
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">Workflow de Aprovação</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Gerencie aprovações de contratos com múltiplos níveis hierárquicos
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="workflow">Fluxos</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="configuracoes">Config.</TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes" className="mt-6">
          <ApprovalPending />
        </TabsContent>

        <TabsContent value="workflow" className="mt-6">
          <ApprovalWorkflow />
        </TabsContent>

        <TabsContent value="historico" className="mt-6">
          <ApprovalHistory />
        </TabsContent>

        <TabsContent value="configuracoes" className="mt-6">
          <ApprovalSettings />
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  )
}
