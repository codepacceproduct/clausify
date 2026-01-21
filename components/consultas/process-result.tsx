"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Calendar, FileText, Download, Info, ExternalLink, Share2, Copy, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

interface ProcessEvent {
  id: string
  date: string
  description: string
  details?: string
  translation?: string
  nextStep?: string
}

interface ProcessDocument {
  id: string
  title: string
  date: string
  type: string
}

interface ProcessResultProps {
  processNumber: string
  title: string
  status: string
  events: ProcessEvent[]
  documents?: ProcessDocument[]
  onBack?: () => void
  showBackButton?: boolean
  
  // Sharing props
  onCreateLink?: () => void
  publicLink?: string | null
  linkExpiresAt?: string | null
  onCopyLink?: (link: string) => void
  linkLoading?: boolean
  linkDuration?: "1h" | "24h" | "7d"
  setLinkDuration?: (duration: "1h" | "24h" | "7d") => void
}

function getTribunalPortal(processNumber: string | undefined | null) {
  if (!processNumber || typeof processNumber !== 'string') return { name: "Portal do Tribunal", url: "https://www.cnj.jus.br" }
  const clean = processNumber.replace(/\D/g, "")
  if (clean.length !== 20) return { name: "Portal do Tribunal", url: "https://www.cnj.jus.br" }

  const j = clean.substring(13, 14)
  const tr = clean.substring(14, 16)
  const key = `${j}.${tr}`

  // Mapping based on J.TR to specific portals (simplified for most common)
  const portals: Record<string, { name: string, url: string }> = {
    "8.26": { name: "e-SAJ TJSP", url: "https://esaj.tjsp.jus.br/cpopg/open.do" },
    "8.05": { name: "PJe TJBA", url: "https://consultapublicapje.tjba.jus.br/pje/ConsultaPublica/listView.seam" },
    "8.13": { name: "PJe TJMG", url: "https://pje-consulta-publica.tjmg.jus.br/" },
    "8.19": { name: "TJRJ", url: "https://www3.tjrj.jus.br/consultaprocessual/" },
    "8.21": { name: "TJRS", url: "https://www.tjrs.jus.br/site/processos/" },
    "4.01": { name: "PJe TRF1", url: "https://pje1g.trf1.jus.br/consultapublica/ConsultaPublica/listView.seam" },
    "4.02": { name: "e-Proc TRF2", url: "https://eproc.trf2.jus.br/eproc/" },
    "4.03": { name: "PJe TRF3", url: "https://pje1g.trf3.jus.br/consultapublica/ConsultaPublica/listView.seam" },
    "5.02": { name: "PJe TRT2", url: "https://pje.trt2.jus.br/consultaprocessual/" },
  }

  return portals[key] || { name: "Portal do Tribunal", url: "https://www.cnj.jus.br" }
}

export function ProcessResult({ 
  processNumber, 
  title, 
  status, 
  events, 
  documents, 
  onBack, 
  showBackButton = true,
  onCreateLink,
  publicLink,
  linkExpiresAt,
  onCopyLink,
  linkLoading,
  linkDuration,
  setLinkDuration
}: ProcessResultProps) {
  const handleBack = onBack ?? (() => {})
  const safeEvents = Array.isArray(events) ? events : []
  const latestEvent = safeEvents[0]
  const portal = getTribunalPortal(processNumber)
  const [isShareOpen, setIsShareOpen] = useState(false)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        {showBackButton && (
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground pl-0"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar para busca
          </Button>
        )}

        {onCreateLink && (
            <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Compartilhar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                <DialogTitle>Compartilhar Processo</DialogTitle>
                <DialogDescription>
                    Gere um link público temporário para compartilhar o andamento deste processo.
                </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                {publicLink ? (
                    <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">Link</Label>
                        <Input
                            id="link"
                            defaultValue={publicLink}
                            readOnly
                            className="h-9"
                        />
                        </div>
                        <Button type="button" size="sm" className="px-3" onClick={() => onCopyLink?.(publicLink)}>
                        <span className="sr-only">Copiar</span>
                        <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Este link expira em: <span className="font-medium text-foreground">{linkExpiresAt ? new Date(linkExpiresAt).toLocaleString() : 'N/A'}</span>
                    </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">
                        Duração
                        </Label>
                        <Select 
                        value={linkDuration} 
                        onValueChange={(v: any) => setLinkDuration?.(v)}
                        >
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione a duração" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1h">1 hora</SelectItem>
                            <SelectItem value="24h">24 horas</SelectItem>
                            <SelectItem value="7d">7 dias</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    </div>
                )}
                </div>
                
                <DialogFooter className="sm:justify-end">
                {publicLink ? (
                    <Button type="button" variant="secondary" onClick={() => setIsShareOpen(false)}>
                    Fechar
                    </Button>
                ) : (
                    <Button type="button" onClick={onCreateLink} disabled={linkLoading}>
                    {linkLoading ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando Link...
                        </>
                    ) : (
                        "Gerar Link Público"
                    )}
                    </Button>
                )}
                </DialogFooter>
            </DialogContent>
            </Dialog>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground font-mono mt-1">Nº {processNumber}</p>
        </div>
        <Badge variant="outline" className="w-fit bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1.5 text-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
          {status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-white text-slate-900 border-slate-200 dark:bg-slate-950 dark:text-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Linha do tempo</CardTitle>
            <p className="text-xs text-slate-500">Do mais recente ao mais antigo</p>
          </CardHeader>
          <CardContent>
            {safeEvents.length > 0 ? (
              <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 space-y-8">
                {safeEvents.map((event, index) => (
                  <div key={event.id} className="relative">
                    <div className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-white dark:border-slate-950 ${
                      index === 0 ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-700"
                    }`} />
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-mono ${index === 0 ? "text-emerald-600 dark:text-emerald-500 font-bold" : "text-slate-500"}`}>
                        {event.date}
                      </span>
                      <p className={`text-sm ${index === 0 ? "text-slate-900 dark:text-white font-medium" : "text-slate-500 dark:text-slate-400"}`}>
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Nenhuma movimentação encontrada para este processo.</p>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-200 overflow-hidden dark:bg-slate-950 dark:border-slate-800">
            <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Última atualização (detalhes)</CardTitle>
                <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                    <div className="h-full w-20 bg-emerald-500 rounded-full" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                {latestEvent ? (
                  <>
                    <div className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                      <Calendar className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                      {latestEvent.date}
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4 dark:bg-slate-900 dark:border-slate-800">
                      <p className="text-slate-700 dark:text-slate-300">
                        {latestEvent.details || latestEvent.description}
                      </p>
                      {(!latestEvent.details || latestEvent.details.trim() === "") && (
                        <div className="pt-2">
                          <Button
                            variant="link"
                            className="text-emerald-600 p-0 h-auto font-normal hover:text-emerald-500"
                            onClick={() => window.open(portal.url, "_blank")}
                          >
                            Ver teor completo no {portal.name} <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                          <p className="text-xs text-slate-500 mt-1">
                            * O conteúdo completo desta publicação está disponível apenas no portal oficial do tribunal.
                          </p>
                        </div>
                      )}
                      {latestEvent.translation && (
                        <div className="pl-4 border-l-4 border-emerald-500">
                          <p className="text-xs text-emerald-500 font-bold mb-1 uppercase tracking-wider">Tradução rápida:</p>
                          <p className="text-slate-900 dark:text-white font-medium text-lg">
                            {latestEvent.translation}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">Nenhuma movimentação registrada para este processo até o momento.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {documents && documents.length > 0 && (
            <Card className="bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800">
              <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Documentos anexos</CardTitle>
                    <Info className="h-4 w-4 text-slate-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors gap-4 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-slate-200">
                            {doc.title}
                          </h4>
                          <p className="text-sm text-slate-500">{doc.date}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-slate-700 border-slate-300 hover:text-slate-900 hover:bg-slate-100 w-full sm:w-auto dark:text-slate-400 dark:border-slate-700 dark:hover:text-white dark:hover:bg-slate-800"
                        onClick={() => window.open(portal.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Acessar no {portal.name}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {latestEvent && latestEvent.nextStep && (
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-slate-300">Próximo passo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">{latestEvent.nextStep}</p>
              </CardContent>
            </Card>
          )}


        </div>
      </div>
    </div>
  )
}
