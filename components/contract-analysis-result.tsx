"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  FileText, 
  Download, 
  Share2, 
  ChevronRight, 
  ChevronDown,
  Scale,
  ShieldCheck,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Issue {
  id: string
  severity: "high" | "medium" | "low"
  type: string
  clause: string
  originalText: string
  suggestion: string
  explanation: string
}

export function ContractAnalysisResult({ onReset, result }: { onReset: () => void, result?: any }) {
  const issues: Issue[] = result?.issues || []
  const score = result?.score || 0
  const riskLevel = result?.riskLevel || "unknown"
  
  const [activeIssue, setActiveIssue] = useState<string | null>(issues[0]?.id || null)

  const highRisks = issues.filter(i => i.severity === "high").length
  const mediumRisks = issues.filter(i => i.severity === "medium").length

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-bold tracking-tight">Resultado da Análise</h2>
            <Badge variant="outline" className="text-sm border-emerald-500 text-emerald-600 bg-emerald-50">
              Concluído
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Contrato de Prestação de Serviços - Alpha Tech.pdf
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onReset}>Nova Análise</Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Score Jurídico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-amber-600">{score}</span>
              <span className="text-sm text-muted-foreground mb-1">/ 100</span>
            </div>
            <Progress value={score} className="h-2 mt-2 bg-amber-100" />
            <p className="text-xs text-muted-foreground mt-2">Nível de segurança moderado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Riscos Críticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-8 w-8 text-destructive" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">2</span>
                <span className="text-xs text-muted-foreground">Cláusulas de Alto Risco</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pontos de Atenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{mediumRisks}</span>
                <span className="text-xs text-muted-foreground">Risco Médio</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conformidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">95%</span>
                <span className="text-xs text-muted-foreground">Adequação à LGPD</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analysis View */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar List */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Pontos Encontrados
            </CardTitle>
            <CardDescription>Selecione um item para ver detalhes</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="flex flex-col">
                {issues.map((issue) => (
                  <button
                    key={issue.id}
                    onClick={() => setActiveIssue(issue.id)}
                    className={cn(
                      "flex items-start gap-3 p-4 text-left transition-colors border-b last:border-0 hover:bg-muted/50",
                      activeIssue === issue.id ? "bg-muted border-l-4 border-l-emerald-600" : "border-l-4 border-l-transparent"
                    )}
                  >
                    <div className="mt-1">
                      {issue.severity === "high" && <XCircle className="h-4 w-4 text-destructive" />}
                      {issue.severity === "medium" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      {issue.severity === "low" && <Zap className="h-4 w-4 text-blue-500" />}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-sm leading-none">{issue.type}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{issue.clause}</p>
                    </div>
                    <ChevronRight className={cn("h-4 w-4 ml-auto text-muted-foreground transition-transform", activeIssue === issue.id && "rotate-90")} />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Detailed Diff View */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Detalhamento da Cláusula</span>
              {activeIssue && (
                <Badge variant={
                    issues.find(i => i.id === activeIssue)?.severity === "high" ? "destructive" :
                    issues.find(i => i.id === activeIssue)?.severity === "medium" ? "secondary" : "default"
                }>
                  {issues.find(i => i.id === activeIssue)?.severity === "high" ? "Alto Risco" : 
                   issues.find(i => i.id === activeIssue)?.severity === "medium" ? "Médio Risco" : "Sugestão"}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Comparativo entre o texto original e a sugestão da IA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeIssue && issues.find(i => i.id === activeIssue) && (() => {
              const issue = issues.find(i => i.id === activeIssue)!
              return (
                <>
                   {/* Explanation */}
                   <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900 flex gap-3">
                    <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">Análise da IA</h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                        {issue.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Comparison */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-destructive font-medium text-sm">
                        <XCircle className="h-4 w-4" />
                        Texto Original
                      </div>
                      <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20 text-sm leading-relaxed min-h-[120px]">
                        "{issue.originalText}"
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Sugestão Otimizada
                      </div>
                      <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm leading-relaxed min-h-[120px] dark:bg-emerald-950/30 dark:border-emerald-900">
                        "{issue.suggestion}"
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Button variant="ghost">Ignorar</Button>
                    <Button variant="outline">Editar Manualmente</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Aceitar Sugestão
                    </Button>
                  </div>
                </>
              )
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
