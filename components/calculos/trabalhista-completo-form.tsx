"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Calculator, Download, AlertCircle, DollarSign, Calendar, FileText, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function TrabalhistaCompletoForm() {
  const [salario, setSalario] = useState("")
  const [dataAdmissao, setDataAdmissao] = useState("")
  const [dataDemissao, setDataDemissao] = useState("")
  const [incluirFerias, setIncluirFerias] = useState(true)
  const [incluir13, setIncluir13] = useState(true)
  const [incluirAviso, setIncluirAviso] = useState(true)
  const [resultado, setResultado] = useState<{
    saldoSalario: number
    ferias: number
    decimoTerceiro: number
    avisoPrevi: number
    fgts: number
    multaFgts: number
    total: number
  } | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCalcular = async () => {
    const sal = Number.parseFloat(salario.replace(/\./g, "").replace(",", "."))
    if (!sal || !dataAdmissao || !dataDemissao) {
        setError("Preencha todos os campos obrigatórios")
        return
    }

    setIsLoading(true)
    setError("")
    setResultado(null)

    try {
        const response = await fetch("/api/calculos/trabalhista-completo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                salario: sal,
                dataAdmissao,
                dataDemissao,
                incluirFerias,
                incluir13,
                incluirAviso
            })
        })

        if (!response.ok) throw new Error("Erro no cálculo")
        
        const data = await response.json()
        setResultado(data)
    } catch (err) {
        setError("Erro ao calcular. Verifique os dados.")
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Cálculos Trabalhistas</h1>
            <p className="text-muted-foreground">
              Calculadora completa de verbas rescisórias e direitos trabalhistas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/60 shadow-sm bg-card">
            <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold">Dados do Trabalhador</CardTitle>
                        <CardDescription>
                            Preencha as informações contratuais para realizar o cálculo
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="salario" className="text-sm font-medium">Salário Mensal Bruto</Label>
                <div className="relative group">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        id="salario"
                        type="text"
                        placeholder="0,00"
                        className="pl-9 bg-muted/20 border-border/60 focus:bg-background transition-colors"
                        value={salario}
                        onChange={(e) => setSalario(e.target.value)}
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dataAdmissao">Data de Admissão</Label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        id="dataAdmissao"
                        type="date"
                        className="pl-9 bg-muted/20 border-border/60 focus:bg-background transition-colors"
                        value={dataAdmissao}
                        onChange={(e) => setDataAdmissao(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataDemissao">Data de Demissão</Label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        id="dataDemissao"
                        type="date"
                        className="pl-9 bg-muted/20 border-border/60 focus:bg-background transition-colors"
                        value={dataDemissao}
                        onChange={(e) => setDataDemissao(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/40">
                <Label className="text-base font-medium">Verbas a Calcular</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className={cn(
                        "flex items-center space-x-2 border p-3 rounded-lg transition-all duration-200 cursor-pointer",
                        incluirFerias ? "border-primary/50 bg-primary/5" : "border-border/60 hover:bg-muted/50"
                    )}>
                        <Checkbox
                            id="ferias"
                            checked={incluirFerias}
                            onCheckedChange={(checked) => setIncluirFerias(checked as boolean)}
                        />
                        <label htmlFor="ferias" className="text-sm font-medium leading-none cursor-pointer w-full select-none">
                            Férias + 1/3
                        </label>
                    </div>
                    <div className={cn(
                        "flex items-center space-x-2 border p-3 rounded-lg transition-all duration-200 cursor-pointer",
                        incluir13 ? "border-primary/50 bg-primary/5" : "border-border/60 hover:bg-muted/50"
                    )}>
                        <Checkbox
                            id="13"
                            checked={incluir13}
                            onCheckedChange={(checked) => setIncluir13(checked as boolean)}
                        />
                        <label htmlFor="13" className="text-sm font-medium leading-none cursor-pointer w-full select-none">
                            13º Salário
                        </label>
                    </div>
                    <div className={cn(
                        "flex items-center space-x-2 border p-3 rounded-lg transition-all duration-200 cursor-pointer",
                        incluirAviso ? "border-primary/50 bg-primary/5" : "border-border/60 hover:bg-muted/50"
                    )}>
                        <Checkbox
                            id="aviso"
                            checked={incluirAviso}
                            onCheckedChange={(checked) => setIncluirAviso(checked as boolean)}
                        />
                        <label htmlFor="aviso" className="text-sm font-medium leading-none cursor-pointer w-full select-none">
                            Aviso Prévio
                        </label>
                    </div>
                </div>
              </div>

              <Button 
                onClick={handleCalcular} 
                className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                    <>Calculando...</>
                ) : (
                    <>
                        <Calculator className="w-4 h-4 mr-2" />
                        Calcular Verbas Rescisórias
                    </>
                )}
              </Button>
              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm mt-2 bg-destructive/10 p-3 rounded-md border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
              )}
            </CardContent>
          </Card>
          </div>

          <div className="lg:col-span-5">
          <Card className="h-full border-border/60 shadow-sm flex flex-col bg-card overflow-hidden">
            <div className="p-6 border-b border-border/40 bg-muted/30">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Resultado do Cálculo
                </h2>
            </div>

            <div className="p-6 flex-1 flex flex-col">
            {resultado ? (
              <div className="space-y-6 flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-300">
                <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/10 text-center space-y-2 shadow-inner">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Valor Total da Rescisão</p>
                  <p className="text-4xl font-bold text-primary tracking-tight">
                    R$ {resultado.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/40 group">
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Saldo de Salário</span>
                    <Badge variant="outline" className="font-mono text-base font-normal bg-background/50">
                      R$ {resultado.saldoSalario.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </Badge>
                  </div>
                  {resultado.ferias > 0 && (
                    <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/40 group">
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Férias + 1/3</span>
                      <Badge variant="outline" className="font-mono text-base font-normal bg-background/50">
                        R$ {resultado.ferias.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </Badge>
                    </div>
                  )}
                  {resultado.decimoTerceiro > 0 && (
                    <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/40 group">
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">13º Salário Prop.</span>
                      <Badge variant="outline" className="font-mono text-base font-normal bg-background/50">
                        R$ {resultado.decimoTerceiro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </Badge>
                    </div>
                  )}
                  {resultado.avisoPrevi > 0 && (
                    <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/40 group">
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Aviso Prévio Ind.</span>
                      <Badge variant="outline" className="font-mono text-base font-normal bg-background/50">
                        R$ {resultado.avisoPrevi.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </Badge>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/40 group">
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Saldo FGTS</span>
                    <Badge variant="outline" className="font-mono text-base font-normal bg-background/50">
                      R$ {resultado.fgts.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/40 group">
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Multa 40% FGTS</span>
                    <Badge variant="outline" className="font-mono text-base font-normal bg-background/50">
                      R$ {resultado.multaFgts.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                    <Button variant="outline" className="w-full border-border/60 hover:bg-muted/50 hover:text-primary transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Relatório PDF
                    </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12 space-y-4 opacity-60">
                <div className="p-4 bg-muted/50 rounded-full border border-border/40">
                    <Calculator className="w-8 h-8 opacity-50" />
                </div>
                <div className="text-center space-y-1">
                    <p className="font-medium text-foreground">Aguardando dados</p>
                    <p className="text-sm max-w-[200px] mx-auto">Preencha o formulário ao lado para visualizar o resultado detalhado</p>
                </div>
              </div>
            )}
            </div>
          </Card>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
