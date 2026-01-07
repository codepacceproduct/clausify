"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { TrendingUp, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function RevisaoFinanciamentoPage() {
  const [formData, setFormData] = useState({
    valorFinanciado: "",
    taxaJurosMensal: "",
    prazoMeses: "",
    sistemaAmortizacao: "PRICE"
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/calculos/revisao-financiamento", {
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revisão de Financiamento</h1>
          <p className="text-muted-foreground">Identifique juros abusivos em financiamentos de veículos e imóveis</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Dados do Financiamento
              </CardTitle>
              <CardDescription>Preencha os dados conforme o contrato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Valor Financiado (R$)</Label>
                <Input 
                  type="number" 
                  value={formData.valorFinanciado}
                  onChange={(e) => setFormData({...formData, valorFinanciado: e.target.value})}
                  placeholder="Ex: 30000.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Taxa de Juros Mensal (%)</Label>
                <Input 
                  type="number" 
                  step="0.01"
                  value={formData.taxaJurosMensal}
                  onChange={(e) => setFormData({...formData, taxaJurosMensal: e.target.value})}
                  placeholder="Ex: 2.5"
                />
              </div>
              <div className="space-y-2">
                <Label>Prazo (Meses)</Label>
                <Input 
                  type="number" 
                  value={formData.prazoMeses}
                  onChange={(e) => setFormData({...formData, prazoMeses: e.target.value})}
                  placeholder="Ex: 48"
                />
              </div>
              <Button onClick={handleCalculate} className="w-full" disabled={loading}>
                {loading ? "Calculando..." : "Calcular Revisão"}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resultado da Análise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <Alert variant={result.indicioAbusividade ? "destructive" : "default"}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{result.indicioAbusividade ? "Juros Acima da Média" : "Juros na Média"}</AlertTitle>
                    <AlertDescription>
                      {result.indicioAbusividade 
                        ? "A taxa cobrada está superior à média de mercado para este tipo de operação." 
                        : "A taxa está compatível com o mercado."}
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Prestação Mensal</p>
                      <p className="font-bold text-lg">R$ {result.prestacaoMensal}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Total a Pagar</p>
                      <p className="font-medium">R$ {result.totalPago}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Total de Juros</p>
                      <p className="font-medium text-red-500">R$ {result.totalJuros}</p>
                    </div>
                     {result.indicioAbusividade && (
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Economia Estimada (Revisão)</p>
                        <p className="font-bold text-lg text-emerald-600">R$ {result.economiaEstimada}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  )
}
