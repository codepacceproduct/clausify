"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Clock, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function HorasExtrasForm() {
  const [salario, setSalario] = useState("")
  const [jornadaMensal, setJornadaMensal] = useState("220")
  const [qtdHoras50, setQtdHoras50] = useState("0")
  const [qtdHoras100, setQtdHoras100] = useState("0")
  
  const [resultado, setResultado] = useState<{
    valorHoraNormal: number
    valorHora50: number
    valorHora100: number
    total50: number
    total100: number
    totalGeral: number
    dsr: number
  } | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCalcular = async () => {
    const sal = Number.parseFloat(salario.replace(/\./g, "").replace(",", "."))
    const jornada = Number.parseFloat(jornadaMensal)
    
    if (!sal || !jornada) {
        setError("Preencha o salário e jornada")
        return
    }

    setIsLoading(true)
    setError("")
    setResultado(null)

    try {
        const response = await fetch("/api/calculos/horas-extras", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                salario: sal,
                jornadaMensal: jornada,
                qtdHoras50: Number(qtdHoras50),
                qtdHoras100: Number(qtdHoras100)
            })
        })

        if (!response.ok) throw new Error("Erro no cálculo")
        
        const data = await response.json()
        setResultado(data)
    } catch (err) {
        setError("Erro ao calcular.")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/calculos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Horas Extras</h1>
            <p className="text-sm text-muted-foreground">Calcule horas extras (50%, 100%) e DSR</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              Dados da Jornada
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="salario">Salário Base (R$)</Label>
                <Input
                  id="salario"
                  placeholder="0,00"
                  value={salario}
                  onChange={(e) => setSalario(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="jornada">Jornada Mensal (Horas)</Label>
                <Input
                  id="jornada"
                  type="number"
                  value={jornadaMensal}
                  onChange={(e) => setJornadaMensal(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Padrão CLT: 220h</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="horas50">Horas 50%</Label>
                    <Input
                      id="horas50"
                      type="number"
                      value={qtdHoras50}
                      onChange={(e) => setQtdHoras50(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="horas100">Horas 100%</Label>
                    <Input
                      id="horas100"
                      type="number"
                      value={qtdHoras100}
                      onChange={(e) => setQtdHoras100(e.target.value)}
                    />
                </div>
              </div>

              <Button onClick={handleCalcular} className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
                {isLoading ? "Calculando..." : "Calcular Horas Extras"}
              </Button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Resultado</h2>

            {resultado ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <p className="text-sm text-emerald-600">Total a Receber</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    R$ {resultado.totalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Valor Hora Normal</span>
                    <span className="font-semibold">
                      R$ {resultado.valorHoraNormal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {resultado.total50 > 0 && (
                      <div className="flex justify-between p-3 bg-muted rounded">
                        <span className="text-sm text-muted-foreground">Total HE 50%</span>
                        <span className="font-semibold">
                          R$ {resultado.total50.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                  )}
                  {resultado.total100 > 0 && (
                      <div className="flex justify-between p-3 bg-muted rounded">
                        <span className="text-sm text-muted-foreground">Total HE 100%</span>
                        <span className="font-semibold">
                          R$ {resultado.total100.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                  )}
                  <div className="flex justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">DSR sobre HE (Est. 1/6)</span>
                    <span className="font-semibold">
                      R$ {resultado.dsr.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Relatório
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Preencha os dados e clique em calcular
              </div>
            )}
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
}
