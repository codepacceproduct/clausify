"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function PensaoAlimenticiaForm() {
  const [rendaMensal, setRendaMensal] = useState("")
  const [percentual, setPercentual] = useState("30")
  const [numeroDependentes, setNumeroDependentes] = useState("1")
  const [resultado, setResultado] = useState<{
    valorPensao: number
    valorPorDependente: number
    rendaLiquida: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCalcular = async () => {
    setError("")
    const renda = Number.parseFloat(rendaMensal.replace(/\./g, "").replace(",", "."))
    const perc = Number.parseFloat(percentual)
    const deps = Number.parseInt(numeroDependentes)

    if (!renda) {
      setError("Informe a renda mensal")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/calculos/pensao-alimenticia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rendaMensal: renda.toString(),
          percentual: perc.toString(),
          numeroDependentes: deps.toString()
        })
      })

      if (!response.ok) {
        throw new Error("Erro ao realizar cálculo")
      }

      const data = await response.json()
      setResultado(data)
    } catch (err) {
      setError("Ocorreu um erro ao calcular. Tente novamente.")
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
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Pensão Alimentícia</h1>
          <p className="text-sm text-muted-foreground">Calcule valores de pensão alimentícia e percentuais</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-500" />
            Dados do Cálculo
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="rendaMensal">Renda Mensal (R$)</Label>
              <Input
                id="rendaMensal"
                type="text"
                placeholder="0,00"
                value={rendaMensal}
                onChange={(e) => setRendaMensal(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="percentual">Percentual da Pensão (%)</Label>
              <Input
                id="percentual"
                type="number"
                step="0.1"
                value={percentual}
                onChange={(e) => setPercentual(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Geralmente entre 20% e 30% da renda</p>
            </div>

            <div>
              <Label htmlFor="numeroDependentes">Número de Dependentes</Label>
              <Input
                id="numeroDependentes"
                type="number"
                value={numeroDependentes}
                onChange={(e) => setNumeroDependentes(e.target.value)}
              />
            </div>

            <Button onClick={handleCalcular} className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
              {isLoading ? "Calculando..." : "Calcular Pensão"}
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Resultado</h2>

          {resultado ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-sm text-emerald-600">Valor Total da Pensão</p>
                <p className="text-2xl font-bold text-emerald-600">
                  R$ {resultado.valorPensao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-emerald-600/70 mt-1">{percentual}% da renda mensal</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span className="text-sm text-muted-foreground">Valor por Dependente</span>
                  <span className="font-semibold">
                    R$ {resultado.valorPorDependente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span className="text-sm text-muted-foreground">Renda Líquida</span>
                  <span className="font-semibold">
                    R$ {resultado.rendaLiquida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-600 font-medium mb-2">Informações Importantes</p>
                <ul className="text-xs text-blue-600/80 space-y-1">
                  <li>• A pensão deve ser paga até o 5º dia útil de cada mês</li>
                  <li>• Atrasos podem gerar multa de 10% + juros de 1% ao mês</li>
                  <li>• O não pagamento pode configurar prisão civil</li>
                </ul>
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
