"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { HeartPulse, ArrowLeft, Calendar, User, Clock, CheckCircle2, AlertTriangle, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function AposentadoriaForm() {
  const [formData, setFormData] = useState({
    sexo: "M",
    idade: "",
    tempoContribuicaoAnos: ""
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/calculos/aposentadoria", {
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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Tempo de Aposentadoria</h1>
            <p className="text-sm text-muted-foreground">Análise de requisitos para aposentadoria (Regra Geral)</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-border/60 shadow-sm bg-card h-full">
                <CardHeader className="border-b border-border/40 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500/10 rounded-lg text-rose-600 dark:text-rose-500">
                            <HeartPulse className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">Dados do Segurado</CardTitle>
                            <CardDescription>
                                Informações previdenciárias
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                    <Label>Sexo</Label>
                    <Select 
                    value={formData.sexo} 
                    onValueChange={(value) => setFormData({...formData, sexo: value})}
                    >
                    <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Idade Atual (Anos)</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                        type="number" 
                        value={formData.idade}
                        onChange={(e) => setFormData({...formData, idade: e.target.value})}
                        placeholder="Ex: 60"
                        className="pl-9 bg-background/50"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Tempo de Contribuição (Anos)</Label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                        type="number" 
                        value={formData.tempoContribuicaoAnos}
                        onChange={(e) => setFormData({...formData, tempoContribuicaoAnos: e.target.value})}
                        placeholder="Ex: 25"
                        className="pl-9 bg-background/50"
                        />
                    </div>
                </div>
                <Button onClick={handleCalculate} className="w-full mt-2" disabled={loading}>
                    {loading ? "Calculando..." : "Verificar Requisitos"}
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
                        <Card className={cn(
                            "border shadow-sm bg-card",
                            result.apto ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-500/20 bg-amber-500/5"
                        )}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-full",
                                        result.apto ? "bg-emerald-500/20 text-emerald-600" : "bg-amber-500/20 text-amber-600"
                                    )}>
                                        {result.apto ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <CardTitle className={cn(
                                            "text-xl font-bold",
                                            result.apto ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
                                        )}>
                                            {result.apto ? "Apto para Aposentadoria" : "Ainda não atingiu os requisitos"}
                                        </CardTitle>
                                        <CardDescription className="text-foreground/70 mt-1">
                                            {result.regra}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {!result.apto && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Idade</span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className="text-2xl font-bold text-foreground">{formData.idade} <span className="text-sm font-normal text-muted-foreground">anos</span></span>
                                                <Badge variant="outline" className="border-red-200 text-red-600 bg-red-50">Faltam {result.faltaIdade} anos</Badge>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Contribuição</span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className="text-2xl font-bold text-foreground">{formData.tempoContribuicaoAnos} <span className="text-sm font-normal text-muted-foreground">anos</span></span>
                                                <Badge variant="outline" className="border-red-200 text-red-600 bg-red-50">Faltam {result.faltaTempo} anos</Badge>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {result.apto && (
                                    <div className="p-4 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                                        <p className="font-medium flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Parabéns! Você já pode dar entrada no benefício.
                                        </p>
                                        <p className="text-sm mt-1 opacity-90">
                                            Recomendamos consultar um especialista para verificar o cálculo do valor do benefício.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg p-4 flex gap-3 items-start">
                            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h4 className="font-medium text-blue-900 dark:text-blue-300">Sobre a Regra Geral</h4>
                                <p className="text-sm text-blue-700/80 dark:text-blue-400/80">
                                    Esta calculadora considera as regras de transição e idade mínima vigentes após a Reforma da Previdência (EC 103/2019). Existem outras regras de transição que podem ser mais vantajosas dependendo do seu caso.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 text-muted-foreground border-2 border-dashed border-border/40 rounded-xl bg-muted/5">
                        <div className="p-4 bg-muted/30 rounded-full mb-4">
                            <Calendar className="w-8 h-8 opacity-40" />
                        </div>
                        <h3 className="text-lg font-medium mb-2 text-foreground">Aguardando Dados</h3>
                        <p className="max-w-xs text-sm opacity-60">
                            Informe sua idade e tempo de contribuição para verificar a elegibilidade.
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