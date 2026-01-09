"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VersionHistory } from "@/components/version-history"
import { VersionDiff } from "@/components/version-diff"
import { VersionTimeline } from "@/components/version-timeline"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Loader2 } from "lucide-react"

export default function VersionamentoPage() {
  return (
    <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
      <VersionamentoContent />
    </Suspense>
  )
}

function VersionamentoContent() {
  const searchParams = useSearchParams()
  const contractIdParam = searchParams.get("contractId")

  const [activeTab, setActiveTab] = useState("historico")
  const [contracts, setContracts] = useState<any[]>([])
  const [selectedContractId, setSelectedContractId] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContracts()
  }, [])

  async function fetchContracts() {
    try {
      const res = await fetch("/api/contracts/list")
      if (res.ok) {
        const data = await res.json()
        const list = data.contracts || []
        setContracts(list)
        
        if (contractIdParam && list.some((c: any) => c.id === contractIdParam)) {
          setSelectedContractId(contractIdParam)
        } else if (list.length > 0) {
          setSelectedContractId(list[0].id)
        }
      }
    } catch (error) {
      console.error("Failed to fetch contracts", error)
    } finally {
      setLoading(false)
    }
  }

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
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
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
            )}
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
              <VersionHistory contractId={selectedContractId} />
            </TabsContent>

            <TabsContent value="comparar" className="mt-6">
              <VersionDiff contractId={selectedContractId} contracts={contracts} />
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
