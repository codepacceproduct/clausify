"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { FileText } from "lucide-react"

export default function INSSPage() {
  const [formData, setFormData] = useState({
    salarioBruto: ""
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/calculos/inss", {
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
          <h1 className="text-3xl font-bold tracking-tight">Contribuição INSS</h1>
          <p className="text-muted-foreground">Cálculo de contribuição previdenciária (Tabela Progressiva 2024)</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Salário de Contribuição
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Salário Bruto (R$)</Label>
                <Input 
                  type="number" 
                  value={formData.salarioBruto}
                  onChange={(e) => setFormData({...formData, salarioBruto: e.target.value})}
                  placeholder="Ex: 3500.00"
                />
              </div>
              <Button onClick={handleCalculate} className="w-full" disabled={loading}>
                {loading ? "Calculando..." : "Calcular INSS"}
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
                    <p className="text-sm text-muted-foreground mb-1">Valor do Desconto INSS</p>
                    <p className="text-3xl font-bold text-emerald-600">R$ {result.contribuicao}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Salário Líquido (Estimado):</span>
                      <span className="font-medium">R$ {(parseFloat(formData.salarioBruto) - parseFloat(result.contribuicao)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-muted-foreground">Alíquota Efetiva:</span>
                      <span className="font-medium">{result.aliquotaEfetiva}%</span>
                    </div>
                    {result.tetoAtingido && (
                       <p className="text-xs text-yellow-600 mt-2">Nota: O salário ultrapassa o teto do INSS, contribuição limitada ao teto.</p>
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
