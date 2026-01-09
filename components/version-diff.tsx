"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitCompare, Download, Plus, Minus, Edit3, AlertCircle, FileText, ArrowLeftRight, Loader2 } from "lucide-react"

interface DiffLine {
  type: "added" | "removed" | "unchanged" | "modified"
  lineNumber: { old?: number; new?: number }
  content: string
}

interface VersionDiffProps {
  contractId: string
  contracts?: any[] // Keep for compatibility if needed, but we use contractId mainly
}

export function VersionDiff({ contractId }: VersionDiffProps) {
  const [versions, setVersions] = useState<any[]>([])
  const [version1, setVersion1] = useState<string>("")
  const [version2, setVersion2] = useState<string>("")
  const [showDiff, setShowDiff] = useState(false)
  const [viewMode, setViewMode] = useState<"split" | "unified">("unified")
  const [diffData, setDiffData] = useState<DiffLine[]>([])
  const [loadingVersions, setLoadingVersions] = useState(false)
  const [comparing, setComparing] = useState(false)
  const [versionNames, setVersionNames] = useState({ v1: "", v2: "" })

  useEffect(() => {
    if (contractId) {
      fetchVersions()
      setShowDiff(false)
      setVersion1("")
      setVersion2("")
    }
  }, [contractId])

  async function fetchVersions() {
    setLoadingVersions(true)
    try {
      const res = await fetch(`/api/contracts/${contractId}/versions`)
      if (res.ok) {
        const data = await res.json()
        setVersions(data || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingVersions(false)
    }
  }

  const handleCompare = async () => {
    if (version1 && version2) {
      setComparing(true)
      try {
        const res = await fetch("/api/contracts/versions/compare", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ version1Id: version1, version2Id: version2 })
        })
        if (res.ok) {
            const data = await res.json()
            setDiffData(data.diff)
            setVersionNames({ v1: data.v1.name, v2: data.v2.name })
            setShowDiff(true)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setComparing(false)
      }
    }
  }

  const stats = {
    added: diffData.filter((d) => d.type === "added").length,
    removed: diffData.filter((d) => d.type === "removed").length,
    unchanged: diffData.filter((d) => d.type === "unchanged").length,
  }

  if (loadingVersions) {
      return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  if (versions.length < 2) {
      return (
          <div className="text-center py-12 text-muted-foreground">
              <GitCompare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>É necessário ter pelo menos 2 versões para comparar.</p>
          </div>
      )
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
                  {versions.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      v{v.version_number} - {new Date(v.created_at).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nova Versão</label>
              <Select value={version2} onValueChange={setVersion2}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a versão para comparar" />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      v{v.version_number} - {new Date(v.created_at).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full" onClick={handleCompare} disabled={!version1 || !version2 || version1 === version2 || comparing}>
            {comparing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowLeftRight className="h-4 w-4 mr-2" />}
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
                    {versionNames.v1} → {versionNames.v2}
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Diff
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
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
