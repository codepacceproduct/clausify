"use client"

import { useState } from "react"
import { Search, ShieldAlert, Fingerprint, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CriminalSearchProps {
  onSearch: (data: any) => void
}

export function CriminalSearch({ onSearch }: CriminalSearchProps) {
  const [searchType, setSearchType] = useState<"cpf" | "name">("cpf")
  const [term, setTerm] = useState("")
  const [state, setState] = useState("todos")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (term) {
      onSearch({ term, type: searchType, state })
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-950 dark:to-slate-900/50">
      <CardHeader className="text-center pb-8">
        <div className="mx-auto p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-full w-fit mb-4">
          <ShieldAlert className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Antecedentes Criminais
        </CardTitle>
        <CardDescription className="text-lg mt-2">
          Varredura completa em tribunais estaduais e federais.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <RadioGroup 
              defaultValue="cpf" 
              className="flex justify-center gap-6"
              onValueChange={(v) => setSearchType(v as "cpf" | "name")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cpf" id="cpf" className="text-emerald-600 border-emerald-600" />
                <Label htmlFor="cpf" className="cursor-pointer">Por CPF</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name" id="name" className="text-emerald-600 border-emerald-600" />
                <Label htmlFor="name" className="cursor-pointer">Por Nome</Label>
              </div>
            </RadioGroup>

            <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
              <div className="space-y-2">
                <Label htmlFor="search-term">
                  {searchType === "cpf" ? "CPF do Investigado" : "Nome Completo"}
                </Label>
                <div className="relative">
                  {searchType === "cpf" ? (
                    <Fingerprint className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  ) : (
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  )}
                  <Input 
                    id="search-term"
                    placeholder={searchType === "cpf" ? "000.000.000-00" : "Nome completo do investigado"}
                    className="pl-9 h-12 text-lg border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Abrangência</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="h-12 border-slate-200 dark:border-slate-800 focus:ring-emerald-500">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Nacional (Todos)</SelectItem>
                    <SelectItem value="sp">São Paulo</SelectItem>
                    <SelectItem value="rj">Rio de Janeiro</SelectItem>
                    <SelectItem value="mg">Minas Gerais</SelectItem>
                    <SelectItem value="rs">Rio Grande do Sul</SelectItem>
                    <SelectItem value="pr">Paraná</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
              disabled={!term}
            >
              <Search className="mr-2 h-5 w-5" />
              Realizar Varredura
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <p>
              Esta consulta abrange: Justiça Federal, Tribunais de Justiça Estaduais, TRFs e Tribunais Superiores (STJ/STF).
              O sigilo da busca é garantido.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
