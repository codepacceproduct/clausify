"use client"

import { UsageLimitIndicator } from "@/components/usage/usage-limit-indicator"
import { useState, useEffect } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ProcessSearch } from "@/components/consultas/process-search"
import { ProcessResult } from "@/components/consultas/process-result"
import {
  consultDataJud,
  createPublicProcessPreview,
  ProcessPreviewPayload,
  deletePublicProcessPreview,
  type PublicProcessPreviewHistoryItem,
  type ProcessConsultHistoryItem,
  getPublicProcessPreviewHistory,
  getProcessConsultHistory
} from "@/actions/datajud-consult"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Calendar, Trash2, ExternalLink, Link as LinkIcon, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type ViewState = "search" | "loading" | "result"
type ActiveTab = "consulta" | "historico"

interface ProcessualContentProps {
  initialPreviewHistory: PublicProcessPreviewHistoryItem[]
  initialConsultHistory: ProcessConsultHistoryItem[]
}

export function ProcessualContent({ 
  initialPreviewHistory, 
  initialConsultHistory 
}: ProcessualContentProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("consulta")
  const [viewState, setViewState] = useState<ViewState>("search")
  const [searchData, setSearchData] = useState<{term: string, type: string} | null>(null)
  const [resultData, setResultData] = useState<any>(null)
  const [publicLink, setPublicLink] = useState<string | null>(null)
  const [linkExpiresAt, setLinkExpiresAt] = useState<string | null>(null)
  const [linkDuration, setLinkDuration] = useState<"1h" | "24h" | "7d">("24h")
  const [linkLoading, setLinkLoading] = useState(false)
  
  // Initialize history with server data
  const [previewHistory, setPreviewHistory] = useState<PublicProcessPreviewHistoryItem[]>(initialPreviewHistory)
  const [consultHistory, setConsultHistory] = useState<ProcessConsultHistoryItem[]>(initialConsultHistory)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [isLimitReached, setIsLimitReached] = useState(false)
  
  const searchParams = useSearchParams()
  const queryTerm = searchParams.get("q")

  const handleUsageChange = (usage: any) => {
    if (usage) {
      const isUnlimited = usage.limit === Infinity
      const reached = !isUnlimited && usage.remaining === 0
      
      if (isLimitReached && !reached) {
        toast.success("Limite diário renovado! Você pode fazer novas consultas.")
      }
      
      setIsLimitReached(reached)
    }
  }

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
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Erro ao realizar consulta.")
      setViewState("search")
    }
  }

  const handleCreatePublicLink = async () => {
    if (!resultData) return

    const payload: ProcessPreviewPayload = {
      processNumber: resultData.processNumber,
      title: resultData.title,
      status: resultData.status,
      events: resultData.events || [],
      documents: resultData.documents || [],
    }

    const expiresInHours =
      linkDuration === "1h" ? 1 : linkDuration === "7d" ? 24 * 7 : 24

    try {
      setLinkLoading(true)
      const response = await createPublicProcessPreview(payload, expiresInHours)

      if (!response) {
        toast.error("Não foi possível gerar o link público.")
        return
      }

      const base =
        typeof window !== "undefined" ? window.location.origin : ""

      const url = base
        ? `${base}/preview/processo/${response.token}`
        : `/preview/processo/${response.token}`

      setPublicLink(url)
      setLinkExpiresAt(response.expiresAt)
      toast.success("Link público gerado com sucesso.")
      
      // Refresh history after creating link
      const newHistory = await getPublicProcessPreviewHistory()
      setPreviewHistory(newHistory)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao gerar link público.")
    } finally {
      setLinkLoading(false)
    }
  }

  const handleCopyLink = async () => {
    if (!publicLink) return
    try {
      await navigator.clipboard.writeText(publicLink)
      toast.success("Link copiado para a área de transferência.")
    } catch {
      toast.error("Não foi possível copiar o link.")
    }
  }

  const formatExpiresAt = (value: string) => {
    try {
      const date = new Date(value)
      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date)
    } catch {
      return value
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

  // We can keep this for manual refresh if needed, but initial data covers the first load
  const loadHistory = async () => {
    try {
      setHistoryLoading(true)
      const [previews, consults] = await Promise.all([
        getPublicProcessPreviewHistory(),
        getProcessConsultHistory(),
      ])
      setPreviewHistory(previews)
      setConsultHistory(consults)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar histórico.")
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleDeletePreview = async (token: string) => {
    const confirmed = window.confirm(
      "Tem certeza que deseja apagar este link público? Essa ação remove o registro do histórico e do banco de dados."
    )

    if (!confirmed) return

    try {
      await deletePublicProcessPreview(token)
      setPreviewHistory((current) => current.filter((item) => item.token !== token))
      toast.success("Link público removido do histórico e do banco de dados.")
    } catch (error: any) {
      console.error("Erro ao remover link público:", error)
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Erro ao remover link público. Verifique se você está autenticado."
      toast.error(message)
    }
  }

  if (viewState === "loading") {
    return (
      <LayoutWrapper>
        <div className="min-h-[calc(100vh-100px)] flex flex-col justify-center">
          <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-emerald-500 font-bold text-xs">JUS</span>
              </div>
            </div>
            <p className="text-muted-foreground animate-pulse">Consultando tribunais...</p>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Consulta Processual</h1>
          <p className="text-muted-foreground mt-1">
            Pesquise processos em todos os tribunais do Brasil (DataJud/CNJ).
          </p>
        </div>

        <UsageLimitIndicator onUsageChange={handleUsageChange} />

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="consulta">Nova Consulta</TabsTrigger>
            <TabsTrigger value="historico">Histórico & Links</TabsTrigger>
          </TabsList>

          <TabsContent value="consulta" className="space-y-6 mt-6">
            {viewState === "search" && (
              <ProcessSearch onSearch={handleSearch} disabled={isLimitReached} />
            )}

            {viewState === "result" && resultData && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={handleBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Nova Pesquisa
                  </Button>
                </div>

                <ProcessResult 
                  {...resultData}
                  onCreateLink={handleCreatePublicLink}
                  publicLink={publicLink}
                  linkExpiresAt={linkExpiresAt}
                  onCopyLink={handleCopyLink}
                  linkLoading={linkLoading}
                  linkDuration={linkDuration}
                  setLinkDuration={setLinkDuration}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="historico" className="space-y-6 mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Links Públicos Ativos</CardTitle>
                  <CardDescription>
                    Processos que você compartilhou via link público temporário.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {historyLoading ? (
                    <div className="flex justify-center p-8">
                      <div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin" />
                    </div>
                  ) : previewHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum link público ativo encontrado.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {previewHistory.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.process_number}</span>
                              <Badge variant={item.active ? "default" : "secondary"}>
                                {item.active ? "Ativo" : "Expirado"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{item.title}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Criado em: {new Date(item.created_at).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Expira em: {formatExpiresAt(item.expires_at)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link href={`/preview/processo/${item.token}`} target="_blank">
                              <Button variant="outline" size="sm" className="gap-2">
                                <ExternalLink className="h-3 w-3" />
                                Acessar
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleDeletePreview(item.token)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Consultas</CardTitle>
                  <CardDescription>
                    Últimos processos consultados na plataforma.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {historyLoading ? (
                    <div className="flex justify-center p-8">
                      <div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin" />
                    </div>
                  ) : consultHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhuma consulta recente encontrada.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {consultHistory.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="font-medium flex items-center gap-2">
                              {item.cnj_number || item.term}
                              <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                {item.type === "process" ? "PROCESSO" : "CPF"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.type === "process" ? "Consulta Processual" : `Consulta por CPF: ${item.term}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Consultado em: {new Date(item.created_at).toLocaleString()}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSearch(item.term, item.type as "process" | "cpf")}
                          >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Consultar Novamente
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </LayoutWrapper>
  )
}
