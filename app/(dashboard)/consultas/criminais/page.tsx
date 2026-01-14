"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { CriminalSearch } from "@/components/consultas/criminal-search"
import { CriminalResult } from "@/components/consultas/criminal-result"
import { ShieldAlert } from "lucide-react"

// Mock Data
const MOCK_CLEAN = {
  status: "clean" as const,
  name: "Carlos Eduardo Silva",
  document: "123.456.789-00",
  records: [],
  lastCheck: new Date().toLocaleString()
}

const MOCK_POSITIVE = {
  status: "positive" as const,
  name: "João da Silva (Homônimo)",
  document: "987.654.321-99",
  lastCheck: new Date().toLocaleString(),
  records: [
    {
      source: "TJSP",
      court: "1ª Vara Criminal da Capital",
      processNumber: "1500234-56.2020.8.26.0050",
      type: "Ação Penal - Procedimento Ordinário",
      status: "Em andamento",
      date: "15/03/2020",
      details: "Art. 157 - Roubo majorado. Denúncia recebida, aguardando audiência de instrução e julgamento.",
      severity: "high" as const
    },
    {
      source: "Polícia Federal",
      court: "Superintendência Regional SP",
      type: "Inquérito Policial",
      status: "Arquivado",
      date: "10/05/2018",
      details: "Investigação sobre crimes contra o sistema financeiro. Arquivado por falta de provas.",
      severity: "medium" as const
    }
  ]
}

export default function CriminalPage() {
  const [viewState, setViewState] = useState<"search" | "loading" | "result">("search")
  const [resultData, setResultData] = useState<any>(null)

  const handleSearch = (data: { term: string, type: string }) => {
    setViewState("loading")
    
    // Simulate API call logic
    // If term ends with "99" or contains "crime", show positive result
    // Otherwise show clean result
    const isPositive = data.term.includes("99") || data.term.toLowerCase().includes("crime")
    
    setTimeout(() => {
      setResultData(isPositive ? {
        ...MOCK_POSITIVE,
        name: data.type === "name" ? data.term : MOCK_POSITIVE.name,
        document: data.type === "cpf" ? data.term : MOCK_POSITIVE.document
      } : {
        ...MOCK_CLEAN,
        name: data.type === "name" ? data.term : MOCK_CLEAN.name,
        document: data.type === "cpf" ? data.term : MOCK_CLEAN.document
      })
      setViewState("result")
    }, 2500)
  }

  const handleBack = () => {
    setViewState("search")
    setResultData(null)
  }

  return (
    <LayoutWrapper>
      <div className="min-h-[calc(100vh-100px)] flex flex-col justify-center">
        {viewState === "search" && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <CriminalSearch onSearch={handleSearch} />
          </div>
        )}

        {viewState === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-4 border-slate-200 border-t-emerald-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldAlert className="h-8 w-8 text-emerald-600 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Consultando Bases Criminais</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Verificando mandados, antecedentes e processos em tribunais de todo o país...
              </p>
            </div>
          </div>
        )}

        {viewState === "result" && resultData && (
          <CriminalResult 
            data={resultData}
            onBack={handleBack}
          />
        )}
      </div>
    </LayoutWrapper>
  )
}
