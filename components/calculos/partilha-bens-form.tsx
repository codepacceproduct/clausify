"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Scale } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PartilhaBensForm() {
  const [formData, setFormData] = useState({
    totalBens: "",
    totalDividas: "",
    conjugeMeacao: "sim",
    numHerdeiros: "1"
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCalculate = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/calculos/partilha-bens", {
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
        <h1 className="text-3xl font-bold tracking-tight">Partilha de Bens</h1>
        <p className="text-muted-foreground">Simulação de divisão de patrimônio em divórcio ou inventário</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Patrimônio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Total de Bens (R$)</Label>
              <Input 
                type="number" 
                value={formData.totalBens}
                onChange={(e) => setFormData({...formData, totalBens: e.target.value})}
                placeholder="Ex: 500000.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Total de Dívidas (R$)</Label>
              <Input 
                type="number" 
                value={formData.totalDividas}
                onChange={(e) => setFormData({...formData, totalDividas: e.target.value})}
                placeholder="Ex: 50000.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Cônjuge tem Meação?</Label>
              <Select 
                value={formData.conjugeMeacao} 
                onValueChange={(value) => setFormData({...formData, conjugeMeacao: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim (50%)</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Número de Herdeiros</Label>
              <Input 
                type="number" 
                value={formData.numHerdeiros}
                onChange={(e) => setFormData({...formData, numHerdeiros: e.target.value})}
                placeholder="Ex: 2"
              />
            </div>
            <Button onClick={handleCalculate} className="w-full" disabled={loading}>
              {loading ? "Calculando..." : "Calcular Partilha"}
            </Button>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resultado da Partilha</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Patrimônio Líquido</p>
                  <p className="text-3xl font-bold">R$ {result.patrimonioLiquido}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Meação do Cônjuge:</span>
                    <span className="font-medium">R$ {result.meacaoConjuge}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Total para Herdeiros:</span>
                    <span className="font-medium">R$ {result.totalParaHerdeiros}</span>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg text-center mt-4">
                      <p className="text-sm text-emerald-700 mb-1">Valor Individual por Herdeiro</p>
                      <p className="text-2xl font-bold text-emerald-800">R$ {result.valorPorHerdeiro}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
