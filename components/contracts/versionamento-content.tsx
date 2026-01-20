"use client"

import { useState, useEffect } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VersionHistory } from "@/components/version-history"
import { VersionDiff } from "@/components/version-diff"
import { VersionTimeline } from "@/components/version-timeline"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Loader2 } from "lucide-react"

interface VersionamentoContentProps {
  initialContracts: any[]
  initialVersions?: any[]
  initialContractId?: string
}

export function VersionamentoContent({ 
  initialContracts = [], 
  initialVersions = [],
  initialContractId
}: VersionamentoContentProps) {
  const [activeTab, setActiveTab] = useState("historico")
  const [contracts, setContracts] = useState<any[]>(initialContracts)
  const [selectedContractId, setSelectedContractId] = useState<string>(initialContractId || (initialContracts.length > 0 ? initialContracts[0].id : ""))
  
  // Update selected contract if initialContractId changes (e.g. navigation)
  useEffect(() => {
    if (initialContractId) {
      setSelectedContractId(initialContractId)
    } else if (contracts.length > 0 && !selectedContractId) {
      setSelectedContractId(contracts[0].id)
    }
  }, [initialContractId, contracts, selectedContractId])

  // If selected contract matches initialContractId, we can pass initialVersions
  const versionsToPass = selectedContractId === initialContractId ? initialVersions : []

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Versionamento de Contratos</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Controle de versões com histórico completo e comparação visual de diferenças
            </p>
          </div>
        </div>

        {/* Contract Selector */}
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
              <FileText className="h-5 w-5" />
              <span className="text-sm font-medium">Selecionar Contrato:</span>
            </div>
            <Select value={selectedContractId} onValueChange={setSelectedContractId}>
              <SelectTrigger className="w-full sm:w-[400px]">
                <SelectValue placeholder="Selecione um contrato" />
              </SelectTrigger>
              <SelectContent>
                {contracts.map((contract) => (
                  <SelectItem key={contract.id} value={contract.id}>
                    {contract.name || contract.client_name || "Sem título"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedContractId ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              <TabsTrigger value="comparar">Comparar Versões</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="historico" className="mt-6">
              <VersionHistory 
                contractId={selectedContractId} 
                initialData={versionsToPass}
              />
            </TabsContent>

            <TabsContent value="comparar" className="mt-6">
              <VersionDiff 
                contractId={selectedContractId} 
                initialVersions={versionsToPass}
              />
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <VersionTimeline contractId={selectedContractId} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Selecione um contrato para visualizar o versionamento.</p>
          </div>
        )}
      </div>
    </LayoutWrapper>
  )
}
