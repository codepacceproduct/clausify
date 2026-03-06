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
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            Resultado da Análise
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {filename}
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={onReset} className="h-9">
            <RotateCcw className="h-4 w-4 mr-2 text-muted-foreground" />
            Nova Análise
          </Button>
          <Button variant="outline" onClick={handleCompareVersions} disabled={!contractId} className="h-9">
            <ArrowRightLeft className="h-4 w-4 mr-2 text-muted-foreground" />
            Comparar Versões
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-9" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Baixar Parecer PDF
          </Button>
        </div>
      </div>

      {/* Audio Player (Top) */}
      <Card className="bg-card text-card-foreground border-border shrink-0 shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 p-3 opacity-5">
            <Zap className="h-24 w-24 text-emerald-500" />
        </div>
        <CardContent className="p-4 flex items-center gap-6 relative z-10">
          <audio ref={audioRef} className="hidden" />
          <Button 
            size="icon" 
            className="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shrink-0 shadow-xl ring-4 ring-emerald-500/10 transition-all hover:scale-105"
            onClick={handlePlayAudio}
            disabled={audioLoading}
          >
            {audioLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 ml-1 fill-current" />}
          </Button>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-semibold text-base text-foreground">Resumo Executivo (IA)</span>
                <span className="text-xs text-muted-foreground">Ouvir análise completa do contrato</span>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                {audioLoading ? "Gerando áudio..." : isPlaying ? "Reproduzindo..." : "Clique no Play"}
              </Badge>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                style={{ width: `${audioProgress}%` }} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left: Document Viewer */}
        <Card className="lg:col-span-8 flex flex-col overflow-hidden border-border shadow-sm bg-background/50 backdrop-blur-sm">
          <CardHeader className="pb-3 border-b bg-muted/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 font-medium">
                <FileText className="h-4 w-4 text-emerald-500" />
                Visualização do Contrato
              </CardTitle>
              {contractId && <OnlineUsers channelId={`contract:${contractId}`} />}
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden relative bg-muted/10">
             <ScrollArea className="h-full">
                <div className="p-8 lg:p-12 max-w-4xl mx-auto">
                    <div className="bg-background shadow-sm border border-border min-h-[800px] p-8 lg:p-12 rounded-sm">
                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground font-serif">
                            {content || "Conteúdo do contrato não disponível para visualização."}
                        </div>
                    </div>
                </div>
             </ScrollArea>
             {/* Overlay for "Analysis Mode" visual effect */}
             <div className="absolute top-4 right-6 pointer-events-none">
                <Badge variant="outline" className="bg-background/80 backdrop-blur text-xs border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400 shadow-sm">
                    Modo Leitura
                </Badge>
             </div>
          </CardContent>
        </Card>

        {/* Right: Traffic Light Sidebar (Semáforo) */}
        <Card className="lg:col-span-4 flex flex-col overflow-hidden border-border shadow-sm bg-background">
          <CardHeader className="pb-3 border-b bg-muted/10 px-4 py-4">
            <div className="flex items-center justify-between mb-1">
                <CardTitle className="text-base font-medium">Pontos de Atenção</CardTitle>
                <Badge variant={score >= 70 ? "default" : "destructive"} className={cn("text-xs font-bold", score >= 70 ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600")}>
                    Score: {score}
                </Badge>
            </div>
            <CardDescription className="text-xs">
                {sortedIssues.length} itens encontrados na análise
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden bg-muted/5">
            <ScrollArea className="h-full p-4">
              <div className="space-y-3">
                {sortedIssues.map((issue) => (
                  <div 
                    key={issue.id} 
                    className={cn(
                        "group rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md cursor-pointer relative overflow-hidden",
                        activeIssueId === issue.id ? "ring-1 ring-emerald-500 border-emerald-500" : "border-border hover:border-emerald-500/30",
                        issue.severity === 'high' ? "border-l-[3px] border-l-rose-500" :
                        issue.severity === 'medium' ? "border-l-[3px] border-l-amber-500" :
                        "border-l-[3px] border-l-emerald-500"
                    )}
                    onClick={() => scrollToClause(issue.id)}
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
                            {issue.severity === 'high' ? <><XCircle className="h-3 w-3" /> Crítico</> : 
                             issue.severity === 'medium' ? <><AlertTriangle className="h-3 w-3" /> Atenção</> : 
                             <><CheckCircle2 className="h-3 w-3" /> Info</>}
                        </Badge>
                    </div>
                    
                    <h4 className="font-semibold text-sm mb-1.5 text-foreground leading-snug">{issue.type}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
                        {issue.explanation}
                    </p>

                    <Button 
                        size="sm" 
                        variant="secondary" 
                        className="w-full h-8 text-xs bg-muted/50 hover:bg-emerald-500/10 hover:text-emerald-600 border border-transparent hover:border-emerald-500/20 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleWhatsAppShare(issue)
                        }}
                    >
                        <MessageCircle className="h-3 w-3 mr-1.5" />
                        Explicar ao Cliente
                    </Button>
                  </div>
                ))}

                {sortedIssues.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-4">
                        <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">Nenhum risco detectado</p>
                            <p className="text-xs max-w-[200px] mx-auto">O contrato foi analisado e parece estar em conformidade.</p>
                        </div>
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
