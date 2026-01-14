"use client"

import { useState, useEffect } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ProcessSearch } from "@/components/consultas/process-search"
import { ProcessResult } from "@/components/consultas/process-result"
import {
  consultDataJud,
  createPublicProcessPreview,
  ProcessPreviewPayload,
  getPublicProcessPreviewHistory,
  deletePublicProcessPreview,
  getProcessConsultHistory,
  type PublicProcessPreviewHistoryItem,
  type ProcessConsultHistoryItem,
} from "@/actions/datajud-consult"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ViewState = "search" | "loading" | "result"
type ActiveTab = "consulta" | "historico"

export default function ProcessualPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("consulta")
  const [viewState, setViewState] = useState<ViewState>("search")
  const [searchData, setSearchData] = useState<{term: string, type: string} | null>(null)
  const [resultData, setResultData] = useState<any>(null)
  const [publicLink, setPublicLink] = useState<string | null>(null)
  const [linkExpiresAt, setLinkExpiresAt] = useState<string | null>(null)
  const [linkDuration, setLinkDuration] = useState<"1h" | "24h" | "7d">("24h")
  const [linkLoading, setLinkLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [previewHistory, setPreviewHistory] = useState<PublicProcessPreviewHistoryItem[]>([])
  const [consultHistory, setConsultHistory] = useState<ProcessConsultHistoryItem[]>([])
  
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
    try {
      await deletePublicProcessPreview(token)
      setPreviewHistory((current) => current.filter((item) => item.token !== token))
      toast.success("Link público removido do histórico.")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao remover link público.")
    }
  }

  useEffect(() => {
    if (activeTab === "historico") {
      loadHistory()
    }
  }, [activeTab])

  return (
    <LayoutWrapper>
      <div className="min-h-[calc(100vh-100px)] flex flex-col justify-center">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActiveTab)}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Consulta processual</h1>
              <p className="text-sm text-muted-foreground">
                Pesquise processos pelo número CNJ e acompanhe o histórico de consultas e links públicos.
              </p>
            </div>
            <TabsList>
              <TabsTrigger value="consulta">Consulta</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="consulta" className="flex-1">
            {viewState === "search" && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <ProcessSearch onSearch={handleSearch} />

                <div className="max-w-5xl mx-auto">
              <Card className="border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Tribunais que consultamos automaticamente
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Ao informar o número único do processo (CNJ), buscamos nos seguintes ramos da Justiça:
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">Justiça Federal</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">TRF1, TRF2, TRF3, TRF4, TRF5 e TRF6.</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">Justiça do Trabalho</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">TRT1 a TRT24 em todo o Brasil.</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">Justiça Estadual</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Todos os TJ estaduais (TJAC a TJTO, incluindo TJSE).</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">Tribunais Superiores</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">STJ, TST, TSE e STM.</p>
                  </div>
                </CardContent>
              </Card>
                </div>
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
          Array.isArray(resultData) ? (
            <div className="max-w-4xl mx-auto space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Processos Encontrados</h2>
                  <p className="text-muted-foreground">Selecione um processo para ver os detalhes.</p>
                </div>
              </div>

              <div className="grid gap-4">
                {resultData.map((proc: any, idx: number) => (
                  <Card 
                    key={idx} 
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-l-4 border-l-transparent hover:border-l-emerald-500" 
                    onClick={() => setResultData(proc)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-mono text-emerald-600 dark:text-emerald-400">
                          {proc.processNumber}
                        </CardTitle>
                        <span className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                          {proc.status.length > 30 ? proc.status.substring(0, 30) + "..." : proc.status}
                        </span>
                      </div>
                      <CardDescription className="font-medium text-foreground">
                        {proc.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Última atualização: {proc.events?.[0]?.date || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>{proc.events?.length || 0} movimentos</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <ProcessResult 
                processNumber={resultData.processNumber}
                title={resultData.title}
                status={resultData.status}
                events={resultData.events}
                documents={resultData.documents}
                onBack={handleBack}
              />

              <div className="max-w-5xl mx-auto w-full">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">
                      Link público de acompanhamento
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Gere um link compartilhável para que outra pessoa possa acompanhar este processo sem acessar a plataforma.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Validade do link:</span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={linkDuration === "1h" ? "default" : "outline"}
                          size="xs"
                          onClick={() => setLinkDuration("1h")}
                          disabled={linkLoading}
                        >
                          1 hora
                        </Button>
                        <Button
                          type="button"
                          variant={linkDuration === "24h" ? "default" : "outline"}
                          size="xs"
                          onClick={() => setLinkDuration("24h")}
                          disabled={linkLoading}
                        >
                          24 horas
                        </Button>
                        <Button
                          type="button"
                          variant={linkDuration === "7d" ? "default" : "outline"}
                          size="xs"
                          onClick={() => setLinkDuration("7d")}
                          disabled={linkLoading}
                        >
                          7 dias
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex-1">
                        {publicLink ? (
                          <input
                            value={publicLink}
                            readOnly
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono"
                          />
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Nenhum link gerado ainda. Escolha a validade e clique em &quot;Gerar link público&quot;.
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleCreatePublicLink}
                          disabled={linkLoading}
                        >
                          {linkLoading ? "Gerando..." : "Gerar link público"}
                        </Button>
                        {publicLink && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleCopyLink}
                          >
                            Copiar
                          </Button>
                        )}
                      </div>
                    </div>

                    {linkExpiresAt && (
                      <p className="text-[11px] text-muted-foreground">
                        Este link ficará válido até{" "}
                        <span className="font-medium">
                          {formatExpiresAt(linkExpiresAt)}
                        </span>
                        .
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )
            )}
          </TabsContent>

          <TabsContent value="historico" className="flex-1">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Histórico</h2>
                <p className="text-xs text-muted-foreground">
                  Veja os processos consultados recentemente e todos os links públicos de acompanhamento gerados.
                </p>
              </div>

              {historyLoading ? (
                <div className="flex flex-col items-center justify-center space-y-3 py-10">
                  <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-emerald-500 animate-spin" />
                  <p className="text-xs text-muted-foreground">Carregando histórico...</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">Consultas recentes</CardTitle>
                      <CardDescription className="text-xs">
                        Últimos números de processo consultados nesta conta.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {consultHistory.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          Nenhum histórico de consulta ainda. Faça uma busca para começar.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {consultHistory.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-xs"
                            >
                              <div className="flex flex-col">
                                <span className="font-mono text-foreground">
                                  {item.cnj_number || item.term}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  {new Intl.DateTimeFormat("pt-BR", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  }).format(new Date(item.created_at))}
                                </span>
                              </div>
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                                {item.type === "process" ? "Processo" : "CPF"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">Links públicos gerados</CardTitle>
                      <CardDescription className="text-xs">
                        Histórico de links de visualização pública de processos. Você pode acessar ou apagar.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {previewHistory.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          Nenhum link público gerado ainda.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {previewHistory.map((item) => {
                            const url =
                              typeof window !== "undefined"
                                ? `${window.location.origin}/preview/processo/${item.token}`
                                : `/preview/processo/${item.token}`

                            return (
                              <div
                                key={item.id}
                                className="flex flex-col gap-2 rounded-md border bg-card px-3 py-2 text-xs"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex flex-col">
                                    <span className="font-mono text-foreground">
                                      {item.cnj_number}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">
                                      Criado em{" "}
                                      {new Intl.DateTimeFormat("pt-BR", {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                      }).format(new Date(item.created_at))}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">
                                      Válido até{" "}
                                      {new Intl.DateTimeFormat("pt-BR", {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                      }).format(new Date(item.expires_at))}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
                                  <input
                                    value={url}
                                    readOnly
                                    className="w-full flex-1 rounded-md border border-input bg-background px-2 py-1 text-[11px] font-mono"
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="text-[11px]"
                                      onClick={async () => {
                                        try {
                                          await navigator.clipboard.writeText(url)
                                          toast.success("Link copiado.")
                                        } catch {
                                          toast.error("Não foi possível copiar o link.")
                                        }
                                      }}
                                    >
                                      Copiar
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="text-[11px] text-destructive border-destructive/50"
                                      onClick={() => handleDeletePreview(item.token)}
                                    >
                                      Apagar
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </LayoutWrapper>
  )
}
