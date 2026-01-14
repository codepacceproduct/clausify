"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ProcessSearch } from "@/components/consultas/process-search"
import { ProcessResult } from "@/components/consultas/process-result"
import { Loader2 } from "lucide-react"

// Mock Data
const MOCK_EVENTS = [
  {
    id: "1",
    date: "20/12/2025",
    description: "O juiz abriu prazo para resposta da outra parte.",
    details: "Certifico e dou fé que, nesta data, foi expedido ato ordinatório para intimar a parte ré a apresentar contestação no prazo legal de 15 (quinze) dias úteis.",
    translation: "Agora estamos aguardando a manifestação deles.",
    nextStep: "Aguardar a resposta da outra parte."
  },
  {
    id: "2",
    date: "15/12/2025",
    description: "Enviamos um documento ao tribunal.",
    details: "Petição inicial protocolada com documentos anexos comprovando a relação contratual e o inadimplemento.",
  },
  {
    id: "3",
    date: "05/12/2025",
    description: "O juiz recebeu o pedido e vai analisar.",
    details: "Conclusos para despacho. O processo foi encaminhado ao gabinete do juiz para primeira análise.",
  },
  {
    id: "4",
    date: "28/11/2025",
    description: "Protocolo inicial enviado ao processo.",
    details: "Distribuição automática realizada para a 1ª Vara Cível.",
  },
  {
    id: "5",
    date: "15/11/2025",
    description: "Caso iniciado e documentos reunidos.",
    details: "Cadastro interno realizado e documentação digitalizada.",
  }
]

export default function ProcessualPage() {
  const [viewState, setViewState] = useState<"search" | "loading" | "result">("search")
  const [searchData, setSearchData] = useState<{term: string, type: string} | null>(null)

  const handleSearch = (term: string, type: "process" | "cpf") => {
    setSearchData({ term, type })
    setViewState("loading")
    
    // Simulate API call
    setTimeout(() => {
      setViewState("result")
    }, 1500)
  }

  const handleBack = () => {
    setViewState("search")
    setSearchData(null)
  }

  return (
    <LayoutWrapper>
      <div className="min-h-[calc(100vh-100px)] flex flex-col justify-center">
        {viewState === "search" && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <ProcessSearch onSearch={handleSearch} />
          </div>
        )}

        {viewState === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-emerald-500 font-bold text-xs">JUS</span>
              </div>
            </div>
            <p className="text-muted-foreground animate-pulse">Consultando tribunais...</p>
          </div>
        )}

        {viewState === "result" && (
          <ProcessResult 
            processNumber={searchData?.term || "1234567-89.2023.1.0001"}
            title="Processo do Aluguel"
            status="Aguardando resposta da outra parte"
            events={MOCK_EVENTS}
            onBack={handleBack}
          />
        )}
      </div>
    </LayoutWrapper>
  )
}
