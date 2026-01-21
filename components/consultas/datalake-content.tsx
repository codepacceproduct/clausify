"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { UsageLimitIndicator } from "@/components/usage/usage-limit-indicator"
import { DataLakeSearch } from "@/components/consultas/datalake-search"
import { DataLakeResult } from "@/components/consultas/datalake-result"
import { consultCNPJ } from "@/actions/consult-cnpj"
import { toast } from "sonner"

// Mock Data for PF only
const MOCK_DATA = {
  pf: {
    type: "pf",
    name: "Carlos Eduardo Silva",
    document: "123.456.789-00",
    status: "Regular",
    birthDate: "15/05/1980",
    motherName: "Maria Silva",
    addresses: [
      { street: "Av. Paulista", number: "1000", complement: "Apto 50", neighborhood: "Bela Vista", city: "São Paulo", state: "SP", zipCode: "01310-100" },
      { street: "Rua das Flores", number: "230", complement: "", neighborhood: "Centro", city: "Campinas", state: "SP", zipCode: "13010-000" }
    ],
    phones: [
      { number: "(11) 99999-8888", type: "Móvel", isWhatsapp: true },
      { number: "(11) 3232-1111", type: "Fixo", isWhatsapp: false }
    ],
    emails: ["carlos.silva@email.com", "carlos.work@empresa.com"],
    profession: "Engenheiro de Software",
    employment: "CLT - Tech Solutions Ltda",
    income: "R$ 15.000 - R$ 20.000",
    vehicles: [
      { model: "Toyota Corolla XEi", plate: "ABC-1234", year: "2022/2023" },
      { model: "Honda HR-V EXL", plate: "XYZ-9876", year: "2020/2020" }
    ]
  }
}

export function DataLakeContent() {
  const [viewState, setViewState] = useState<"search" | "loading" | "result">("search")
  const [resultData, setResultData] = useState<any>(null)
  const [isLimitReached, setIsLimitReached] = useState(false)

  const handleUsageChange = (usage: any) => {
    if (usage) {
      const isUnlimited = usage.limit === Infinity
      const reached = !isUnlimited && usage.remaining === 0
      
      if (isLimitReached && !reached) {
        toast.success("Limite diário renovado! Você pode fazer novas consultas.")
      }
      
      setIsLimitReached(reached)
    }
  }

  const handleSearch = async (term: string, type: "pf" | "pj") => {
    setViewState("loading")
    
    if (type === "pj") {
      try {
        const data = await consultCNPJ(term)
        if (data) {
          setResultData(data)
          setViewState("result")
        } else {
          toast.error("CNPJ não encontrado ou erro na consulta.")
          setViewState("search")
        }
      } catch (error: any) {
        toast.error(error.message || "Erro ao realizar consulta.")
        setViewState("search")
      }
    } else {
      // Simulate API call for PF (keep mock for now as requested for PJ only)
      setTimeout(() => {
        setResultData(MOCK_DATA.pf)
        setViewState("result")
      }, 2000)
    }
  }

  const handleBack = () => {
    setViewState("search")
    setResultData(null)
  }

  return (
    <LayoutWrapper>
      <div className="min-h-[calc(100vh-100px)] flex flex-col justify-center gap-6">
        {viewState === "search" && (
          <div className="animate-in fade-in zoom-in-95 duration-500 w-full max-w-3xl mx-auto space-y-6">
             <UsageLimitIndicator 
                action="datalake_query" 
                title="Limite de Consultas Data Lake" 
                onUsageChange={handleUsageChange} 
             />
            <DataLakeSearch onSearch={handleSearch} disabled={isLimitReached} />
          </div>
        )}

        {viewState === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-emerald-500 font-bold text-xs">DATA</span>
              </div>
            </div>
            <p className="text-muted-foreground animate-pulse">Varrendo bases de dados...</p>
          </div>
        )}

        {viewState === "result" && resultData && (
          <DataLakeResult 
            data={resultData}
            onBack={handleBack}
          />
        )}
      </div>
    </LayoutWrapper>
  )
}
