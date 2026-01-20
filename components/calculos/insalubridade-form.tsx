"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function InsalubridadeForm() {
  const [salarioMinimo, setSalarioMinimo] = useState("1412,00")
  const [salarioBase, setSalarioBase] = useState("")
  const [grauInsalubridade, setGrauInsalubridade] = useState("20") // 10, 20, 40
  const [temPericulosidade, setTemPericulosidade] = useState("nao")
  const [resultado, setResultado] = useState<{
    adicionalInsalubridade: number
    adicionalPericulosidade: number
    totalAdicionais: number
    salarioFinal: number
  } | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCalcular = async () => {
    const min = Number.parseFloat(salarioMinimo.replace(/\./g, "").replace(",", "."))
    const base = Number.parseFloat(salarioBase.replace(/\./g, "").replace(",", "."))
    
    if (!min || !base) {
        setError("Preencha os valores de salário")
        return
    }

    setIsLoading(true)
    setError("")
    setResultado(null)

    try {
        const response = await fetch("/api/calculos/insalubridade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                salarioMinimo: min,
                salarioBase: base,
                grauInsalubridade: Number(grauInsalubridade),
                temPericulosidade: temPericulosidade === "sim"
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/calculos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Insalubridade e Periculosidade</h1>
          <p className="text-sm text-muted-foreground">Calcule adicionais sobre o salário mínimo ou base</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-emerald-500" />
            Parâmetros
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="salarioMinimo">Salário Mínimo Vigente (R$)</Label>
              <Input
                id="salarioMinimo"
                value={salarioMinimo}
                onChange={(e) => setSalarioMinimo(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="salarioBase">Salário Base do Trabalhador (R$)</Label>
              <Input
                id="salarioBase"
                placeholder="0,00"
                value={salarioBase}
                onChange={(e) => setSalarioBase(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="grau">Grau de Insalubridade</Label>
              <Select value={grauInsalubridade} onValueChange={setGrauInsalubridade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Grau Mínimo (10%)</SelectItem>
                  <SelectItem value="20">Grau Médio (20%)</SelectItem>
                  <SelectItem value="40">Grau Máximo (40%)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Calculado sobre o salário mínimo</p>
            </div>

            <div>
              <Label htmlFor="periculosidade">Adicional de Periculosidade?</Label>
              <Select value={temPericulosidade} onValueChange={setTemPericulosidade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nao">Não</SelectItem>
                  <SelectItem value="sim">Sim (30%)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Calculado sobre o salário base</p>
            </div>

            <Button onClick={handleCalcular} className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
              {isLoading ? "Calculando..." : "Calcular Adicionais"}
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Resultado</h2>

          {resultado ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-sm text-emerald-600">Total de Adicionais</p>
                <p className="text-2xl font-bold text-emerald-600">
                  R$ {resultado.totalAdicionais.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span className="text-sm text-muted-foreground">Insalubridade ({grauInsalubridade}%)</span>
                  <span className="font-semibold">
                    R$ {resultado.adicionalInsalubridade.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {resultado.adicionalPericulosidade > 0 && (
                  <div className="flex justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Periculosidade (30%)</span>
                    <span className="font-semibold">
                      R$ {resultado.adicionalPericulosidade.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between p-3 bg-muted rounded border-t border-border mt-2 pt-2">
                  <span className="text-sm font-medium">Salário Final Estimado</span>
                  <span className="font-bold">
                    R$ {resultado.salarioFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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
  )
}
