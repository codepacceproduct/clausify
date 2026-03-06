"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  FileText,
  X,
  Check,
  Split
} from "lucide-react"
import { toast } from "sonner"
import { OnlineUsers } from "@/components/online-users"

interface Issue {
  id: string
  severity: "high" | "medium" | "low"
  type: string
  clause: string
  originalText: string
  suggestion: string
  explanation: string
  resolved?: boolean
}

interface ContractAnalysisPreviewProps {
  contractId: string
  initialContent?: string
  initialAnalysis?: any
  onBack: () => void
}

export function ContractAnalysisPreview({ 
  contractId, 
  initialContent, 
  initialAnalysis,
  onBack 
}: ContractAnalysisPreviewProps) {
  const [content, setContent] = useState(initialContent || "")
  const [analysis, setAnalysis] = useState<any>(initialAnalysis || null)
  const [loading, setLoading] = useState(!initialContent || !initialAnalysis)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!initialContent || !initialAnalysis) {
      fetchContractData()
    }
  }, [contractId])

  async function fetchContractData() {
    try {
      const res = await fetch(`/api/contracts/${contractId}`)
      if (res.ok) {
        const data = await res.json()
        setContent(data.content || "")
        setAnalysis(data.analysis || null)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleApplySuggestion = async (issue: Issue) => {
    if (!content) return

    // Replace the text
    const newContent = content.replace(issue.originalText, issue.suggestion)
    setContent(newContent)

    // Mark issue as resolved locally
    if (analysis && analysis.issues) {
      const updatedIssues = analysis.issues.map((i: Issue) => 
        i.id === issue.id ? { ...i, resolved: true } : i
      )
      setAnalysis({ ...analysis, issues: updatedIssues })
    }

    toast.success("Sugestão aplicada no preview")
    setSelectedIssue(null)
  }

  const handleSaveVersion = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/contracts/${contractId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content,
          version_number: "auto", // Backend handles increment
          changes_summary: "Sugestões da análise aplicadas",
          analysis: analysis
        })
      })

      if (res.ok) {
        toast.success("Nova versão salva com sucesso!")
      } else {
        throw new Error("Failed to save version")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao salvar versão")
    } finally {
      setSaving(false)
    }
  }

  // Highlight logic
  const renderContent = () => {
    if (!content) return <p className="text-muted-foreground">Carregando conteúdo...</p>
    if (!analysis?.issues) return <pre className="whitespace-pre-wrap font-sans text-sm">{content}</pre>

    let lastIndex = 0
    const elements = []
    
    // Sort issues by position in text (if we had offsets). 
    // Without offsets, we search for strings. 
    // This is naive and might fail with duplicate strings, but serves the MVP.
    const issuesToRender = analysis.issues.filter((i: Issue) => !i.resolved)

    // We need to be careful not to overlap replacements. 
    // For MVP, let's just highlight the first occurrence of each issue's originalText that hasn't been handled.
    // To do this robustly without offsets is hard.
    // Let's try a simple split approach for the *selected* issue, or all if possible.
    
    // Better approach for MVP: Just display the text, and sidebar with issues.
    // When an issue is clicked, we try to scroll to it or highlight it.
    
    return (
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed p-4">
        {content.split('\n').map((line, i) => (
            <div key={i} className="min-h-[1.5em]">{line}</div>
        ))}
      </pre>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack} className="no-print hover:bg-muted/50 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="h-6 w-px bg-border mx-2" />
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-500" />
              Revisão e Correção
            </h2>
            <div className="ml-4">
               <OnlineUsers channelId={`contract:${contractId}`} />
            </div>
        </div>
        <Button onClick={handleSaveVersion} disabled={saving} className="no-print bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Salvando..." : "Salvar Nova Versão"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Main Content Area - Editor */}
        <Card className="lg:col-span-8 flex flex-col overflow-hidden border-border shadow-sm bg-background/50 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b bg-muted/30 px-6 py-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2 font-medium">
                        <FileText className="h-4 w-4 text-emerald-500" />
                        Editor de Contrato
                    </CardTitle>
                    <Badge variant="outline" className="bg-background/50 text-xs font-normal">
                        Modo Edição
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden relative bg-muted/10">
                <ScrollArea className="h-full">
                    <div className="p-8 lg:p-12 max-w-4xl mx-auto">
                        <div className="bg-background shadow-sm border border-border min-h-[800px] p-8 lg:p-12 rounded-sm">
                             {renderContent()}
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>

        {/* Sidebar - Issues */}
        <Card className="lg:col-span-4 flex flex-col overflow-hidden border-border shadow-sm bg-background">
            <CardHeader className="pb-3 border-b bg-muted/10 px-4 py-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Split className="h-4 w-4 text-emerald-500" />
                        Sugestões de Correção
                    </CardTitle>
                    <Badge variant="secondary" className="font-mono text-xs">
                        {analysis?.issues?.filter((i:any) => !i.resolved).length || 0} pendentes
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden bg-muted/5">
                <ScrollArea className="h-full p-4">
                    <div className="space-y-3">
                        {analysis?.issues?.map((issue: Issue) => (
                        <div 
                            key={issue.id} 
                            className={cn(
                                "group rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md cursor-pointer relative overflow-hidden",
                                issue.resolved ? "opacity-60 bg-muted border-border" : 
                                selectedIssue?.id === issue.id ? "ring-1 ring-emerald-500 border-emerald-500" : "border-border hover:border-emerald-500/30",
                                !issue.resolved && (
                                    issue.severity === 'high' ? "border-l-[3px] border-l-rose-500" :
                                    issue.severity === 'medium' ? "border-l-[3px] border-l-amber-500" :
                                    "border-l-[3px] border-l-emerald-500"
                                )
                            )}
                            onClick={() => setSelectedIssue(issue)}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <Badge 
                                    variant="outline" 
                                    className={cn(
                                        "text-[10px] font-bold border-none px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider",
                                        issue.severity === 'high' ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" :
                                        issue.severity === 'medium' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                                        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    )}
                                >
                                    {issue.severity === 'high' ? 'Crítico' : issue.severity === 'medium' ? 'Atenção' : 'Info'}
                                </Badge>
                                {issue.resolved && (
                                    <Badge variant="outline" className="text-emerald-600 border-emerald-600 bg-emerald-500/10 text-[10px] flex items-center gap-1">
                                        <Check className="h-3 w-3" /> Resolvido
                                    </Badge>
                                )}
                            </div>
                            
                            <h4 className="font-semibold text-sm mb-1.5 text-foreground leading-snug">{issue.type}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{issue.explanation}</p>
                            
                            {selectedIssue?.id === issue.id && !issue.resolved && (
                                <div className="space-y-3 pt-3 mt-3 border-t border-border animate-in slide-in-from-top-2">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-rose-500">
                                            <X className="h-3 w-3" /> Original
                                        </div>
                                        <div className="text-xs bg-rose-500/5 p-2.5 rounded border border-rose-500/20 text-foreground leading-relaxed font-mono">
                                            {issue.originalText}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                            <Check className="h-3 w-3" /> Sugestão
                                        </div>
                                        <div className="text-xs bg-emerald-500/5 p-2.5 rounded border border-emerald-500/20 text-foreground leading-relaxed font-mono">
                                            {issue.suggestion}
                                        </div>
                                    </div>
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs font-medium shadow-sm" onClick={(e) => {
                                        e.stopPropagation()
                                        handleApplySuggestion(issue)
                                    }}>
                                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                        Aplicar Correção
                                    </Button>
                                </div>
                            )}
                        </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
