"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Building2, Plus, Trash2 } from "lucide-react"

export default function CapitalSocialPage() {
  const [capitalTotal, setCapitalTotal] = useState("")
  const [socios, setSocios] = useState([{ nome: "", quotas: "" }])
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const addSocio = () => {
    setSocios([...socios, { nome: "", quotas: "" }])
  }

  const removeSocio = (index: number) => {
    const newSocios = [...socios]
    newSocios.splice(index, 1)
    setSocios(newSocios)
  }

  const updateSocio = (index: number, field: string, value: string) => {
    const newSocios: any = [...socios]
    newSocios[index][field] = value
    setSocios(newSocios)
  }

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/calculos/capital-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capitalTotal, socios })
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
          <h1 className="text-3xl font-bold tracking-tight">Capital Social</h1>
          <p className="text-muted-foreground">Distribuição de quotas e participação societária</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Estrutura Societária
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Capital Social Total (R$)</Label>
                <Input 
                  type="number" 
                  value={capitalTotal}
                  onChange={(e) => setCapitalTotal(e.target.value)}
                  placeholder="Ex: 100000.00"
                />
              </div>
              
              <div className="space-y-3">
                <Label>Sócios</Label>
                {socios.map((socio, index) => (
                    <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1">
                            <Label className="text-xs">Nome</Label>
                            <Input 
                                value={socio.nome}
                                onChange={(e) => updateSocio(index, "nome", e.target.value)}
                                placeholder={`Sócio ${index + 1}`}
                            />
                        </div>
                        <div className="w-1/3 space-y-1">
                            <Label className="text-xs">Quotas (R$)</Label>
                            <Input 
                                type="number"
                                value={socio.quotas}
                                onChange={(e) => updateSocio(index, "quotas", e.target.value)}
                            />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeSocio(index)} disabled={socios.length === 1}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={addSocio} className="w-full mt-2">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Sócio
                </Button>
              </div>

              <Button onClick={handleCalculate} className="w-full" disabled={loading}>
                {loading ? "Calculando..." : "Calcular Participação"}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quadro Societário</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {result.distribuicao.map((socio: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <div>
                                <p className="font-medium">{socio.nome || `Sócio ${idx+1}`}</p>
                                <p className="text-xs text-muted-foreground">R$ {socio.valor}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-emerald-600">{socio.percentual}</p>
                            </div>
                        </div>
                    ))}
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
