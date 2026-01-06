"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Deposito {
  data: string
  valor: number
}

export default function FGTSPage() {
  const [salario, setSalario] = useState("")
  const [dataAdmissao, setDataAdmissao] = useState("")
  const [dataCalculo, setDataCalculo] = useState("")
  const [depositos, setDepositos] = useState<Deposito[]>([])
  const [resultado, setResultado] = useState<{
    saldoTotal: number
    jurosMora: number
    correcao: number
    total: number
  } | null>(null)

  const handleCalcular = () => {
    // Mock calculation
    const sal = Number.parseFloat(salario.replace(/\./g, "").replace(",", "."))
    if (!sal || !dataAdmissao || !dataCalculo) return

    const saldoTotal = sal * 0.08 * 12 // 8% por mês durante 1 ano
    const jurosMora = saldoTotal * 0.03
    const correcao = saldoTotal * 0.15
    const total = saldoTotal + jurosMora + correcao

    setResultado({
      saldoTotal,
      jurosMora,
      correcao,
      total,
    })
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
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Cálculo de FGTS</h1>
            <p className="text-sm text-muted-foreground">Calcule FGTS, revisões e diferenças de depósitos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-500" />
              Dados do Trabalhador
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="salario">Salário Mensal (R$)</Label>
                <Input
                  id="salario"
                  type="text"
                  placeholder="0,00"
                  value={salario}
                  onChange={(e) => setSalario(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataAdmissao">Data de Admissão</Label>
                  <Input
                    id="dataAdmissao"
                    type="date"
                    value={dataAdmissao}
                    onChange={(e) => setDataAdmissao(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dataCalculo">Data do Cálculo</Label>
                  <Input
                    id="dataCalculo"
                    type="date"
                    value={dataCalculo}
                    onChange={(e) => setDataCalculo(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleCalcular} className="w-full bg-emerald-500 hover:bg-emerald-600">
                Calcular FGTS
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Resultado</h2>

            {resultado ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <p className="text-sm text-emerald-600">Valor Total FGTS</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    R$ {resultado.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Saldo FGTS</span>
                    <span className="font-semibold">
                      R$ {resultado.saldoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Juros de Mora (3%)</span>
                    <span className="font-semibold">
                      R$ {resultado.jurosMora.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Correção Monetária</span>
                    <span className="font-semibold">
                      R$ {resultado.correcao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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
