"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Building2 } from "lucide-react"

export default function ITBIPage() {
  const [formData, setFormData] = useState({
    valorImovel: "",
    aliquota: "2"
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/calculos/itbi", {
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
          <h1 className="text-3xl font-bold tracking-tight">ITBI</h1>
          <p className="text-muted-foreground">Imposto de Transmissão de Bens Imóveis</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Dados da Transação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Valor do Imóvel (R$)</Label>
                <Input 
                  type="number" 
                  value={formData.valorImovel}
                  onChange={(e) => setFormData({...formData, valorImovel: e.target.value})}
                  placeholder="Ex: 350000.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Alíquota Municipal (%)</Label>
                <Input 
                  type="number" 
                  step="0.1"
                  value={formData.aliquota}
                  onChange={(e) => setFormData({...formData, aliquota: e.target.value})}
                  placeholder="Geralmente entre 2% e 3%"
                />
              </div>
              <Button onClick={handleCalculate} className="w-full" disabled={loading}>
                {loading ? "Calculando..." : "Calcular ITBI"}
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
                    <p className="text-sm text-muted-foreground mb-1">Valor do Imposto (ITBI)</p>
                    <p className="text-3xl font-bold text-emerald-600">R$ {result.valorImposto}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Valor do Imóvel:</span>
                      <span className="font-medium">R$ {result.valorBase}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-muted-foreground">Alíquota Aplicada:</span>
                      <span className="font-medium">{result.aliquota}%</span>
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
