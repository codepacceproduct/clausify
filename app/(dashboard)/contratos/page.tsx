"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ContractUpload } from "@/components/contract-upload"
import { ContractHistoryList } from "@/components/contract-history"
import { ContractAnalysisResult } from "@/components/contract-analysis-result"
import { ContractAnalysisPreview } from "@/components/contract-analysis-preview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, FileText, BrainCircuit, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [viewState, setViewState] = useState<"idle" | "processing" | "result">("idle")
  const [processingStep, setProcessingStep] = useState(0)
  const [currentContract, setCurrentContract] = useState<{ id: string, content: string, filename: string } | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [historyKey, setHistoryKey] = useState(0)
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [contractToDelete, setContractToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleAnalysisStart = async (contractId: string, content: string, filename: string) => {
    setCurrentContract({ id: contractId, content, filename })
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

  const handlePreview = () => {
    setViewState("preview")
  }

  const handleHistorySelect = async (contractId: string) => {
    const toastId = toast.loading("Carregando contrato...")
    try {
        // First try to get contract details for filename
        let filename = "Contrato"
        let fetchedContent = ""
        let fetchedAnalysis = null

        try {
            const cRes = await fetch(`/api/contracts/${contractId}`)
            if (cRes.ok) {
                const cData = await cRes.json()
                filename = cData.name || filename
                fetchedContent = cData.content
                fetchedAnalysis = cData.analysis
            }
        } catch (e) {
            console.error("Failed to fetch basic info", e)
        }

        const res = await fetch(`/api/contracts/${contractId}/versions`)
        if (res.ok) {
            const versions = await res.json()
            if (versions && versions.length > 0) {
                const latest = versions[0]
                // Prefer latest version content/analysis
                setCurrentContract({ id: contractId, content: latest.content || fetchedContent || "", filename })
                setAnalysisResult(latest.analysis || fetchedAnalysis)
                setViewState("preview")
                setActiveTab("upload") 
                toast.dismiss(toastId)
            } else {
                // Fallback if no versions
                 if (fetchedContent) {
                    setCurrentContract({ id: contractId, content: fetchedContent, filename })
                    setAnalysisResult(fetchedAnalysis)
                    setViewState("preview")
                    setActiveTab("upload")
                    toast.dismiss(toastId)
                 } else {
                    toast.error("Conteúdo do contrato não encontrado", { id: toastId })
                 }
            }
        } else {
             // Fallback if versions fetch fails
             if (fetchedContent) {
                setCurrentContract({ id: contractId, content: fetchedContent, filename })
                setAnalysisResult(fetchedAnalysis)
                setViewState("preview")
                setActiveTab("upload")
                toast.dismiss(toastId)
             } else {
                toast.error("Erro ao buscar versões e conteúdo", { id: toastId })
             }
        }
    } catch (e) {
        console.error(e)
        toast.error("Erro ao abrir contrato", { id: toastId })
    }
  }

  const handleReanalyze = async (contractId: string) => {
    console.log(`Starting reanalysis for ${contractId}`)
    const toastId = toast.loading("Iniciando reanálise...")
    try {
        let content = ""
        let filename = "Contrato Reanalisado"
        
        // Try getting latest version first
        console.log("Fetching versions...")
        const res = await fetch(`/api/contracts/${contractId}/versions`)
        if (res.ok) {
            const versions = await res.json()
            console.log(`Versions found: ${versions?.length}`)
            if (versions && versions.length > 0) {
                const latest = versions[0]
                content = latest.content
                console.log("Content found in latest version")
            }
        } else {
            if (res.status !== 404) {
                console.error("Failed to fetch versions")
            }
        }
        
        // Fetch contract basic info if no version content or to get filename
        try {
            console.log("Fetching contract details...")
            const contractRes = await fetch(`/api/contracts/${contractId}`)
            if (contractRes.ok) {
                const contractData = await contractRes.json()
                if (contractData.name) filename = contractData.name
                
                // If we still don't have content (no versions), use original contract content
                if (!content) {
                    content = contractData.content
                    console.log(`Content found in original contract: ${!!content}`)
                }
            } else {
                console.error("Failed to fetch contract details")
            }
        } catch (e) {
            console.error("Failed to fetch contract name", e)
        }

        if (content) {
            console.log("Starting analysis...")
            setActiveTab("upload")
            handleAnalysisStart(contractId, content, filename, true)
            toast.success("Contrato carregado para reanálise", { id: toastId })
        } else {
            console.error("No content found for reanalysis")
            toast.error("Erro: Conteúdo do contrato não encontrado. Tente fazer upload novamente.", { id: toastId })
        }
    } catch (e) {
        console.error("Reanalyze failed", e)
        toast.error("Falha ao iniciar reanálise", { id: toastId })
    }
  }

  const handleDeleteClick = (contractId: string) => {
    setContractToDelete(contractId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!contractToDelete) return
    
    setIsDeleting(true)
    const toastId = toast.loading("Excluindo contrato...")

    try {
        const res = await fetch(`/api/contracts/${contractToDelete}`, {
            method: "DELETE"
        })
        
        if (res.ok) {
            toast.success("Contrato excluído com sucesso", { id: toastId })
            
            // 1. Close dialog first to trigger exit animation and cleanup
            setDeleteDialogOpen(false)

            // 2. Wait for animation/cleanup before updating state that triggers re-renders
            setTimeout(() => {
                setContractToDelete(null)
                setHistoryKey(prev => prev + 1) // Refresh history list
                
                // Safety check: ensure body is unlocked
                if (document.body.style.pointerEvents === 'none') {
                    document.body.style.pointerEvents = ''
                }
            }, 300)

            if (currentContract?.id === contractToDelete) {
                handleReset() // Clear current view if deleted
            }
        } else {
            const err = await res.json()
            console.error("Delete response error:", err)
            toast.error(`Erro ao excluir: ${err.error || 'Erro desconhecido'}`, { id: toastId })
            // Keep dialog open on error so user can try again
        }
    } catch (e) {
        console.error("Delete failed", e)
        toast.error("Erro de conexão ao excluir contrato. Verifique o console.", { id: toastId })
    } finally {
        setIsDeleting(false)
    }
  }

  const handleExportPDF = async (contractId: string) => {
    const toastId = toast.loading("Preparando documento para impressão...")
    try {
        await handleHistorySelect(contractId)
        // Wait a bit for the preview to render
        setTimeout(() => {
            window.print()
            toast.dismiss(toastId)
        }, 1500)
    } catch (e) {
        console.error("Export failed", e)
        toast.error("Erro ao preparar impressão", { id: toastId })
    }
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
                    <div className="relative bg-black p-6 rounded-full border border-emerald-500/50 shadow-lg flex items-center justify-center">
                        <div className="relative h-20 w-20 animate-pulse">
                            <Image 
                                src="/images/clausify-logo.png" 
                                alt="Analisando..." 
                                fill
                                className="object-contain"
                            />
                        </div>
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
            <ContractAnalysisResult 
                result={analysisResult} 
                onReset={handleReset} 
                filename={currentContract?.filename}
                contractId={currentContract?.id}
                content={currentContract?.content}
                onPreview={handlePreview}
            />
          )}

          {viewState === "preview" && currentContract && (
            <ContractAnalysisPreview
                contractId={currentContract.id}
                initialContent={currentContract.content}
                initialAnalysis={analysisResult}
                onBack={() => setViewState(analysisResult ? "result" : "idle")}
            />
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-6">
          <ContractHistoryList 
            refreshTrigger={historyKey}
            onSelect={handleHistorySelect} 
            onReanalyze={handleReanalyze} 
            onDelete={handleDeleteClick}
            onExportPDF={handleExportPDF}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent 
            className="sm:max-w-md"
            onCloseAutoFocus={(e) => {
                e.preventDefault()
                // Focus on body to prevent focus trap
                document.body.focus()
            }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este contrato permanentemente? 
              <br />
              Esta ação removerá o contrato e todas as suas versões do banco de dados e não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir Permanentemente"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LayoutWrapper>
  )
}
