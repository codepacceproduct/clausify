"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { PlaybookLibrary } from "@/components/playbook-library"
import { PlaybookTemplates } from "@/components/playbook-templates"
import { PlaybookFallbacks } from "@/components/playbook-fallbacks"
import { PlaybookRules } from "@/components/playbook-rules"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PlaybookPage() {
  const [activeTab, setActiveTab] = useState("rules")

  return (
    <LayoutWrapper>
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Playbook Jurídico</h1>
        <p className="text-muted-foreground mt-1">Gerencie as regras de análise da IA e sua biblioteca de contratos</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="rules">Minhas Regras</TabsTrigger>
          <TabsTrigger value="clauses">Cláusulas Padrão</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="fallbacks">Fallback Clauses</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          <PlaybookRules />
        </TabsContent>

        <TabsContent value="clauses" className="space-y-6">
          <PlaybookLibrary />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <PlaybookTemplates />
        </TabsContent>

        <TabsContent value="fallbacks" className="space-y-6">
          <PlaybookFallbacks />
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  )
}
