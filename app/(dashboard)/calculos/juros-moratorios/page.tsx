"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Percent } from "lucide-react"

export default function JurosMoratoriosPage() {
  const [formData, setFormData] = useState({
    valorPrincipal: "",
    dataInicial: "",
    dataFinal: "",
    taxaJurosAnual: "12"
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/calculos/juros-moratorios", {
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
          <h1 className="text-3xl font-bold tracking-tight">Juros Moratórios</h1>
          <p className="text-muted-foreground">Calcule juros de mora legais e contratuais</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Parâmetros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Valor Principal (R$)</Label>
                <Input 
                  type="number" 
                  value={formData.valorPrincipal}
                  onChange={(e) => setFormData({...formData, valorPrincipal: e.target.value})}
                  placeholder="Ex: 1000.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Data Inicial</Label>
                <Input 
                  type="date" 
                  value={formData.dataInicial}
                  onChange={(e) => setFormData({...formData, dataInicial: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Final</Label>
                <Input 
                  type="date" 
                  value={formData.dataFinal}
                  onChange={(e) => setFormData({...formData, dataFinal: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Taxa de Juros Anual (%)</Label>
                <Input 
                  type="number" 
                  value={formData.taxaJurosAnual}
                  onChange={(e) => setFormData({...formData, taxaJurosAnual: e.target.value})}
                  placeholder="Padrão: 12 (1% a.m.)"
                />
              </div>
              <Button onClick={handleCalculate} className="w-full" disabled={loading}>
                {loading ? "Calculando..." : "Calcular Juros"}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resultado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Valor Total Atualizado</p>
                    <p className="text-3xl font-bold text-emerald-600">R$ {result.total}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Valor Principal:</span>
                      <span className="font-medium">R$ {result.valorPrincipal}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Dias Decorridos:</span>
                      <span className="font-medium">{result.dias} dias</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-muted-foreground">Juros Acumulados:</span>
                      <span className="font-medium text-red-500">R$ {result.juros}</span>
                    </div>
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
