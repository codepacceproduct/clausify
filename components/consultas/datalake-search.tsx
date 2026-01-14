"use client"

import { useState } from "react"
import { Search, Building2, User, Fingerprint } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

interface DataLakeSearchProps {
  onSearch: (term: string, type: "pf" | "pj") => void
}

export function DataLakeSearch({ onSearch }: DataLakeSearchProps) {
  const [searchType, setSearchType] = useState<"pf" | "pj">("pf")
  const [term, setTerm] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (term) {
      onSearch(term, searchType)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-950 dark:to-slate-900/50">
      <CardHeader className="text-center pb-8">
        <div className="mx-auto p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-full w-fit mb-4">
          <Search className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Data Lake Cadastral
        </CardTitle>
        <CardDescription className="text-lg mt-2">
          Localize pessoas e empresas em nossa base de dados unificada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pf" className="w-full" onValueChange={(v) => setSearchType(v as "pf" | "pj")}>
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-900 mb-6 p-1 h-auto">
            <TabsTrigger 
              value="pf"
              className="py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-semibold">Pessoa Física</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="pj"
              className="py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="font-semibold">Pessoa Jurídica</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="pf" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="pf-search">CPF ou Nome Completo</Label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="pf-search"
                    placeholder="Digite o CPF (apenas números) ou nome..."
                    className="pl-9 h-12 text-lg border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pj" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="pj-search">CNPJ ou Razão Social</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="pj-search"
                    placeholder="Digite o CNPJ (apenas números) ou razão social..."
                    className="pl-9 h-12 text-lg border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
              disabled={!term}
            >
              Consultar Base de Dados
            </Button>
          </form>
        </Tabs>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">230M+</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">CPFs</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">55M+</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">CNPJs</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Atualizado</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">24/7</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Disponível</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
