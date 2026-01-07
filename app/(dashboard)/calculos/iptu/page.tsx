"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ScrollText } from "lucide-react"

export default function IPTUPage() {
  const [formData, setFormData] = useState({
    valorOriginal: "",
    dataVencimento: "",
    multaPercentual: "2",
    jurosMensais: "1"
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/calculos/iptu", {
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
          <h1 className="text-3xl font-bold tracking-tight">IPTU Atrasado</h1>
          <p className="text-muted-foreground">Atualização de débitos de IPTU com multa e juros</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScrollText className="h-5 w-5" />
                Dados do Débito
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Valor Original (R$)</Label>
                <Input 
                  type="number" 
                  value={formData.valorOriginal}
                  onChange={(e) => setFormData({...formData, valorOriginal: e.target.value})}
                  placeholder="Ex: 500.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Data de Vencimento</Label>
                <Input 
                  type="date" 
                  value={formData.dataVencimento}
                  onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Multa (%)</Label>
                    <Input 
                    type="number" 
                    value={formData.multaPercentual}
                    onChange={(e) => setFormData({...formData, multaPercentual: e.target.value})}
                    placeholder="Padrão: 2"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Juros (% a.m.)</Label>
                    <Input 
                    type="number" 
                    value={formData.jurosMensais}
                    onChange={(e) => setFormData({...formData, jurosMensais: e.target.value})}
                    placeholder="Padrão: 1"
                    />
                </div>
              </div>
              <Button onClick={handleCalculate} className="w-full" disabled={loading}>
                {loading ? "Calculando..." : "Atualizar Débito"}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Valor Atualizado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total a Pagar</p>
                    <p className="text-3xl font-bold text-red-600">R$ {result.total}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Valor Original:</span>
                      <span className="font-medium">R$ {result.valorOriginal}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Meses em Atraso:</span>
                      <span className="font-medium">{result.mesesAtraso} meses</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Multa:</span>
                      <span className="font-medium">R$ {result.multa}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-muted-foreground">Juros de Mora:</span>
                      <span className="font-medium">R$ {result.juros}</span>
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
