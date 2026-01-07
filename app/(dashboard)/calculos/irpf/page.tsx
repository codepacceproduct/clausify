"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Receipt } from "lucide-react"

export default function IRPFPage() {
  const [formData, setFormData] = useState({
    rendimentos: "",
    dependentes: "0",
    previdencia: "",
    outrasDeducoes: ""
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/calculos/irpf", {
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
          <h1 className="text-3xl font-bold tracking-tight">IRPF Mensal</h1>
          <p className="text-muted-foreground">Simulação do Imposto de Renda Retido na Fonte</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Dados Financeiros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Rendimentos Tributáveis (R$)</Label>
                <Input 
                  type="number" 
                  value={formData.rendimentos}
                  onChange={(e) => setFormData({...formData, rendimentos: e.target.value})}
                  placeholder="Salário Bruto"
                />
              </div>
              <div className="space-y-2">
                <Label>Número de Dependentes</Label>
                <Input 
                  type="number" 
                  value={formData.dependentes}
                  onChange={(e) => setFormData({...formData, dependentes: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Previdência Oficial (INSS) (R$)</Label>
                <Input 
                  type="number" 
                  value={formData.previdencia}
                  onChange={(e) => setFormData({...formData, previdencia: e.target.value})}
                  placeholder="Valor descontado de INSS"
                />
              </div>
              <div className="space-y-2">
                <Label>Outras Deduções (Pensão, etc) (R$)</Label>
                <Input 
                  type="number" 
                  value={formData.outrasDeducoes}
                  onChange={(e) => setFormData({...formData, outrasDeducoes: e.target.value})}
                />
              </div>
              <Button onClick={handleCalculate} className="w-full" disabled={loading}>
                {loading ? "Calculando..." : "Calcular Imposto"}
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
                    <p className="text-sm text-muted-foreground mb-1">Imposto a Pagar (Mensal)</p>
                    <p className="text-3xl font-bold text-emerald-600">R$ {result.impostoMensal}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Base de Cálculo:</span>
                      <span className="font-medium">R$ {result.baseCalculo}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Alíquota Nominal:</span>
                      <span className="font-medium">{result.aliquotaNominal}%</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Parcela a Deduzir:</span>
                      <span className="font-medium">R$ {result.parcelaDeduzir}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-muted-foreground">Alíquota Efetiva:</span>
                      <span className="font-medium">{result.aliquotaEfetiva}%</span>
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
