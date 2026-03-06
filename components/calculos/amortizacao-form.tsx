"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Calculator, ArrowLeft, TrendingDown, TrendingUp, DollarSign, Calendar, Percent } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function AmortizacaoForm() {
  const [formData, setFormData] = useState({
    valorEmprestimo: "",
    taxaJurosMensal: "",
    prazoMeses: ""
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/calculos/amortizacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/calculos">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Amortização SAC e PRICE</h1>
            <p className="text-sm text-muted-foreground">Compare sistemas de amortização e calcule parcelas</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-border/60 shadow-sm bg-card h-full">
                <CardHeader className="border-b border-border/40 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Calculator className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">Parâmetros</CardTitle>
                            <CardDescription>
                                Dados do financiamento
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                    <Label>Valor do Empréstimo (R$)</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                        type="number" 
                        value={formData.valorEmprestimo}
                        onChange={(e) => setFormData({...formData, valorEmprestimo: e.target.value})}
                        placeholder="Ex: 100000.00"
                        className="pl-9 bg-background/50"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Taxa de Juros Mensal (%)</Label>
                    <div className="relative">
                        <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                        type="number" 
                        step="0.01"
                        value={formData.taxaJurosMensal}
                        onChange={(e) => setFormData({...formData, taxaJurosMensal: e.target.value})}
                        placeholder="Ex: 0.99"
                        className="pl-9 bg-background/50"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Prazo (Meses)</Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                        type="number" 
                        value={formData.prazoMeses}
                        onChange={(e) => setFormData({...formData, prazoMeses: e.target.value})}
                        placeholder="Ex: 120"
                        className="pl-9 bg-background/50"
                        />
                    </div>
                </div>
                <Button onClick={handleCalculate} className="w-full mt-2" disabled={loading}>
                    {loading ? "Calculando..." : "Comparar Sistemas"}
                </Button>
                </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
                {result ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-sm">
                            <CardHeader className="pb-2">
                            <CardTitle className="text-emerald-700 dark:text-emerald-400 flex items-center gap-2 text-lg">
                                <TrendingUp className="w-5 h-5" />
                                Recomendação: {result.melhorOpcao}
                            </CardTitle>
                            </CardHeader>
                            <CardContent>
                            <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
                                A opção mais econômica gera uma economia total de <span className="font-bold">R$ {result.diferencaJuros}</span> em juros ao final do contrato.
                            </p>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Sistema PRICE */}
                            <Card className="border-border/60 shadow-sm bg-card hover:border-primary/20 transition-all duration-300">
                                <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                                Sistema PRICE
                                            </CardTitle>
                                            <CardDescription>Parcelas Fixas</CardDescription>
                                        </div>
                                        <Badge variant="outline" className="bg-background">Tabela Price</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Valor da Parcela</span>
                                        <div className="text-xl font-bold text-foreground mt-1">R$ {result.price.parcela}</div>
                                        <span className="text-xs text-muted-foreground">(Fixa do início ao fim)</span>
                                    </div>
                                    
                                    <div className="space-y-2 pt-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Total Pago:</span>
                                            <span className="font-medium">R$ {result.price.totalPago}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Total Juros:</span>
                                            <span className="font-medium text-destructive">R$ {result.price.totalJuros}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Sistema SAC */}
                            <Card className="border-border/60 shadow-sm bg-card hover:border-primary/20 transition-all duration-300">
                                <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                                Sistema SAC
                                            </CardTitle>
                                            <CardDescription>Parcelas Decrescentes</CardDescription>
                                        </div>
                                        <Badge variant="outline" className="bg-background">Amortização Constante</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Primeira Parcela</span>
                                        <div className="text-xl font-bold text-foreground mt-1">R$ {result.sac.primeiraParcela}</div>
                                        <span className="text-xs text-muted-foreground">Última: R$ {result.sac.ultimaParcela}</span>
                                    </div>
                                    
                                    <div className="space-y-2 pt-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Total Pago:</span>
                                            <span className="font-medium">R$ {result.sac.totalPago}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Total Juros:</span>
                                            <span className="font-medium text-emerald-600 dark:text-emerald-400">R$ {result.sac.totalJuros}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 text-muted-foreground border-2 border-dashed border-border/40 rounded-xl bg-muted/5">
                        <div className="p-4 bg-muted/30 rounded-full mb-4">
                            <TrendingDown className="w-8 h-8 opacity-40" />
                        </div>
                        <h3 className="text-lg font-medium mb-2 text-foreground">Aguardando Parâmetros</h3>
                        <p className="max-w-xs text-sm opacity-60">
                            Preencha os dados do empréstimo para comparar as tabelas SAC e PRICE.
                        </p>
                    </div>
                )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}