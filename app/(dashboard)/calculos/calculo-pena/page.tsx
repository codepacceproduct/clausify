"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Gavel } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CalculoPenaPage() {
  const [formData, setFormData] = useState({
    penaTotalAnos: "",
    crimeHediondo: "nao",
    reincidente: "nao"
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/calculos/calculo-pena", {
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
          <h1 className="text-3xl font-bold tracking-tight">Cálculo de Pena</h1>
          <p className="text-muted-foreground">Progressão de regime (Pacote Anticrime)</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Dados da Condenação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pena Total (Anos)</Label>
                <Input 
                  type="number" 
                  value={formData.penaTotalAnos}
                  onChange={(e) => setFormData({...formData, penaTotalAnos: e.target.value})}
                  placeholder="Ex: 8"
                />
              </div>
              <div className="space-y-2">
                <Label>Crime Hediondo ou Equiparado?</Label>
                <Select 
                  value={formData.crimeHediondo} 
                  onValueChange={(value) => setFormData({...formData, crimeHediondo: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Reincidente?</Label>
                <Select 
                  value={formData.reincidente} 
                  onValueChange={(value) => setFormData({...formData, reincidente: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCalculate} className="w-full" disabled={loading}>
                {loading ? "Calculando..." : "Calcular Progressão"}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resultado da Progressão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Tempo para Progressão</p>
                    <p className="text-3xl font-bold text-blue-600">{result.tempoParaProgressao} anos</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Pena Total:</span>
                      <span className="font-medium">{result.penaTotal} anos</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-muted-foreground">Fração Aplicada:</span>
                      <span className="font-medium">{result.percentualAplicado}%</span>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2 text-center">
                        {result.mensagem}
                    </p>
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
