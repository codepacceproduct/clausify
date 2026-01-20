"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { BadgeDollarSign, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function RMCRCCForm() {
  const [formData, setFormData] = useState({
    valorEmprestimo: "",
    dataContrato: "",
    taxaJurosMensal: "",
    valorParcela: ""
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCalculate = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/calculos/rmc-rcc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setError("Ocorreu um erro ao calcular. Verifique os dados e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">RMC e RCC INSS</h1>
          <p className="text-muted-foreground">Revisão de empréstimos com taxa BACEN e juros abusivos</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeDollarSign className="h-5 w-5" />
                Dados do Contrato
              </CardTitle>
              <CardDescription>Insira os dados do empréstimo para análise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Valor do Empréstimo (R$)</Label>
                <Input 
                  type="number" 
                  value={formData.valorEmprestimo}
                  onChange={(e) => setFormData({...formData, valorEmprestimo: e.target.value})}
                  placeholder="Ex: 5000.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Data do Contrato</Label>
                <Input 
                  type="date"
                  value={formData.dataContrato}
                  onChange={(e) => setFormData({...formData, dataContrato: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Taxa de Juros Mensal (%)</Label>
                <Input 
                  type="number" 
                  step="0.01"
                  value={formData.taxaJurosMensal}
                  onChange={(e) => setFormData({...formData, taxaJurosMensal: e.target.value})}
                  placeholder="Ex: 3.5"
                />
              </div>
              <div className="space-y-2">
                <Label>Valor da Parcela (R$)</Label>
                <Input 
                  type="number" 
                  value={formData.valorParcela}
                  onChange={(e) => setFormData({...formData, valorParcela: e.target.value})}
                  placeholder="Ex: 150.00"
                />
              </div>
              <Button onClick={handleCalculate} className="w-full" disabled={loading}>
                {loading ? "Calculando..." : "Calcular Revisão"}
              </Button>
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resultado da Análise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert variant={result.abusividade ? "destructive" : "default"}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{result.abusividade ? "Indício de Abusividade" : "Dentro da Média"}</AlertTitle>
                    <AlertDescription>{result.mensagem}</AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Taxa Cobrada</p>
                      <p className="font-medium">{result.taxaCobrada}% a.m.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Taxa Média de Mercado</p>
                      <p className="font-medium">{result.taxaMediaMercado}% a.m.</p>
                    </div>
                    {result.abusividade && (
                      <>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Diferença de Taxa</p>
                          <p className="font-medium text-red-600">+{result.diferencaTaxa}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Estimativa de Restituição</p>
                          <p className="font-bold text-lg text-emerald-600">R$ {result.valorDevido}</p>
                        </div>
                      </>
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
