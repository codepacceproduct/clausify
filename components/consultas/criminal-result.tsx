"use client"

import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, FileText, ChevronDown, ChevronUp, Printer, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"

interface CriminalRecord {
  source: string
  court: string
  processNumber?: string
  type: string
  status: string
  date: string
  details: string
  severity: "low" | "medium" | "high"
}

interface CriminalResultProps {
  data: {
    name: string
    document: string
    status: "clean" | "positive"
    records: CriminalRecord[]
    lastCheck: string
  }
  onBack: () => void
}

export function CriminalResult({ data, onBack }: CriminalResultProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-2 pl-0 hover:pl-2 transition-all hover:bg-transparent hover:text-emerald-600"
      >
        ← Nova Consulta
      </Button>

      {/* Header Status */}
      <Card className={`border-t-4 ${data.status === 'clean' ? 'border-t-emerald-500 border-emerald-200 dark:border-emerald-900' : 'border-t-red-500 border-red-200 dark:border-red-900'}`}>
        <CardContent className="p-8 text-center space-y-4">
          <div className={`mx-auto p-4 rounded-full w-fit ${data.status === 'clean' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
            {data.status === 'clean' ? (
              <ShieldCheck className="h-16 w-16" />
            ) : (
              <ShieldAlert className="h-16 w-16" />
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {data.status === 'clean' ? 'Nada Consta' : 'Registros Encontrados'}
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Resultado para: <span className="font-semibold text-foreground">{data.name}</span>
            </p>
            <p className="text-sm text-muted-foreground font-mono mt-1">
              CPF: {data.document}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      {data.status === 'positive' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Ocorrências Identificadas
          </h3>
          
          {data.records.map((record, index) => (
            <RecordItem key={index} record={record} />
          ))}
        </div>
      )}

      {/* Scope Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fontes Consultadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Polícia Federal
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Justiça Federal (TRF)
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Tribunais de Justiça (TJ)
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Banco Nacional (BNMP)
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Justiça Eleitoral
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Justiça Militar
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-6 pt-4 border-t">
            * A busca abrange processos públicos. Processos em segredo de justiça podem não ser listados dependendo da fonte.
            Data da consulta: {data.lastCheck}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function RecordItem({ record }: { record: CriminalRecord }) {
  const [isOpen, setIsOpen] = useState(false)

  const severityColors = {
    low: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
    medium: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    high: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
  }

  return (
    <Card className={`border-l-4 ${record.severity === 'high' ? 'border-l-red-500' : record.severity === 'medium' ? 'border-l-orange-500' : 'border-l-yellow-500'}`}>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                {record.source}
              </Badge>
              <span className="font-semibold text-foreground">{record.type}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {record.court} • {record.date}
            </p>
          </div>
          
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                {isOpen ? "Ocultar Detalhes" : "Ver Detalhes"}
                {isOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="pt-4 mt-4 border-t animate-in slide-in-from-top-2">
            <div className="grid gap-4 text-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-muted-foreground block mb-1">Status</span>
                  <span className="text-foreground">{record.status}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground block mb-1">Processo</span>
                  <span className="font-mono text-foreground">{record.processNumber || "Não informado"}</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground block mb-1">Detalhes</span>
                <p className="text-foreground bg-slate-50 dark:bg-slate-900 p-3 rounded-md border border-slate-100 dark:border-slate-800">
                  {record.details}
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  )
}
