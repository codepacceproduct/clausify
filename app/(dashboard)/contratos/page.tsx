"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ContractUpload } from "@/components/contract-upload"
import { ContractHistory } from "@/components/contract-history"
import { ContractAnalysisResult } from "@/components/contract-analysis-result"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle2, FileText, BrainCircuit } from "lucide-react"

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [viewState, setViewState] = useState<"idle" | "processing" | "result">("idle")
  const [processingStep, setProcessingStep] = useState(0)
  const [currentContract, setCurrentContract] = useState<{ id: string, content: string } | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const handleAnalysisStart = async (contractId: string, content: string) => {
    setCurrentContract({ id: contractId, content })
    setViewState("processing")
    setProcessingStep(0)
    
    // Trigger real analysis
    try {
        const processingSteps = [
            "Lendo documento...",
            "Identificando cláusulas...",
            "Analisando riscos jurídicos...",
            "Verificando conformidade...",
            "Gerando sugestões...",
            "Finalizando relatório..."
        ]

        // Start animation loop
        let currentStep = 0
        const interval = setInterval(() => {
            if (currentStep < processingSteps.length - 1) {
                currentStep++
                setProcessingStep(currentStep)
            }
        }, 2000) // Slower animation to match real API time

        const response = await fetch("/api/contracts/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contractId, content })
        })

        clearInterval(interval)
        
        if (!response.ok) throw new Error("Analysis failed")
        
        const result = await response.json()
        setAnalysisResult(result)
        
        // Ensure we show the last step before finishing
        setProcessingStep(processingSteps.length - 1)
        setTimeout(() => {
            setViewState("result")
        }, 500)

    } catch (error) {
        console.error("Analysis failed:", error)
        setViewState("idle") // Or show error state
        // Add toast error here
    }
  }

  const handleReset = () => {
    setViewState("idle")
    setActiveTab("upload")
    setAnalysisResult(null)
    setCurrentContract(null)
  }

  return (
    <LayoutWrapper>
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Análise de Contratos</h1>
        <p className="text-muted-foreground mt-1">Faça upload e analise contratos com IA jurídica</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="upload" disabled={viewState !== "idle"}>Nova Análise</TabsTrigger>
          <TabsTrigger value="history" disabled={viewState !== "idle"}>Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6 mt-6">
          {viewState === "idle" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ContractUpload onAnalysisStart={handleAnalysisStart} />
            </div>
          )}

          {viewState === "processing" && (
            <div className="flex flex-col items-center justify-center min-h-[500px] animate-in fade-in zoom-in-95 duration-500">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
                    <div className="relative bg-background p-6 rounded-full border shadow-lg">
                        <BrainCircuit className="h-16 w-16 text-emerald-600 animate-pulse" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Analisando Contrato</h2>
                <p className="text-muted-foreground mb-8 text-center max-w-md">
                   Nossa IA está lendo cada cláusula para identificar riscos e oportunidades de melhoria.
                </p>

                <div className="w-full max-w-md space-y-4">
                    {[
                        "Lendo documento...",
                        "Identificando cláusulas...",
                        "Analisando riscos jurídicos...",
                        "Verificando conformidade...",
                        "Gerando sugestões...",
                        "Finalizando relatório..."
                    ].map((step, index) => (
                        <div key={index} className="flex items-center gap-3">
                            {index < processingStep ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : index === processingStep ? (
                                <Loader2 className="h-5 w-5 text-emerald-600 animate-spin" />
                            ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-muted" />
                            )}
                            <span className={`text-sm ${index <= processingStep ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                {step}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {viewState === "result" && (
            <ContractAnalysisResult result={analysisResult} onReset={handleReset} />
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-6">
          <ContractHistory />
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  )
}
