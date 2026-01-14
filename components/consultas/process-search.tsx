"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search, ShieldCheck, Clock, Eye, MessageCircle } from "lucide-react"

interface ProcessSearchProps {
  onSearch: (term: string, type: "process" | "cpf") => void
}

export function ProcessSearch({ onSearch }: ProcessSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"process" | "cpf">("process")

  const handleSearch = () => {
    if (!searchTerm) return
    onSearch(searchTerm, searchType)
  }

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Left Column: Value Proposition */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Acompanhe seu processo
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Entre com CPF ou número do processo para ver as atualizações de forma simples, clara e objetiva.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500 mt-1">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Atualização clara</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Sem termos difíceis ou "juridiquês".</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500 mt-1">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Último andamento</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">O que aconteceu e o que vem agora.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500 mt-1">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Privacidade</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Dados usados só para consulta.</p>
            </div>
          </div>
        </div>

        {/* Decorative Gradient Line */}
        <div className="h-32 w-full bg-gradient-to-r from-slate-900 via-emerald-900/20 to-transparent rounded-lg opacity-50 hidden lg:block" />
      </div>

      {/* Right Column: Search Form */}
      <Card className="w-full border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Entrar</CardTitle>
          <CardDescription className="text-slate-400">
            Escolha como deseja acessar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="process" className="w-full" onValueChange={(v) => setSearchType(v as "process" | "cpf")}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-900 mb-6">
              <TabsTrigger 
                value="cpf"
                className="data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-500"
              >
                CPF
              </TabsTrigger>
              <TabsTrigger 
                value="process"
                className="data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-500"
              >
                Nº do Processo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="process" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="process-number" className="text-slate-300">Número do processo (formato padrão)</Label>
                <Input 
                  id="process-number"
                  placeholder="0000000-00.0000.0.00.0000" 
                  className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="cpf" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-slate-300">CPF do titular</Label>
                <Input 
                  id="cpf"
                  placeholder="000.000.000-00" 
                  className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </TabsContent>

            <div className="mt-6 space-y-4">
              <Button 
                className="w-full bg-slate-800 hover:bg-slate-700 text-white border-l-4 border-l-emerald-500"
                onClick={handleSearch}
              >
                Acessar
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-sm text-emerald-500 hover:text-emerald-400 cursor-pointer transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span>Não consegue acessar? Falar com o escritório</span>
              </div>
            </div>
            
            <p className="mt-6 text-xs text-center text-slate-500">
              Seus dados são usados apenas para consulta.
            </p>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
