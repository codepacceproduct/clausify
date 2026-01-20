"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitCompare, Download, Plus, Minus, Edit3, AlertCircle, FileText, ArrowLeftRight, Loader2 } from "lucide-react"
import { VersionDiffSkeleton } from "@/components/contracts/skeletons"

interface DiffLine {
  type: "added" | "removed" | "unchanged" | "modified"
  lineNumber: { old?: number; new?: number }
  content: string
}

interface VersionDiffProps {
  contractId: string
  contracts?: any[] // Keep for compatibility if needed, but we use contractId mainly
}

export function VersionDiff({ contractId, initialVersions = [] }: VersionDiffProps & { initialVersions?: any[] }) {
  const [versions, setVersions] = useState<any[]>(initialVersions)
  const [version1, setVersion1] = useState<string>("")
  const [version2, setVersion2] = useState<string>("")
  const [showDiff, setShowDiff] = useState(false)
  const [viewMode, setViewMode] = useState<"split" | "unified">("unified")
  const [diffData, setDiffData] = useState<DiffLine[]>([])
  const [loadingVersions, setLoadingVersions] = useState(initialVersions.length === 0)
  const [comparing, setComparing] = useState(false)
  const [versionNames, setVersionNames] = useState({ v1: "", v2: "" })

  useEffect(() => {
    if (initialVersions.length > 0 && versions.length === 0) {
      setVersions(initialVersions)
      setLoadingVersions(false)
    } else if (contractId && initialVersions.length === 0) {
      fetchVersions()
      setShowDiff(false)
      setVersion1("")
      setVersion2("")
    }
  }, [contractId, initialVersions])

  useEffect(() => {
    if (versions.length === 1) {
      setVersion2(versions[0].id)
    }
  }, [versions])

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

  if (loadingVersions) {
      return <VersionDiffSkeleton />
  }

  const handleCompare = async () => {
    if (version2) {
      if (version1) {
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
      } else {
        // Preview single version (compare against empty)
        const v2 = versions.find(v => v.id === version2)
        if (v2) {
            const content = v2.content || ""
            const lines = content.split('\n')
            const diff: DiffLine[] = lines.map((line: string, i: number) => ({
                type: "added",
                lineNumber: { new: i + 1 },
                content: line
            }))
            setDiffData(diff)
            setVersionNames({ v1: "Início", v2: `v${v2.version_number}` })
            setShowDiff(true)
        }
      }
    }
  }

  // Process diff data for split view
  const getSplitRows = () => {
    const rows: { left: DiffLine | null; right: DiffLine | null }[] = []
    let i = 0
    while (i < diffData.length) {
      const current = diffData[i]
      if (current.type === "unchanged") {
        rows.push({ left: current, right: current })
        i++
      } else if (current.type === "removed") {
        // Check for modification (removed followed by added)
        if (i + 1 < diffData.length && diffData[i + 1].type === "added") {
          rows.push({ left: current, right: diffData[i + 1] })
          i += 2
        } else {
          rows.push({ left: current, right: null })
          i++
        }
      } else if (current.type === "added") {
        rows.push({ left: null, right: current })
        i++
      } else {
        rows.push({ left: current, right: current })
        i++
      }
    }
    return rows
  }

  const splitRows = getSplitRows()

  const stats = {
    added: diffData.filter((d) => d.type === "added").length,
    removed: diffData.filter((d) => d.type === "removed").length,
    unchanged: diffData.filter((d) => d.type === "unchanged").length,
  }

  if (versions.length === 0) {
      return (
          <div className="text-center py-12 text-muted-foreground">
              <GitCompare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma versão encontrada para este contrato.</p>
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
            {versions.length > 1 ? "Comparar Versões" : "Visualizar Versão"}
          </CardTitle>
          <CardDescription>
            {versions.length > 1 
              ? "Selecione duas versões para visualizar as diferenças" 
              : "Visualize o conteúdo da versão atual"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {versions.length > 1 && (
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
            )}
            <div className={versions.length > 1 ? "space-y-2" : "space-y-2 col-span-2"}>
              <label className="text-sm font-medium">{versions.length > 1 ? "Nova Versão" : "Versão"}</label>
              <Select value={version2} onValueChange={setVersion2}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a versão" />
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
          <Button 
            className="w-full" 
            onClick={handleCompare} 
            disabled={!version2 || (versions.length > 1 && !version1) || (version1 && version1 === version2) || comparing}
          >
            {comparing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowLeftRight className="h-4 w-4 mr-2" />}
            {versions.length > 1 ? "Comparar Versões" : "Visualizar Versão"}
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
                  {viewMode === "unified" ? (
                    diffData.map((line, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          line.type === "added"
                            ? "bg-success/10"
                            : line.type === "removed"
                              ? "bg-destructive/10"
                              : ""
                        }`}
                      >
                        {/* Line Numbers */}
                        <div className="flex-shrink-0 w-20 flex text-xs text-muted-foreground border-r bg-muted/50 select-none">
                          <span className="w-10 px-2 py-1 text-right border-r">{line.lineNumber.old || ""}</span>
                          <span className="w-10 px-2 py-1 text-right">{line.lineNumber.new || ""}</span>
                        </div>

                        {/* Change Indicator */}
                        <div className="flex-shrink-0 w-6 flex items-center justify-center select-none">
                          {line.type === "added" && <Plus className="h-3 w-3 text-success" />}
                          {line.type === "removed" && <Minus className="h-3 w-3 text-destructive" />}
                        </div>

                        {/* Content */}
                        <div
                          className={`flex-1 px-4 py-1 whitespace-pre-wrap break-all ${
                            line.type === "added"
                              ? "text-success"
                              : line.type === "removed"
                                ? "text-destructive line-through decoration-destructive/50"
                                : ""
                          }`}
                        >
                          {line.content || " "}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Split View
                    <div className="w-full">
                      {/* Header */}
                      <div className="flex border-b sticky top-0 bg-background z-10 font-medium text-xs text-muted-foreground">
                        <div className="flex-1 border-r p-2 text-center bg-muted/30">Versão Anterior</div>
                        <div className="flex-1 p-2 text-center bg-muted/30">Nova Versão</div>
                      </div>
                      
                      {splitRows.map((row, index) => (
                        <div key={index} className="flex border-b last:border-0">
                          {/* Left Column (Old) */}
                          <div className={`flex-1 flex border-r overflow-hidden ${
                            row.left?.type === "removed" ? "bg-destructive/5" : ""
                          }`}>
                            <div className="w-10 px-2 py-1 text-right text-xs text-muted-foreground border-r bg-muted/30 select-none flex-shrink-0">
                              {row.left?.lineNumber.old || ""}
                            </div>
                            <div className={`flex-1 px-3 py-1 whitespace-pre-wrap break-all ${
                                row.left?.type === "removed" ? "text-destructive" : ""
                              }`}>
                              {row.left?.content || ""}
                            </div>
                          </div>

                          {/* Right Column (New) */}
                          <div className={`flex-1 flex overflow-hidden ${
                            row.right?.type === "added" ? "bg-success/5" : ""
                          }`}>
                            <div className="w-10 px-2 py-1 text-right text-xs text-muted-foreground border-r bg-muted/30 select-none flex-shrink-0">
                              {row.right?.lineNumber.new || ""}
                            </div>
                            <div className={`flex-1 px-3 py-1 whitespace-pre-wrap break-all ${
                                row.right?.type === "added" ? "text-success" : ""
                              }`}>
                              {row.right?.content || ""}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
