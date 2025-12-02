"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitCompare, Download, Plus, Minus, Edit3, AlertCircle, FileText, ArrowLeftRight } from "lucide-react"

interface DiffLine {
  type: "added" | "removed" | "unchanged" | "modified"
  lineNumber: { old?: number; new?: number }
  content: string
  oldContent?: string
}

const contracts = [
  { id: "1", name: "Contrato Alpha Tech - v3.0", date: "20/01/2025" },
  { id: "2", name: "Contrato Alpha Tech - v2.1", date: "15/01/2025" },
  { id: "3", name: "Contrato Alpha Tech - v2.0", date: "10/01/2025" },
  { id: "4", name: "Contrato Alpha Tech - v1.0", date: "01/01/2025" },
]

const diffData: DiffLine[] = [
  { type: "unchanged", lineNumber: { old: 1, new: 1 }, content: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS" },
  { type: "unchanged", lineNumber: { old: 2, new: 2 }, content: "" },
  { type: "unchanged", lineNumber: { old: 3, new: 3 }, content: "CLÁUSULA 1 - DAS PARTES" },
  { type: "unchanged", lineNumber: { old: 4, new: 4 }, content: "Contratante: Empresa XYZ Ltda..." },
  { type: "unchanged", lineNumber: { old: 5, new: 5 }, content: "" },
  { type: "unchanged", lineNumber: { old: 6, new: 6 }, content: "CLÁUSULA 3 - DO PRAZO" },
  {
    type: "removed",
    lineNumber: { old: 7 },
    content: "O contrato terá vigência de 12 (doze) meses, iniciando em 01/01/2025.",
  },
  {
    type: "added",
    lineNumber: { new: 7 },
    content: "O contrato terá vigência de 24 (vinte e quatro) meses, iniciando em 01/01/2025.",
  },
  { type: "unchanged", lineNumber: { old: 8, new: 8 }, content: "" },
  { type: "unchanged", lineNumber: { old: 9, new: 9 }, content: "CLÁUSULA 5 - DO VALOR" },
  {
    type: "removed",
    lineNumber: { old: 10 },
    content: "O valor total do contrato é de R$ 250.000,00 (duzentos e cinquenta mil reais).",
  },
  {
    type: "added",
    lineNumber: { new: 10 },
    content: "O valor total do contrato é de R$ 350.000,00 (trezentos e cinquenta mil reais).",
  },
  {
    type: "added",
    lineNumber: { new: 11 },
    content: "Parágrafo único: O pagamento será realizado em parcelas mensais.",
  },
  { type: "unchanged", lineNumber: { old: 11, new: 12 }, content: "" },
  { type: "unchanged", lineNumber: { old: 12, new: 13 }, content: "CLÁUSULA 8 - DA RESCISÃO" },
  { type: "removed", lineNumber: { old: 13 }, content: "A rescisão poderá ocorrer mediante aviso prévio de 30 dias." },
  {
    type: "added",
    lineNumber: { new: 14 },
    content: "A rescisão poderá ocorrer mediante aviso prévio de 60 dias, por qualquer das partes.",
  },
  {
    type: "added",
    lineNumber: { new: 15 },
    content: "Parágrafo primeiro: Em caso de rescisão antecipada, será devida multa de 10%.",
  },
  { type: "unchanged", lineNumber: { old: 14, new: 16 }, content: "" },
  { type: "unchanged", lineNumber: { old: 15, new: 17 }, content: "CLÁUSULA 10 - DA CONFIDENCIALIDADE" },
  {
    type: "removed",
    lineNumber: { old: 16 },
    content: "As informações trocadas entre as partes serão mantidas em sigilo por 2 (dois) anos.",
  },
  {
    type: "added",
    lineNumber: { new: 18 },
    content: "As informações trocadas entre as partes serão mantidas em sigilo por 5 (cinco) anos.",
  },
]

export function VersionDiff() {
  const [version1, setVersion1] = useState<string>("")
  const [version2, setVersion2] = useState<string>("")
  const [showDiff, setShowDiff] = useState(false)
  const [viewMode, setViewMode] = useState<"split" | "unified">("unified")

  const handleCompare = () => {
    if (version1 && version2) {
      setShowDiff(true)
    }
  }

  const stats = {
    added: diffData.filter((d) => d.type === "added").length,
    removed: diffData.filter((d) => d.type === "removed").length,
    unchanged: diffData.filter((d) => d.type === "unchanged").length,
  }

  return (
    <div className="space-y-6">
      {/* Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Comparar Versões
          </CardTitle>
          <CardDescription>Selecione duas versões para visualizar as diferenças</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Versão Anterior</label>
              <Select value={version1} onValueChange={setVersion1}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a versão base" />
                </SelectTrigger>
                <SelectContent>
                  {contracts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {version1 && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {contracts.find((c) => c.id === version1)?.date}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nova Versão</label>
              <Select value={version2} onValueChange={setVersion2}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a versão para comparar" />
                </SelectTrigger>
                <SelectContent>
                  {contracts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {version2 && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {contracts.find((c) => c.id === version2)?.date}
                </p>
              )}
            </div>
          </div>
          <Button className="w-full" onClick={handleCompare} disabled={!version1 || !version2 || version1 === version2}>
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Comparar Versões
          </Button>
        </CardContent>
      </Card>

      {/* Diff Results */}
      {showDiff && (
        <>
          {/* Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Resumo das Alterações</CardTitle>
                  <CardDescription>
                    {contracts.find((c) => c.id === version1)?.name} → {contracts.find((c) => c.id === version2)?.name}
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Diff
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                  <Plus className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-2xl font-bold text-success">{stats.added}</p>
                    <p className="text-xs text-muted-foreground">Linhas adicionadas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
                  <Minus className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="text-2xl font-bold text-destructive">{stats.removed}</p>
                    <p className="text-xs text-muted-foreground">Linhas removidas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Edit3 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{stats.unchanged}</p>
                    <p className="text-xs text-muted-foreground">Linhas inalteradas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-2xl font-bold text-amber-600">4</p>
                    <p className="text-xs text-muted-foreground">Cláusulas alteradas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diff View */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Visualização das Diferenças</CardTitle>
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "split" | "unified")}>
                  <TabsList>
                    <TabsTrigger value="unified">Unificado</TabsTrigger>
                    <TabsTrigger value="split">Lado a Lado</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] rounded-lg border">
                <div className="font-mono text-sm">
                  {diffData.map((line, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        line.type === "added" ? "bg-success/10" : line.type === "removed" ? "bg-destructive/10" : ""
                      }`}
                    >
                      {/* Line Numbers */}
                      <div className="flex-shrink-0 w-20 flex text-xs text-muted-foreground border-r bg-muted/50">
                        <span className="w-10 px-2 py-1 text-right border-r">{line.lineNumber.old || ""}</span>
                        <span className="w-10 px-2 py-1 text-right">{line.lineNumber.new || ""}</span>
                      </div>

                      {/* Change Indicator */}
                      <div className="flex-shrink-0 w-6 flex items-center justify-center">
                        {line.type === "added" && <Plus className="h-3 w-3 text-success" />}
                        {line.type === "removed" && <Minus className="h-3 w-3 text-destructive" />}
                      </div>

                      {/* Content */}
                      <div
                        className={`flex-1 px-4 py-1 ${
                          line.type === "added"
                            ? "text-success"
                            : line.type === "removed"
                              ? "text-destructive line-through"
                              : ""
                        }`}
                      >
                        {line.content || " "}
                      </div>
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
