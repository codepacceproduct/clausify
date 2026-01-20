"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Calculator } from "lucide-react"

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Amortização SAC e PRICE</h1>
          <p className="text-muted-foreground">Compare sistemas de amortização e calcule parcelas</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Parâmetros do Cálculo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Valor do Empréstimo (R$)</Label>
                <Input 
                  type="number" 
                  value={formData.valorEmprestimo}
                  onChange={(e) => setFormData({...formData, valorEmprestimo: e.target.value})}
                  placeholder="Ex: 100000.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Taxa de Juros Mensal (%)</Label>
                <Input 
                  type="number" 
                  step="0.01"
                  value={formData.taxaJurosMensal}
                  onChange={(e) => setFormData({...formData, taxaJurosMensal: e.target.value})}
                  placeholder="Ex: 0.99"
                />
              </div>
              <div className="space-y-2">
                <Label>Prazo (Meses)</Label>
                <Input 
                  type="number" 
                  value={formData.prazoMeses}
                  onChange={(e) => setFormData({...formData, prazoMeses: e.target.value})}
                  placeholder="Ex: 120"
                />
              </div>
              <Button onClick={handleCalculate} className="w-full" disabled={loading}>
                {loading ? "Calculando..." : "Comparar Sistemas"}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-6">
              <Card className="bg-emerald-50 border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-800">Melhor Opção</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium text-emerald-900">{result.melhorOpcao}</p>
                  <p className="text-sm text-emerald-700 mt-2">Diferença Total de Juros: R$ {result.diferencaJuros}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Sistema PRICE</CardTitle>
                    <CardDescription>Parcelas Fixas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Parcela:</span>
                      <span className="font-medium">R$ {result.price.parcela}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Pago:</span>
                      <span className="font-medium">R$ {result.price.totalPago}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Juros:</span>
                      <span className="font-medium text-red-500">R$ {result.price.totalJuros}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Sistema SAC</CardTitle>
                    <CardDescription>Parcelas Decrescentes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">1ª Parcela:</span>
                      <span className="font-medium">R$ {result.sac.primeiraParcela}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Última Parcela:</span>
                      <span className="font-medium">R$ {result.sac.ultimaParcela}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Pago:</span>
                      <span className="font-medium">R$ {result.sac.totalPago}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Juros:</span>
                      <span className="font-medium text-green-600">R$ {result.sac.totalJuros}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  )
}
