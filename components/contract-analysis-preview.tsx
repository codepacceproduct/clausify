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
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack} className="no-print">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Revisão do Contrato
            </h2>
            <div className="ml-4">
               <OnlineUsers channelId={`contract:${contractId}`} />
            </div>
          </div>
          <Button onClick={handleSaveVersion} disabled={saving} className="no-print">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Salvando..." : "Salvar Nova Versão"}
          </Button>
        </div>

        <Card className="flex-1 overflow-hidden border-2">
          <ScrollArea className="h-full bg-muted/30">
             {renderContent()}
          </ScrollArea>
        </Card>
      </div>

      {/* Sidebar - Issues */}
      <div className="w-[400px] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Split className="h-5 w-5" />
            Sugestões ({analysis?.issues?.filter((i:any) => !i.resolved).length || 0})
          </h3>
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {analysis?.issues?.map((issue: Issue) => (
              <Card 
                key={issue.id} 
                className={`cursor-pointer transition-all ${
                    issue.resolved ? 'opacity-50 bg-muted' : 
                    selectedIssue?.id === issue.id ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedIssue(issue)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant={issue.severity === 'high' ? 'destructive' : issue.severity === 'medium' ? 'default' : 'secondary'}>
                      {issue.severity === 'high' ? 'Alto Risco' : issue.severity === 'medium' ? 'Médio Risco' : 'Baixo Risco'}
                    </Badge>
                    {issue.resolved && <Badge variant="outline" className="text-green-600 border-green-600">Resolvido</Badge>}
                  </div>
                  <CardTitle className="text-sm font-medium mt-2">
                    {issue.type}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <p className="text-xs text-muted-foreground">{issue.explanation}</p>
                  
                  {selectedIssue?.id === issue.id && !issue.resolved && (
                    <div className="space-y-3 pt-3 border-t animate-in slide-in-from-top-2">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-red-500">Texto Original:</p>
                            <p className="text-xs bg-red-50 p-2 rounded border border-red-100">{issue.originalText}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-green-600">Sugestão:</p>
                            <p className="text-xs bg-green-50 p-2 rounded border border-green-100">{issue.suggestion}</p>
                        </div>
                        <Button className="w-full no-print" size="sm" onClick={(e) => {
                            e.stopPropagation()
                            handleApplySuggestion(issue)
                        }}>
                            <Check className="h-4 w-4 mr-2" />
                            Aplicar Sugestão
                        </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
