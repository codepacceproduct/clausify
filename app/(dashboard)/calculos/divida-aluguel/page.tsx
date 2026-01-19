"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function DividaAluguelPage() {
  const [valorAluguel, setValorAluguel] = useState("")
  const [mesesAtraso, setMesesAtraso] = useState("")
  const [multa, setMulta] = useState("10")
  const [juros, setJuros] = useState("1")
  const [resultado, setResultado] = useState<{
    valorBase: number
    valorMulta: number
    valorJuros: number
    total: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCalcular = async () => {
    setError("")
    const val = Number.parseFloat(valorAluguel.replace(/\./g, "").replace(",", "."))
    const meses = Number.parseInt(mesesAtraso)
    const pMulta = Number.parseFloat(multa)
    const pJuros = Number.parseFloat(juros)

    if (!val || !meses) {
      setError("Preencha o valor e os meses em atraso")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/calculos/divida-aluguel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valorAluguel: val.toString(),
          mesesAtraso: meses.toString(),
          multa: pMulta.toString(),
          juros: pJuros.toString()
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
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Dívidas de Aluguel</h1>
            <p className="text-sm text-muted-foreground">Calcule débitos de aluguel com multa, juros e correção</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-500" />
              Dados da Dívida
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="valorAluguel">Valor do Aluguel (R$)</Label>
                <Input
                  id="valorAluguel"
                  type="text"
                  placeholder="0,00"
                  value={valorAluguel}
                  onChange={(e) => setValorAluguel(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="mesesAtraso">Meses em Atraso</Label>
                <Input
                  id="mesesAtraso"
                  type="number"
                  placeholder="0"
                  value={mesesAtraso}
                  onChange={(e) => setMesesAtraso(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="multa">Multa (%)</Label>
                  <Input id="multa" type="number" step="0.1" value={multa} onChange={(e) => setMulta(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="juros">Juros Mensal (%)</Label>
                  <Input id="juros" type="number" step="0.1" value={juros} onChange={(e) => setJuros(e.target.value)} />
                </div>
              </div>

              <Button onClick={handleCalcular} className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
                {isLoading ? "Calculando..." : "Calcular Dívida"}
              </Button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Resultado</h2>

            {resultado ? (
              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="text-sm text-red-600">Valor Total da Dívida</p>
                  <p className="text-2xl font-bold text-red-600">
                    R$ {resultado.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Valor Base Aluguéis</span>
                    <span className="font-semibold">
                      R$ {resultado.valorBase.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Multa ({multa}%)</span>
                    <span className="font-semibold">
                      R$ {resultado.valorMulta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Juros ({juros}% a.m.)</span>
                    <span className="font-semibold">
                      R$ {resultado.valorJuros.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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
