"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ShieldCheck } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function IndenizacaoPage() {
  const [formData, setFormData] = useState({
    tipoDano: "moral",
    gravidade: "media",
    valorMaterial: ""
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/calculos/indenizacao", {
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
          <h1 className="text-3xl font-bold tracking-tight">Indenização</h1>
          <p className="text-muted-foreground">Estimativa de danos morais e materiais</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Parâmetros do Dano
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label>Gravidade do Dano Moral</Label>
                <Select 
                  value={formData.gravidade} 
                  onValueChange={(value) => setFormData({...formData, gravidade: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leve">Leve</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="grave">Grave</SelectItem>
                    <SelectItem value="gravissima">Gravíssima</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Danos Materiais (R$) (Opcional)</Label>
                <Input 
                  type="number" 
                  value={formData.valorMaterial}
                  onChange={(e) => setFormData({...formData, valorMaterial: e.target.value})}
                  placeholder="Ex: 2000.00"
                />
              </div>
              <Button onClick={handleCalculate} className="w-full" disabled={loading}>
                {loading ? "Calculando..." : "Estimar Indenização"}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estimativa Sugerida</CardTitle>
                  <CardDescription>Baseada em faixas jurisprudenciais comuns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Faixa de Dano Moral Estimada</p>
                    <p className="text-2xl font-bold text-emerald-600">
                        R$ {result.sugestaoMoralMin} - R$ {result.sugestaoMoralMax}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Danos Materiais:</span>
                      <span className="font-medium">R$ {result.danosMateriais}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-muted-foreground">Total Estimado (Min - Max):</span>
                      <span className="font-medium">R$ {result.totalEstimadoMin} - R$ {result.totalEstimadoMax}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    *Nota: Os valores são apenas referências baseadas em médias de mercado e não garantem resultado judicial.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  )
}
