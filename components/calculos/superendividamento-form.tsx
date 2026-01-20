"use client"

import { cn } from "@/lib/utils"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, Download, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Divida {
  id: number
  nome: string
  valor: number
  parcela: number
}

export function SuperendividamentoForm() {
  const [rendaMensal, setRendaMensal] = useState("")
  const [despesasEssenciais, setDespesasEssenciais] = useState("")
  const [dividas, setDividas] = useState<Divida[]>([])
  const [resultado, setResultado] = useState<{
    totalDividas: number
    capacidadePagamento: number
    percentualComprometimento: number
    situacao: string
  } | null>(null)

  const adicionarDivida = () => {
    setDividas([...dividas, { id: Date.now(), nome: "", valor: 0, parcela: 0 }])
  }

  const removerDivida = (id: number) => {
    setDividas(dividas.filter((d) => d.id !== id))
  }

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCalcular = async () => {
    const renda = Number.parseFloat(rendaMensal.replace(/\./g, "").replace(",", "."))
    const despesas = Number.parseFloat(despesasEssenciais.replace(/\./g, "").replace(",", "."))

    if (!renda || !despesas) {
        setError("Preencha todos os campos financeiros")
        return
    }

    setIsLoading(true)
    setError("")
    setResultado(null)

    try {
        const response = await fetch("/api/calculos/superendividamento", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                rendaMensal: renda,
                despesasEssenciais: despesas,
                dividas
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
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Análise de Superendividamento</h1>
          <p className="text-sm text-muted-foreground">Avalie sua capacidade de pagamento e situação financeira</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-500" />
              Dados Financeiros
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
                <Label htmlFor="despesasEssenciais">Despesas Essenciais (R$)</Label>
                <Input
                  id="despesasEssenciais"
                  type="text"
                  placeholder="0,00"
                  value={despesasEssenciais}
                  onChange={(e) => setDespesasEssenciais(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Alimentação, moradia, transporte, saúde</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Dívidas</h2>
              <Button size="sm" variant="outline" onClick={adicionarDivida}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-3">
              {dividas.map((divida, index) => (
                <div key={divida.id} className="p-3 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Dívida {index + 1}</span>
                    <Button size="sm" variant="ghost" onClick={() => removerDivida(divida.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Nome da dívida"
                    value={divida.nome}
                    onChange={(e) => {
                      const newDividas = [...dividas]
                      newDividas[index].nome = e.target.value
                      setDividas(newDividas)
                    }}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Valor total"
                      onChange={(e) => {
                        const newDividas = [...dividas]
                        newDividas[index].valor = Number.parseFloat(e.target.value) || 0
                        setDividas(newDividas)
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Parcela mensal"
                      onChange={(e) => {
                        const newDividas = [...dividas]
                        newDividas[index].parcela = Number.parseFloat(e.target.value) || 0
                        setDividas(newDividas)
                      }}
                    />
                  </div>
                </div>
              ))}
              {dividas.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma dívida adicionada</p>
              )}
            </div>

            <Button onClick={handleCalcular} className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600">
              Analisar Situação
            </Button>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Análise</h2>

          {resultado ? (
            <div className="space-y-4">
              <div
                className={cn(
                  "p-4 rounded-lg border",
                  resultado.situacao === "Saudável" && "bg-emerald-500/10 border-emerald-500/20 text-emerald-600",
                  resultado.situacao === "Atenção" && "bg-yellow-500/10 border-yellow-500/20 text-yellow-600",
                  resultado.situacao === "Superendividado" && "bg-red-500/10 border-red-500/20 text-red-600",
                )}
              >
                <p className="text-sm">Situação Financeira</p>
                <p className="text-2xl font-bold">{resultado.situacao}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span className="text-sm text-muted-foreground">Total de Dívidas (Mensal)</span>
                  <span className="font-semibold">
                    R$ {resultado.totalDividas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span className="text-sm text-muted-foreground">Capacidade de Pagamento</span>
                  <span className="font-semibold">
                    R$ {resultado.capacidadePagamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span className="text-sm text-muted-foreground">Comprometimento da Renda</span>
                  <span className="font-semibold">{resultado.percentualComprometimento.toFixed(1)}%</span>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-600 font-medium mb-2">Recomendações</p>
                <ul className="text-xs text-blue-600/80 space-y-1">
                  {resultado.situacao === "Saudável" && (
                    <>
                      <li>• Sua situação financeira está equilibrada</li>
                      <li>• Continue monitorando suas despesas</li>
                      <li>• Considere criar uma reserva de emergência</li>
                    </>
                  )}
                  {resultado.situacao === "Atenção" && (
                    <>
                      <li>• Suas dívidas estão comprometendo sua renda</li>
                      <li>• Evite contrair novas dívidas</li>
                      <li>• Considere renegociar com os credores</li>
                    </>
                  )}
                  {resultado.situacao === "Superendividado" && (
                    <>
                      <li>• Situação crítica - busque ajuda especializada</li>
                      <li>• Procure a Defensoria Pública para orientação</li>
                      <li>• Solicite renegociação de todas as dívidas</li>
                    </>
                  )}
                </ul>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Exportar Análise
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-muted-foreground">
              Preencha os dados e clique em analisar
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
