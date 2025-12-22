"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarView } from "@/components/calendar-view"
import { CalendarEvents } from "@/components/calendar-events"
import { CalendarIntegrations } from "@/components/calendar-integrations"

export default function CalendarioPage() {
  const [activeTab, setActiveTab] = useState("calendario")

  return (
    <LayoutWrapper>
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">Calendário de Contratos</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Gerencie prazos, vencimentos e obrigações contratuais
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-col h-auto w-full max-w-lg sm:grid sm:grid-cols-3">
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="integracoes">Integrações</TabsTrigger>
        </TabsList>

        <TabsContent value="calendario" className="mt-6">
          <CalendarView />
        </TabsContent>

        <TabsContent value="eventos" className="mt-6">
          <CalendarEvents />
        </TabsContent>

        <TabsContent value="integracoes" className="mt-6">
          <CalendarIntegrations />
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  )
}
