"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { HeartPulse } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AposentadoriaForm() {
  const [formData, setFormData] = useState({
    sexo: "M",
    idade: "",
    tempoContribuicaoAnos: ""
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/calculos/aposentadoria", {
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
          <h1 className="text-3xl font-bold tracking-tight">Tempo de Aposentadoria</h1>
          <p className="text-muted-foreground">Análise de requisitos para aposentadoria (Regra Geral)</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="h-5 w-5" />
                Dados do Segurado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sexo</Label>
                <Select 
                  value={formData.sexo} 
                  onValueChange={(value) => setFormData({...formData, sexo: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Idade Atual (Anos)</Label>
                <Input 
                  type="number" 
                  value={formData.idade}
                  onChange={(e) => setFormData({...formData, idade: e.target.value})}
                  placeholder="Ex: 60"
                />
              </div>
              <div className="space-y-2">
                <Label>Tempo de Contribuição (Anos)</Label>
                <Input 
                  type="number" 
                  value={formData.tempoContribuicaoAnos}
                  onChange={(e) => setFormData({...formData, tempoContribuicaoAnos: e.target.value})}
                  placeholder="Ex: 25"
                />
              </div>
              <Button onClick={handleCalculate} className="w-full" disabled={loading}>
                {loading ? "Calculando..." : "Verificar Requisitos"}
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
                   <div className={`p-4 rounded-lg text-center ${result.apto ? 'bg-emerald-100' : 'bg-yellow-100'}`}>
                    <p className={`text-xl font-bold ${result.apto ? 'text-emerald-800' : 'text-yellow-800'}`}>
                        {result.apto ? "Apto para Aposentadoria (Regra Geral)" : "Ainda não atingiu os requisitos"}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground text-center mb-4">{result.regra}</p>
                    
                    {!result.apto && (
                        <>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Falta Idade:</span>
                            <span className="font-medium text-red-500">{result.faltaIdade} anos</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="text-muted-foreground">Falta Tempo de Contribuição:</span>
                            <span className="font-medium text-red-500">{result.faltaTempo} anos</span>
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
