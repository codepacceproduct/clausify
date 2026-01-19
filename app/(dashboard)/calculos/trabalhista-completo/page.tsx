"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Calculator, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function TrabalhistaCompletoPage() {
  const [salario, setSalario] = useState("")
  const [dataAdmissao, setDataAdmissao] = useState("")
  const [dataDemissao, setDataDemissao] = useState("")
  const [incluirFerias, setIncluirFerias] = useState(true)
  const [incluir13, setIncluir13] = useState(true)
  const [incluirAviso, setIncluirAviso] = useState(true)
  const [resultado, setResultado] = useState<{
    saldoSalario: number
    ferias: number
    decimoTerceiro: number
    avisoPrevi: number
    fgts: number
    multaFgts: number
    total: number
  } | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCalcular = async () => {
    const sal = Number.parseFloat(salario.replace(/\./g, "").replace(",", "."))
    if (!sal || !dataAdmissao || !dataDemissao) {
        setError("Preencha todos os campos obrigatórios")
        return
    }

    setIsLoading(true)
    setError("")
    setResultado(null)

    try {
        const response = await fetch("/api/calculos/trabalhista-completo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                salario: sal,
                dataAdmissao,
                dataDemissao,
                incluirFerias,
                incluir13,
                incluirAviso
            })
        })

        if (!response.ok) throw new Error("Erro no cálculo")
        
        const data = await response.json()
        setResultado(data)
    } catch (err) {
        setError("Erro ao calcular. Verifique os dados.")
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
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Cálculos Trabalhistas</h1>
            <p className="text-sm text-muted-foreground">
              Calculadora completa de verbas rescisórias e direitos trabalhistas
            </p>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Label htmlFor="dataDemissao">Data de Demissão</Label>
                  <Input
                    id="dataDemissao"
                    type="date"
                    value={dataDemissao}
                    onChange={(e) => setDataDemissao(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label>Verbas a Calcular</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ferias"
                    checked={incluirFerias}
                    onCheckedChange={(checked) => setIncluirFerias(checked as boolean)}
                  />
                  <label htmlFor="ferias" className="text-sm cursor-pointer">
                    Férias + 1/3
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="13"
                    checked={incluir13}
                    onCheckedChange={(checked) => setIncluir13(checked as boolean)}
                  />
                  <label htmlFor="13" className="text-sm cursor-pointer">
                    13º Salário
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aviso"
                    checked={incluirAviso}
                    onCheckedChange={(checked) => setIncluirAviso(checked as boolean)}
                  />
                  <label htmlFor="aviso" className="text-sm cursor-pointer">
                    Aviso Prévio
                  </label>
                </div>
              </div>

              <Button onClick={handleCalcular} className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
                {isLoading ? "Calculando..." : "Calcular Verbas"}
              </Button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Resultado</h2>

            {resultado ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <p className="text-sm text-emerald-600">Valor Total da Rescisão</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    R$ {resultado.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Saldo de Salário</span>
                    <span className="font-semibold">
                      R$ {resultado.saldoSalario.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {resultado.ferias > 0 && (
                    <div className="flex justify-between p-3 bg-muted rounded">
                      <span className="text-sm text-muted-foreground">Férias + 1/3</span>
                      <span className="font-semibold">
                        R$ {resultado.ferias.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  {resultado.decimoTerceiro > 0 && (
                    <div className="flex justify-between p-3 bg-muted rounded">
                      <span className="text-sm text-muted-foreground">13º Salário Proporcional</span>
                      <span className="font-semibold">
                        R$ {resultado.decimoTerceiro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  {resultado.avisoPrevi > 0 && (
                    <div className="flex justify-between p-3 bg-muted rounded">
                      <span className="text-sm text-muted-foreground">Aviso Prévio Indenizado</span>
                      <span className="font-semibold">
                        R$ {resultado.avisoPrevi.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Saldo FGTS</span>
                    <span className="font-semibold">
                      R$ {resultado.fgts.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Multa 40% FGTS</span>
                    <span className="font-semibold">
                      R$ {resultado.multaFgts.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Relatório
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-muted-foreground">
                Preencha os dados e clique em calcular
              </div>
            )}
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
}
