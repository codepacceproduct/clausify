"use client"

import { useState } from "react"
import { Search, Siren, User, FileText, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface WarrantsSearchProps {
  onSearch: (data: any) => void
}

export function WarrantsSearch({ onSearch }: WarrantsSearchProps) {
  const [name, setName] = useState("")
  const [motherName, setMotherName] = useState("")
  const [cpf, setCpf] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name || cpf) {
      onSearch({ name, motherName, cpf })
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-950 dark:to-slate-900/50">
      <CardHeader className="text-center pb-8">
        <div className="mx-auto p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-full w-fit mb-4">
          <Siren className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Consulta de Mandados de Prisão
        </CardTitle>
        <CardDescription className="text-lg mt-2">
          Busca unificada no Banco Nacional de Mandados de Prisão (BNMP).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600" />
                Nome Completo
              </Label>
              <Input 
                id="name"
                placeholder="Digite o nome completo do pesquisado"
                className="h-12 text-lg border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  CPF (Opcional)
                </Label>
                <Input 
                  id="cpf"
                  placeholder="000.000.000-00"
                  className="h-12 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mother" className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" />
                  Nome da Mãe (Opcional)
                </Label>
                <Input 
                  id="mother"
                  placeholder="Nome da mãe para desempate"
                  className="h-12 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-900/50">
              <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
                <strong>Atenção:</strong> A busca retorna apenas mandados públicos e vigentes. Processos em segredo de justiça podem não ser exibidos.
              </p>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
            disabled={!name && !cpf}
          >
            <Search className="mr-2 h-5 w-5" />
            Pesquisar Mandados
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
