"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VersionHistory } from "@/components/version-history"
import { VersionDiff } from "@/components/version-diff"
import { VersionTimeline } from "@/components/version-timeline"

export default function VersionamentoPage() {
  const [activeTab, setActiveTab] = useState("historico")

  return (
    <LayoutWrapper>
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Versionamento de Contratos</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Controle de versões com histórico completo e comparação visual de diferenças
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-col h-auto w-full max-w-lg sm:grid sm:grid-cols-3">
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="comparar">Comparar Versões</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="historico" className="mt-6">
          <VersionHistory />
        </TabsContent>

        <TabsContent value="comparar" className="mt-6">
          <VersionDiff />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <VersionTimeline />
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  )
}
