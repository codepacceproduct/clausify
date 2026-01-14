"use client"

import { useState } from "react"
import { BellRing, Plus, AlertCircle, Building2, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NewActionsSearchProps {
  onSearch: (data: any) => void
}

export function NewActionsSearch({ onSearch }: NewActionsSearchProps) {
  const [searchType, setSearchType] = useState<"pf" | "pj">("pj")
  const [term, setTerm] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (term) {
      onSearch({ term, type: searchType })
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-950 dark:to-slate-900/50">
      <CardHeader className="text-center pb-8">
        <div className="mx-auto p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-full w-fit mb-4">
          <BellRing className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Novas Ações (Distribuição)
        </CardTitle>
        <CardDescription className="text-lg mt-2">
          Monitoramento preventivo de distribuição de processos em tempo real.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pj" className="w-full" onValueChange={(v) => setSearchType(v as "pf" | "pj")}>
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-900 mb-6 p-1 h-auto">
            <TabsTrigger 
              value="pj"
              className="py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="font-semibold">Empresa (CNPJ)</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="pf"
              className="py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-semibold">Pessoa (CPF)</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="search-term" className="text-base">
                {searchType === "pj" ? "CNPJ da Empresa" : "CPF da Pessoa"}
              </Label>
              <div className="relative">
                <Input 
                  id="search-term"
                  placeholder={searchType === "pj" ? "00.000.000/0000-00" : "000.000.000-00"}
                  className="pl-4 h-12 text-lg border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                <AlertCircle className="h-3 w-3" />
                O monitoramento identificará qualquer nova ação onde este documento conste como Réu ou Autor.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
              disabled={!term}
            >
              <Plus className="mr-2 h-5 w-5" />
              Adicionar ao Monitoramento
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  )
}
