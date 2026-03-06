"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Clock, Download, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export function HorasExtrasForm() {
  const [salario, setSalario] = useState("")
  const [jornadaMensal, setJornadaMensal] = useState("220")
  const [qtdHoras50, setQtdHoras50] = useState("0")
  const [qtdHoras100, setQtdHoras100] = useState("0")
  
  const [resultado, setResultado] = useState<{
    valorHoraNormal: number
    valorHora50: number
    valorHora100: number
    total50: number
    total100: number
    totalGeral: number
    dsr: number
  } | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCalcular = async () => {
    const sal = Number.parseFloat(salario.replace(/\./g, "").replace(",", "."))
    const jornada = Number.parseFloat(jornadaMensal)
    
    if (!sal || !jornada) {
        setError("Preencha o salário e jornada")
        return
    }

    setIsLoading(true)
    setError("")
    setResultado(null)

    try {
        const response = await fetch("/api/calculos/horas-extras", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                salario: sal,
                jornadaMensal: jornada,
                qtdHoras50: Number(qtdHoras50),
                qtdHoras100: Number(qtdHoras100)
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Horas Extras</h1>
            <p className="text-muted-foreground">Calcule horas extras (50%, 100%) e DSR</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/60 shadow-sm bg-card h-full">
            <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-500">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold">Dados da Jornada</CardTitle>
                        <CardDescription>
                            Informe o salário e horas trabalhadas
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="salario" className="text-sm font-medium">Salário Base (R$)</Label>
                  <Input
                    id="salario"
                    placeholder="0,00"
                    value={salario}
                    onChange={(e) => setSalario(e.target.value)}
                    className="bg-muted/20 border-border/60 focus:bg-background transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jornada" className="text-sm font-medium">Jornada Mensal (Horas)</Label>
                  <Input
                    id="jornada"
                    type="number"
                    value={jornadaMensal}
                    onChange={(e) => setJornadaMensal(e.target.value)}
                    className="bg-muted/20 border-border/60 focus:bg-background transition-colors"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Padrão CLT: 220h</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="horas50" className="text-sm font-medium">Horas 50%</Label>
                        <Input
                          id="horas50"
                          type="number"
                          value={qtdHoras50}
                          onChange={(e) => setQtdHoras50(e.target.value)}
                          className="bg-muted/20 border-border/60 focus:bg-background transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="horas100" className="text-sm font-medium">Horas 100%</Label>
                        <Input
                          id="horas100"
                          type="number"
                          value={qtdHoras100}
                          onChange={(e) => setQtdHoras100(e.target.value)}
                          className="bg-muted/20 border-border/60 focus:bg-background transition-colors"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <Button 
                        onClick={handleCalcular} 
                        className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all"
                        size="lg"
                        disabled={isLoading}
                    >
                    {isLoading ? "Calculando..." : "Calcular Horas Extras"}
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
                  <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/10 text-center space-y-2 shadow-inner">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Total a Receber</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                      R$ {resultado.totalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/40 group">
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Valor Hora Normal</span>
                      <Badge variant="outline" className="font-mono text-base font-normal bg-background/50">
                        R$ {resultado.valorHoraNormal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </Badge>
                    </div>
                    {resultado.total50 > 0 && (
                        <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/40 group">
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Total HE 50%</span>
                          <Badge variant="outline" className="font-mono text-base font-normal bg-background/50">
                            R$ {resultado.total50.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </Badge>
                        </div>
                    )}
                    {resultado.total100 > 0 && (
                        <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/40 group">
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Total HE 100%</span>
                          <Badge variant="outline" className="font-mono text-base font-normal bg-background/50">
                            R$ {resultado.total100.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </Badge>
                        </div>
                    )}
                    <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/40 group">
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">DSR sobre HE (Est. 1/6)</span>
                      <Badge variant="outline" className="font-mono text-base font-normal bg-background/50">
                        R$ {resultado.dsr.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </Badge>
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
                        <Clock className="w-8 h-8 opacity-50" />
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
