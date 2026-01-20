"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import jsPDF from "jspdf"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Download, 
  Share2, 
  RotateCcw, 
  Play, 
  Pause, 
  MessageCircle,
  FileText,
  Zap,
  ArrowRightLeft,
  ChevronRight,
  ChevronDown,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
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
  finalText?: string
}

interface ContractAnalysisResultProps {
  onReset: () => void
  result?: any
  filename?: string
  contractId?: string
  content?: string
  onPreview?: () => void
}

export function ContractAnalysisResult({ 
  onReset, 
  result, 
  filename, 
  contractId, 
  content 
}: ContractAnalysisResultProps) {
  const issues: Issue[] = result?.issues || []
  const score = result?.score || 0
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioLoading, setAudioLoading] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [activeIssueId, setActiveIssueId] = useState<string | null>(null)
  const router = useRouter()

  // Sort issues: High risk first
  const sortedIssues = [...issues].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    const onEnded = () => {
      setIsPlaying(false)
      setAudioProgress(0)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', onEnded)
    }
  }, [audioUrl])

  const handlePlayAudio = async () => {
    if (audioLoading) return

    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
      return
    }

    if (audioUrl) {
      audioRef.current?.play()
      setIsPlaying(true)
      return
    }

    setAudioLoading(true)
    try {
      // Construct summary text for TTS
      const summaryText = result?.summary || `Resumo executivo do contrato ${filename || ""}. 
      A pontuação de risco calculada é ${score} de 100. 
      Identificamos ${issues.filter(i => i.severity === 'high').length} pontos de alto risco e ${issues.filter(i => i.severity === 'medium').length} de risco médio. 
      ${issues.length > 0 ? "Os principais pontos de atenção são: " + issues.slice(0, 3).map(i => i.type).join(", ") + "." : ""} 
      Recomendamos a revisão das cláusulas sugeridas.`

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summaryText })
      })

      if (!res.ok) throw new Error("Failed to generate audio")

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
      
      // Small delay to ensure ref is updated
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = url
          audioRef.current.play()
          setIsPlaying(true)
        }
      }, 100)

    } catch (error) {
      console.error("TTS Error:", error)
    } finally {
      setAudioLoading(false)
    }
  }

  const handleWhatsAppShare = (issue: Issue) => {
    const message = `Olá! Analisando o contrato "${filename}", identifiquei um ponto de atenção importante:\n\n*${issue.type}*\n\n${issue.explanation}\n\nSugestão: ${issue.suggestion}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let y = 20

    // Title
    doc.setFontSize(20)
    doc.text("Parecer Jurídico - Clausify", pageWidth / 2, y, { align: "center" })
    y += 15

    // File info
    doc.setFontSize(12)
    doc.text(`Arquivo: ${filename || "Contrato"}`, margin, y)
    y += 10
    doc.text(`Pontuação de Risco: ${score}/100`, margin, y)
    y += 20

    // Issues
    doc.setFontSize(16)
    doc.text("Pontos de Atenção", margin, y)
    y += 10

    sortedIssues.forEach((issue, index) => {
      // Check for page break
      if (y > 250) {
        doc.addPage()
        y = 20
      }

      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(`${index + 1}. ${issue.type} (${issue.severity.toUpperCase()})`, margin, y)
      y += 7

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      
      const splitExplanation = doc.splitTextToSize(`Explicação: ${issue.explanation}`, pageWidth - 2 * margin)
      doc.text(splitExplanation, margin, y)
      y += splitExplanation.length * 4 + 2

      if (y > 250) { doc.addPage(); y = 20; }

      const splitSuggestion = doc.splitTextToSize(`Sugestão: ${issue.suggestion}`, pageWidth - 2 * margin)
      doc.text(splitSuggestion, margin, y)
      y += splitSuggestion.length * 4 + 10
    })

    // Add Contract Content
    if (content) {
      doc.addPage()
      y = 20
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text("Conteúdo do Contrato", margin, y)
      y += 15
      
      doc.setFontSize(10)
      doc.setFont("times", "normal")
      
      const splitContent = doc.splitTextToSize(content, pageWidth - 2 * margin)
      
      for (let i = 0; i < splitContent.length; i++) {
        if (y > 270) {
          doc.addPage()
          y = 20
        }
        doc.text(splitContent[i], margin, y)
        y += 5
      }
    }

    doc.save(`parecer-${filename || 'contrato'}.pdf`)
  }

  const handleCompareVersions = () => {
    if (contractId) {
      router.push(`/dashboard/versionamento?contractId=${contractId}`)
    }
  }

  const scrollToClause = (issueId: string) => {
    setActiveIssueId(issueId)
    // In a real implementation, this would scroll the document viewer to the specific clause
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-100px)] flex flex-col">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resultado da Análise</h2>
          <p className="text-sm text-muted-foreground">{filename}</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Nova Análise
          </Button>
          <Button variant="outline" onClick={handleCompareVersions} disabled={!contractId}>
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Comparar Versões
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Baixar Parecer PDF
          </Button>
        </div>
      </div>

      {/* Audio Player (Top) */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none shrink-0 shadow-md">
        <CardContent className="p-4 flex items-center gap-4">
          <audio ref={audioRef} className="hidden" />
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shrink-0 shadow-lg border-2 border-emerald-400/20"
            onClick={handlePlayAudio}
            disabled={audioLoading}
          >
            {audioLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
          </Button>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Resumo Executivo (IA)</span>
              <span className="text-xs text-slate-400">
                {audioLoading ? "Gerando áudio..." : isPlaying ? "Reproduzindo..." : "Clique para ouvir"}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300" 
                style={{ width: `${audioProgress}%` }} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left: Document Viewer */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Visualização do Contrato
              </CardTitle>
              {contractId && <OnlineUsers channelId={`contract:${contractId}`} />}
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden relative bg-white dark:bg-slate-950">
             <ScrollArea className="h-full">
                <div className="p-8 max-w-3xl mx-auto text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300 font-sans">
                  {content || "Conteúdo do contrato não disponível para visualização."}
                </div>
             </ScrollArea>
             {/* Overlay for "Analysis Mode" visual effect */}
             <div className="absolute top-4 right-4 pointer-events-none">
                <Badge variant="outline" className="bg-white/80 backdrop-blur text-xs">
                    Modo Leitura
                </Badge>
             </div>
          </CardContent>
        </Card>

        {/* Right: Traffic Light Sidebar (Semáforo) */}
        <Card className="flex flex-col overflow-hidden border-slate-200 shadow-sm bg-slate-50/50 dark:bg-slate-900/50">
          <CardHeader className="pb-3 border-b bg-white dark:bg-slate-950">
            <div className="flex items-center justify-between">
                <CardTitle className="text-base">Pontos de Atenção</CardTitle>
                <Badge variant={score >= 70 ? "default" : "destructive"} className={score >= 70 ? "bg-emerald-500" : ""}>
                    Score: {score}
                </Badge>
            </div>
            <CardDescription>
                {sortedIssues.length} itens encontrados
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {sortedIssues.map((issue) => (
                  <div 
                    key={issue.id} 
                    className={cn(
                        "rounded-lg border bg-white dark:bg-slate-950 p-4 shadow-sm transition-all hover:shadow-md cursor-pointer",
                        activeIssueId === issue.id ? "ring-2 ring-primary" : "",
                        issue.severity === 'high' ? "border-l-4 border-l-destructive" :
                        issue.severity === 'medium' ? "border-l-4 border-l-amber-500" :
                        "border-l-4 border-l-emerald-500"
                    )}
                    onClick={() => scrollToClause(issue.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                        <Badge 
                            variant="outline" 
                            className={cn(
                                "text-xs font-semibold border-none px-2 py-0.5 rounded-full flex items-center gap-1",
                                issue.severity === 'high' ? "bg-destructive/10 text-destructive" :
                                issue.severity === 'medium' ? "bg-amber-500/10 text-amber-600" :
                                "bg-emerald-500/10 text-emerald-600"
                            )}
                        >
                            {issue.severity === 'high' ? <><XCircle className="h-3 w-3" /> Risco Alto</> : 
                             issue.severity === 'medium' ? <><AlertTriangle className="h-3 w-3" /> Risco Médio</> : 
                             <><CheckCircle2 className="h-3 w-3" /> Informativo</>}
                        </Badge>
                        {issue.severity === 'high' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    </div>
                    
                    <h4 className="font-semibold text-sm mb-1">{issue.type}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                        {issue.explanation}
                    </p>

                    <Button 
                        size="sm" 
                        variant="secondary" 
                        className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleWhatsAppShare(issue)
                        }}
                    >
                        <MessageCircle className="h-3.5 w-3.5 mr-2" />
                        Explicar pro Cliente
                    </Button>
                  </div>
                ))}

                {sortedIssues.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-500/50" />
                        <p>Nenhum risco detectado.</p>
                        <p className="text-xs">O contrato parece seguro.</p>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
