"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, Download, Plus, Trash2, Wallet, TrendingDown, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"

interface Divida {
  id: number
  nome: string
  valor: number
  parcela: number
}

export function SuperendividamentoForm() {
  const [rendaMensal, setRendaMensal] = useState("")
  const [despesasEssenciais, setDespesasEssenciais] = useState("")
  const [dividas, setDividas] = useState<Divida[]>([])
  const [resultado, setResultado] = useState<{
    totalDividas: number
    capacidadePagamento: number
    percentualComprometimento: number
    situacao: string
  } | null>(null)

  const adicionarDivida = () => {
    setDividas([...dividas, { id: Date.now(), nome: "", valor: 0, parcela: 0 }])
  }

  const removerDivida = (id: number) => {
    setDividas(dividas.filter((d) => d.id !== id))
  }

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCalcular = async () => {
    const renda = Number.parseFloat(rendaMensal.replace(/\./g, "").replace(",", "."))
    const despesas = Number.parseFloat(despesasEssenciais.replace(/\./g, "").replace(",", "."))

    if (!renda || !despesas) {
        setError("Preencha todos os campos financeiros")
        return
    }

    setIsLoading(true)
    setError("")
    setResultado(null)

    try {
        const response = await fetch("/api/calculos/superendividamento", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                rendaMensal: renda,
                despesasEssenciais: despesas,
                dividas
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
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Análise de Superendividamento</h1>
            <p className="text-sm text-muted-foreground">Avalie sua capacidade de pagamento e situação financeira</p>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm bg-card">
            <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-500">
                        <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold">Dados Financeiros</CardTitle>
                        <CardDescription>
                            Informe a renda e despesas essenciais
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rendaMensal">Renda Mensal (R$)</Label>
                <Input
                  id="rendaMensal"
                  type="text"
                  placeholder="0,00"
                  value={rendaMensal}
                  onChange={(e) => setRendaMensal(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="despesasEssenciais">Despesas Essenciais (R$)</Label>
                <Input
                  id="despesasEssenciais"
                  type="text"
                  placeholder="0,00"
                  value={despesasEssenciais}
                  onChange={(e) => setDespesasEssenciais(e.target.value)}
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Alimentação, moradia, transporte, saúde
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm bg-card">
            <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500/10 rounded-lg text-rose-600 dark:text-rose-500">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">Dívidas</CardTitle>
                            <CardDescription>
                                Liste suas dívidas atuais
                            </CardDescription>
                        </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={adicionarDivida} className="h-8">
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Adicionar
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-3">
                <AnimatePresence mode="popLayout">
                    {dividas.map((divida, index) => (
                        <motion.div 
                            key={divida.id} 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-4 bg-muted/40 rounded-lg space-y-3 border border-border/50"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Dívida {index + 1}</span>
                                <Button size="sm" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removerDivida(divida.id)}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                            <Input
                                placeholder="Descrição da dívida"
                                value={divida.nome}
                                onChange={(e) => {
                                    const newDividas = [...dividas]
                                    newDividas[index].nome = e.target.value
                                    setDividas(newDividas)
                                }}
                                className="bg-background/50 h-9"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Valor Total</Label>
                                    <Input
                                        type="number"
                                        placeholder="0,00"
                                        onChange={(e) => {
                                            const newDividas = [...dividas]
                                            newDividas[index].valor = Number.parseFloat(e.target.value) || 0
                                            setDividas(newDividas)
                                        }}
                                        className="bg-background/50 h-9"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Parcela Mensal</Label>
                                    <Input
                                        type="number"
                                        placeholder="0,00"
                                        onChange={(e) => {
                                            const newDividas = [...dividas]
                                            newDividas[index].parcela = Number.parseFloat(e.target.value) || 0
                                            setDividas(newDividas)
                                        }}
                                        className="bg-background/50 h-9"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {dividas.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border/40 rounded-xl bg-muted/5">
                        <p className="text-sm">Nenhuma dívida adicionada</p>
                        <Button variant="link" onClick={adicionarDivida} className="h-auto p-0 text-primary">
                            Clique para adicionar
                        </Button>
                    </div>
                )}
            
                <Button onClick={handleCalcular} className="w-full mt-4 bg-primary hover:bg-primary/90 shadow-sm" disabled={isLoading}>
                    {isLoading ? (
                        <>Calculating...</>
                    ) : (
                        <>
                            <Calculator className="w-4 h-4 mr-2" />
                            Analisar Situação
                        </>
                    )}
                </Button>
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
            <AnimatePresence mode="wait">
                {resultado ? (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Card className="border-border/60 shadow-md bg-card h-full">
                            <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Calculator className="w-5 h-5 text-primary" />
                                    Diagnóstico
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className={cn(
                                    "p-4 rounded-xl border flex items-center gap-4",
                                    resultado.situacao === "Saudável" && "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
                                    resultado.situacao === "Atenção" && "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
                                    resultado.situacao === "Superendividado" && "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400",
                                )}>
                                    <div className={cn(
                                        "p-2 rounded-full",
                                        resultado.situacao === "Saudável" && "bg-emerald-500/20",
                                        resultado.situacao === "Atenção" && "bg-amber-500/20",
                                        resultado.situacao === "Superendividado" && "bg-red-500/20",
                                    )}>
                                        {resultado.situacao === "Saudável" ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Situação Financeira</p>
                                        <p className="text-xl font-bold">{resultado.situacao}</p>
                                    </div>
                                </div>

                                <div className="grid gap-4">
                                    <div className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/20 transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-muted-foreground">Total de Dívidas (Mensal)</span>
                                            <Wallet className="w-4 h-4 text-muted-foreground/50" />
                                        </div>
                                        <span className="text-2xl font-bold">
                                            R$ {resultado.totalDividas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    
                                    <div className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/20 transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-muted-foreground">Capacidade de Pagamento</span>
                                            <DollarSignIcon className="w-4 h-4 text-muted-foreground/50" />
                                        </div>
                                        <span className="text-2xl font-bold text-primary">
                                            R$ {resultado.capacidadePagamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/20 transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-muted-foreground">Comprometimento da Renda</span>
                                            <TrendingDown className="w-4 h-4 text-muted-foreground/50" />
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <span className={cn(
                                                "text-2xl font-bold",
                                                resultado.percentualComprometimento > 50 ? "text-destructive" : "text-foreground"
                                            )}>
                                                {resultado.percentualComprometimento.toFixed(1)}%
                                            </span>
                                            <span className="text-xs text-muted-foreground mb-1">do total líquido</span>
                                        </div>
                                        <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
                                            <div 
                                                className={cn(
                                                    "h-full rounded-full",
                                                    resultado.percentualComprometimento > 50 ? "bg-destructive" : "bg-emerald-500"
                                                )}
                                                style={{ width: `${Math.min(resultado.percentualComprometimento, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 bg-blue-500/5 rounded-xl border border-blue-500/10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Recomendações</p>
                                    </div>
                                    <ul className="text-sm text-blue-700/80 dark:text-blue-400/80 space-y-2 list-disc pl-4">
                                        {resultado.situacao === "Saudável" && (
                                            <>
                                                <li>Sua situação financeira está equilibrada.</li>
                                                <li>Continue monitorando suas despesas mensalmente.</li>
                                                <li>Considere criar uma reserva de emergência de 6 meses.</li>
                                            </>
                                        )}
                                        {resultado.situacao === "Atenção" && (
                                            <>
                                                <li>Suas dívidas estão comprometendo significativamente sua renda.</li>
                                                <li>Evite contrair novas dívidas ou parcelamentos.</li>
                                                <li>Considere renegociar taxas de juros com os credores.</li>
                                            </>
                                        )}
                                        {resultado.situacao === "Superendividado" && (
                                            <>
                                                <li>Situação crítica - busque ajuda especializada imediatamente.</li>
                                                <li>Procure a Defensoria Pública ou órgãos de defesa do consumidor.</li>
                                                <li>Solicite renegociação global de dívidas (Lei do Superendividamento).</li>
                                            </>
                                        )}
                                    </ul>
                                </div>

                                <Button variant="outline" className="w-full gap-2">
                                    <Download className="w-4 h-4" />
                                    Exportar Relatório PDF
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 text-muted-foreground border-2 border-dashed border-border/40 rounded-xl bg-muted/5">
                        <div className="p-4 bg-muted/30 rounded-full mb-4">
                            <Calculator className="w-8 h-8 opacity-40" />
                        </div>
                        <h3 className="text-lg font-medium mb-2 text-foreground">Aguardando Dados</h3>
                        <p className="max-w-xs text-sm opacity-60">
                            Preencha as informações financeiras e adicione suas dívidas para gerar o diagnóstico completo.
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

function DollarSignIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    )
}
