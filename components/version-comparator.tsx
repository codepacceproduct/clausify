"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GitCompare, Download, FileText, AlertCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const contracts = [
  { id: "1", name: "Contrato Alpha Tech - v1.0", date: "15/01/2025" },
  { id: "2", name: "Contrato Alpha Tech - v2.0", date: "20/01/2025" },
  { id: "3", name: "Contrato Beta Construção - v1.0", date: "10/01/2025" },
  { id: "4", name: "Contrato Beta Construção - v1.5", date: "18/01/2025" },
]

const mockDifferences = [
  {
    section: "Cláusula 3 - Prazo de Vigência",
    type: "modified" as const,
    original: "O contrato terá vigência de 12 (doze) meses",
    modified: "O contrato terá vigência de 24 (vinte e quatro) meses",
    impact: "high" as const,
  },
  {
    section: "Cláusula 5 - Valor do Contrato",
    type: "modified" as const,
    original: "R$ 250.000,00 (duzentos e cinquenta mil reais)",
    modified: "R$ 350.000,00 (trezentos e cinquenta mil reais)",
    impact: "high" as const,
  },
  {
    section: "Cláusula 8 - Rescisão",
    type: "added" as const,
    modified: "Qualquer das partes poderá rescindir mediante aviso prévio de 60 dias",
    impact: "medium" as const,
  },
  {
    section: "Cláusula 10 - Confidencialidade",
    type: "modified" as const,
    original: "As informações serão mantidas em sigilo por 2 anos",
    modified: "As informações serão mantidas em sigilo por 5 anos",
    impact: "medium" as const,
  },
  {
    section: "Cláusula 12 - Multa por Atraso",
    type: "removed" as const,
    original: "Multa de 2% sobre o valor total em caso de atraso",
    impact: "high" as const,
  },
  {
    section: "Cláusula 15 - Garantias",
    type: "added" as const,
    modified: "O contratado prestará garantia bancária de 10% do valor",
    impact: "high" as const,
  },
]

export function VersionComparator() {
  const [version1, setVersion1] = useState<string>("")
  const [version2, setVersion2] = useState<string>("")
  const [comparing, setComparing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleCompare = async () => {
    setComparing(true)
    // Simulate comparison
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setComparing(false)
    setShowResults(true)
  }

  return (
    <div className="space-y-6">
      {/* Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Versões para Comparar</CardTitle>
          <CardDescription>Escolha duas versões do mesmo contrato ou contratos diferentes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Versão Original</label>
              <Select value={version1} onValueChange={setVersion1}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a versão 1" />
                </SelectTrigger>
                <SelectContent>
                  {contracts.map((contract) => (
                    <SelectItem key={contract.id} value={contract.id}>
                      {contract.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {version1 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  <span>{contracts.find((c) => c.id === version1)?.date}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nova Versão</label>
              <Select value={version2} onValueChange={setVersion2}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a versão 2" />
                </SelectTrigger>
                <SelectContent>
                  {contracts.map((contract) => (
                    <SelectItem key={contract.id} value={contract.id}>
                      {contract.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {version2 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  <span>{contracts.find((c) => c.id === version2)?.date}</span>
                </div>
              )}
            </div>
          </div>

          <Button className="w-full" onClick={handleCompare} disabled={!version1 || !version2 || comparing}>
            {comparing ? (
              "Comparando..."
            ) : (
              <>
                <GitCompare className="h-4 w-4 mr-2" />
                Comparar Versões
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && (
        <>
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo das Diferenças</CardTitle>
              <CardDescription>Análise comparativa entre as versões selecionadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <span className="text-2xl font-bold">6</span>
                  <span className="text-xs text-muted-foreground">Total de alterações</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <span className="text-2xl font-bold text-amber-600">3</span>
                  <span className="text-xs text-muted-foreground">Modificações</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <span className="text-2xl font-bold text-success">2</span>
                  <span className="text-xs text-muted-foreground">Adições</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <span className="text-2xl font-bold text-destructive">1</span>
                  <span className="text-xs text-muted-foreground">Remoções</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    Atenção: 4 alterações de alto impacto detectadas
                  </p>
                  <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                    Recomendamos análise jurídica detalhada antes da aprovação
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Comparison */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Comparação Detalhada</CardTitle>
                  <CardDescription>Diferenças identificadas cláusula por cláusula</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Relatório
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {mockDifferences.map((diff, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{diff.section}</h3>
                          <Badge
                            variant={
                              diff.type === "added" ? "default" : diff.type === "removed" ? "destructive" : "secondary"
                            }
                            className={
                              diff.type === "added"
                                ? "bg-success/10 text-success hover:bg-success/20"
                                : diff.type === "removed"
                                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                                  : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                            }
                          >
                            {diff.type === "added" ? "Adicionado" : diff.type === "removed" ? "Removido" : "Modificado"}
                          </Badge>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            diff.impact === "high"
                              ? "border-destructive text-destructive"
                              : diff.impact === "medium"
                                ? "border-amber-500 text-amber-600"
                                : "border-muted-foreground text-muted-foreground"
                          }
                        >
                          {diff.impact === "high"
                            ? "Alto Impacto"
                            : diff.impact === "medium"
                              ? "Médio Impacto"
                              : "Baixo Impacto"}
                        </Badge>
                      </div>

                      {diff.type === "modified" && (
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Versão Original</p>
                            <div className="p-3 bg-destructive/5 border border-destructive/20 rounded text-sm">
                              {diff.original}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Nova Versão</p>
                            <div className="p-3 bg-success/5 border border-success/20 rounded text-sm">
                              {diff.modified}
                            </div>
                          </div>
                        </div>
                      )}

                      {diff.type === "added" && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Conteúdo Adicionado</p>
                          <div className="p-3 bg-success/5 border border-success/20 rounded text-sm">
                            {diff.modified}
                          </div>
                        </div>
                      )}

                      {diff.type === "removed" && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Conteúdo Removido</p>
                          <div className="p-3 bg-destructive/5 border border-destructive/20 rounded text-sm line-through">
                            {diff.original}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
