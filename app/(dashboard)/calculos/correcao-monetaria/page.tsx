"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calculator, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CorrecaoMonetariaPage() {
  const [valor, setValor] = useState("")
  const [dataInicial, setDataInicial] = useState("")
  const [dataFinal, setDataFinal] = useState("")
  const [indice, setIndice] = useState("INPC")
  const [resultado, setResultado] = useState<{
    valorOriginal: number
    valorCorrigido: number
    correcao: number
    percentual: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCalcular = async () => {
    setError("")
    const val = Number.parseFloat(valor.replace(/\./g, "").replace(",", "."))
    
    if (!val) {
      setError("Informe um valor válido")
      return
    }
    if (!dataInicial || !dataFinal) {
      setError("Informe as datas inicial e final")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/calculos/correcao-monetaria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valor: val.toString(),
          dataInicial,
          dataFinal,
          indice
        })
      })

      if (!response.ok) {
        throw new Error("Erro ao realizar cálculo")
      }

      const data = await response.json()
      setResultado(data)
    } catch (err) {
      setError("Ocorreu um erro ao calcular. Tente novamente.")
      console.error(err)
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
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Correção Monetária</h1>
            <p className="text-sm text-muted-foreground">Calcule a correção de valores com diferentes índices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Card */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-500" />
              Dados do Cálculo
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="valor">Valor Original (R$)</Label>
                <Input
                  id="valor"
                  type="text"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="indice">Índice de Correção</Label>
                <Select value={indice} onValueChange={setIndice}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INPC">INPC</SelectItem>
                    <SelectItem value="IGP-M">IGP-M</SelectItem>
                    <SelectItem value="IPCA">IPCA</SelectItem>
                    <SelectItem value="TR">TR</SelectItem>
                    <SelectItem value="SELIC">SELIC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataInicial">Data Inicial</Label>
                  <Input
                    id="dataInicial"
                    type="date"
                    value={dataInicial}
                    onChange={(e) => setDataInicial(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dataFinal">Data Final</Label>
                  <Input id="dataFinal" type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
                </div>
              </div>

              <Button onClick={handleCalcular} className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
                {isLoading ? "Calculando..." : "Calcular"}
              </Button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </Card>

          {/* Result Card */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Resultado</h2>

            {resultado ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Valor Original</p>
                  <p className="text-2xl font-bold">
                    R$ {resultado.valorOriginal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <p className="text-sm text-emerald-600">Valor Corrigido</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    R$ {resultado.valorCorrigido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Correção</p>
                    <p className="text-lg font-semibold">
                      R$ {resultado.correcao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Percentual</p>
                    <p className="text-lg font-semibold">{resultado.percentual.toFixed(2)}%</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Índice: {indice}</p>
                  <p className="text-sm text-muted-foreground">
                    Período: {new Date(dataInicial).toLocaleDateString("pt-BR")} até{" "}
                    {new Date(dataFinal).toLocaleDateString("pt-BR")}
                  </p>
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
