"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Percent } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PISCOFINSForm() {
  const [formData, setFormData] = useState({
    faturamento: "",
    regime: "cumulativo"
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCalculate = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/calculos/pis-cofins", {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PIS e COFINS</h1>
        <p className="text-muted-foreground">Cálculo sobre faturamento (Cumulativo e Não-Cumulativo)</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Dados da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Faturamento Mensal (R$)</Label>
              <Input 
                type="number" 
                value={formData.faturamento}
                onChange={(e) => setFormData({...formData, faturamento: e.target.value})}
                placeholder="Ex: 50000.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Regime Tributário</Label>
              <Select 
                value={formData.regime} 
                onValueChange={(value) => setFormData({...formData, regime: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o regime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cumulativo">Cumulativo (Lucro Presumido)</SelectItem>
                  <SelectItem value="nao-cumulativo">Não Cumulativo (Lucro Real)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCalculate} className="w-full" disabled={loading}>
              {loading ? "Calculando..." : "Calcular Impostos"}
            </Button>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resultado</CardTitle>
                <CardDescription>{result.regime}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <p className="text-sm text-blue-700 mb-1">PIS</p>
                      <p className="text-xl font-bold text-blue-800">R$ {result.pis}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg text-center">
                      <p className="text-sm text-emerald-700 mb-1">COFINS</p>
                      <p className="text-xl font-bold text-emerald-800">R$ {result.cofins}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-100 rounded-lg text-center mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Total a Recolher</p>
                  <p className="text-3xl font-bold">R$ {result.total}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
