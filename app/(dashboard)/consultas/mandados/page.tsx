"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { WarrantsSearch } from "@/components/consultas/warrants-search"
import { WarrantsResult } from "@/components/consultas/warrants-result"
import { Siren } from "lucide-react"

export default function WarrantsPage() {
  const [viewState, setViewState] = useState<"search" | "loading" | "result">("search")

  const handleSearch = (data: any) => {
    setViewState("loading")
    // Simulate API delay
    setTimeout(() => {
      setViewState("result")
    }, 2000)
  }

  const handleBack = () => {
    setViewState("search")
  }

  return (
    <LayoutWrapper>
      <div className="min-h-[calc(100vh-100px)] flex flex-col justify-center">
        {viewState === "search" && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <WarrantsSearch onSearch={handleSearch} />
          </div>
        )}

        {viewState === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Siren className="h-8 w-8 text-emerald-500 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Consultando BNMP</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Verificando mandados de prisão em aberto no Banco Nacional...
              </p>
            </div>
          </div>
        )}

        {viewState === "result" && (
          <WarrantsResult onBack={handleBack} />
        )}
      </div>
    </LayoutWrapper>
  )
}
