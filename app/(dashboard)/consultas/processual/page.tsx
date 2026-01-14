"use client"

import { useState, useEffect } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ProcessSearch } from "@/components/consultas/process-search"
import { ProcessResult } from "@/components/consultas/process-result"
import { consultDataJud } from "@/actions/datajud-consult"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

export default function ProcessualPage() {
  const [viewState, setViewState] = useState<"search" | "loading" | "result">("search")
  const [searchData, setSearchData] = useState<{term: string, type: string} | null>(null)
  const [resultData, setResultData] = useState<any>(null)
  
  const searchParams = useSearchParams()
  const queryTerm = searchParams.get("q")

  const handleSearch = async (term: string, type: "process" | "cpf") => {
    setSearchData({ term, type })
    setViewState("loading")
    
    try {
      const data = await consultDataJud(term, type)
      if (data) {
        setResultData(data)
        setViewState("result")
        toast.success("Consulta realizada e monitoramento ativado.")
      } else {
        toast.error("Processo não encontrado ou erro na consulta.")
        setViewState("search")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao realizar consulta.")
      setViewState("search")
    }
  }

  useEffect(() => {
    if (queryTerm && viewState === "search") {
      // Auto-trigger search if query param exists
      handleSearch(queryTerm, "process")
    }
  }, [queryTerm])

  const handleBack = () => {
    setViewState("search")
    setSearchData(null)
    setResultData(null)
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

        {viewState === "result" && resultData && (
          <ProcessResult 
            processNumber={resultData.processNumber}
            title={resultData.title}
            status={resultData.status}
            events={resultData.events}
            documents={resultData.documents}
            onBack={handleBack}
          />
        )}
      </div>
    </LayoutWrapper>
  )
}
