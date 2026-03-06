"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, AlertTriangle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Badge } from "@/components/ui/badge"

export function InsalubridadeForm() {
  const [salarioMinimo, setSalarioMinimo] = useState("1412,00")
  const [salarioBase, setSalarioBase] = useState("")
  const [grauInsalubridade, setGrauInsalubridade] = useState("20") // 10, 20, 40
  const [temPericulosidade, setTemPericulosidade] = useState("nao")
  const [resultado, setResultado] = useState<{
    adicionalInsalubridade: number
    adicionalPericulosidade: number
    totalAdicionais: number
    salarioFinal: number
  } | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCalcular = async () => {
    const min = Number.parseFloat(salarioMinimo.replace(/\./g, "").replace(",", "."))
    const base = Number.parseFloat(salarioBase.replace(/\./g, "").replace(",", "."))
    
    if (!min || !base) {
        setError("Preencha os valores de salário")
        return
    }

    setIsLoading(true)
    setError("")
    setResultado(null)

    try {
        const response = await fetch("/api/calculos/insalubridade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                salarioMinimo: min,
                salarioBase: base,
                grauInsalubridade: Number(grauInsalubridade),
                temPericulosidade: temPericulosidade === "sim"
            })
        })

        if (!response.ok) throw new Error("Erro no cálculo")
        
        const data = await response.json()
        setResultado(data)
    } catch (err) {
        setError("Erro ao calcular.")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/calculos">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Insalubridade e Periculosidade</h1>
            <p className="text-muted-foreground">Calcule adicionais sobre o salário mínimo ou base</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/60 shadow-sm bg-card h-full">
            <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-500">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold">Parâmetros do Cálculo</CardTitle>
                        <CardDescription>
                            Configure os valores para calcular os adicionais
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="salarioMinimo" className="text-sm font-medium">Salário Mínimo Vigente (R$)</Label>
                  <Input
                    id="salarioMinimo"
                    value={salarioMinimo}
                    onChange={(e) => setSalarioMinimo(e.target.value)}
                    className="bg-muted/20 border-border/60 focus:bg-background transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salarioBase" className="text-sm font-medium">Salário Base do Trabalhador (R$)</Label>
                  <Input
                    id="salarioBase"
                    placeholder="0,00"
                    value={salarioBase}
                    onChange={(e) => setSalarioBase(e.target.value)}
                    className="bg-muted/20 border-border/60 focus:bg-background transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="grau" className="text-sm font-medium">Grau de Insalubridade</Label>
                    <Select value={grauInsalubridade} onValueChange={setGrauInsalubridade}>
                        <SelectTrigger className="bg-muted/20 border-border/60">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="10">Grau Mínimo (10%)</SelectItem>
                        <SelectItem value="20">Grau Médio (20%)</SelectItem>
                        <SelectItem value="40">Grau Máximo (40%)</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">Base: Salário Mínimo</p>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="periculosidade" className="text-sm font-medium">Periculosidade?</Label>
                    <Select value={temPericulosidade} onValueChange={setTemPericulosidade}>
                        <SelectTrigger className="bg-muted/20 border-border/60">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="nao">Não</SelectItem>
                        <SelectItem value="sim">Sim (30%)</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">Base: Salário Base</p>
                    </div>
                </div>

                <div className="pt-4">
                    <Button 
                        onClick={handleCalcular} 
                        className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all"
                        size="lg"
                        disabled={isLoading}
                    >
                    {isLoading ? "Calculando..." : "Calcular Adicionais"}
                    </Button>
                </div>
                {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm mt-2 bg-destructive/10 p-3 rounded-md border border-destructive/20 animate-in fade-in">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm bg-card h-full flex flex-col">
            <CardHeader className="border-b border-border/40 pb-4 bg-muted/30">
                <CardTitle className="text-lg font-semibold">Resultado</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col">
              {resultado ? (
                <div className="space-y-6 flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-300">
                  <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl border border-emerald-500/10 text-center space-y-2 shadow-inner">
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Total de Adicionais</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                      R$ {resultado.totalAdicionais.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/40 group">
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Insalubridade ({grauInsalubridade}%)</span>
                      <Badge variant="outline" className="font-mono text-base font-normal bg-background/50">
                        R$ {resultado.adicionalInsalubridade.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </Badge>
                    </div>
                    {resultado.adicionalPericulosidade > 0 && (
                      <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/40 group">
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Periculosidade (30%)</span>
                        <Badge variant="outline" className="font-mono text-base font-normal bg-background/50">
                          R$ {resultado.adicionalPericulosidade.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </Badge>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border/40 mt-4 pt-3">
                      <span className="text-sm font-medium text-foreground">Salário Final Estimado</span>
                      <span className="font-bold font-mono text-lg text-foreground">
                        R$ {resultado.salarioFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto">
                    <Button variant="outline" className="w-full border-border/60 hover:bg-muted/50 hover:text-primary transition-colors">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Relatório
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12 space-y-4 opacity-60">
                    <div className="p-4 bg-muted/50 rounded-full border border-border/40">
                        <AlertTriangle className="w-8 h-8 opacity-50" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="font-medium text-foreground">Aguardando cálculo</p>
                        <p className="text-sm max-w-[200px] mx-auto">Preencha os dados ao lado para ver o resultado</p>
                    </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
}
