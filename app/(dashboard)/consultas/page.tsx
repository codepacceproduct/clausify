"use client"

import { 
  Scale, 
  Activity, 
  Database, 
  ArrowRight,
  Search,
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LayoutWrapper } from "@/components/layout-wrapper"
import Link from "next/link"
import { useState } from "react"

export default function ConsultasPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const tools = [
    {
      title: "Consulta Processual",
      description: "Pesquise processos unificados por número, parte ou OAB em todos os tribunais do Brasil.",
      icon: Scale,
      href: "/consultas/processual",
      badge: "Essencial",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-200 dark:border-emerald-800"
    },
    {
      title: "Monitoramento Processual",
      description: "Acompanhe movimentações, publicações e andamentos dos seus processos cadastrados em tempo real.",
      icon: Activity,
      href: "/consultas/monitoramento",
      badge: "Automático",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      title: "Data Lake (Dados Cadastrais)",
      description: "Consulta completa de PF e PJ. Localize endereços, telefones, e-mails, sócios e bens patrimoniais.",
      icon: Database,
      href: "/consultas/datalake",
      badge: "Premium",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-200 dark:border-purple-800"
    }
  ]

  const filteredTools = tools.filter(tool => 
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <LayoutWrapper>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">Consultas & Monitoramento</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Painel unificado para acesso a dados processuais e inteligência jurídica.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar ferramenta..." 
              className="pl-9 bg-white dark:bg-slate-950"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${tool.color.replace('text-', 'bg-')} opacity-80`} />
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${tool.bgColor} ${tool.color}`}>
                    <tool.icon className="h-6 w-6" />
                  </div>
                  {tool.badge && (
                    <Badge variant="outline" className={`${tool.color} ${tool.borderColor} bg-transparent`}>
                      {tool.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-4 text-xl">{tool.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="pb-4">
                <CardDescription className="text-sm leading-relaxed">
                  {tool.description}
                </CardDescription>
              </CardContent>
              
              <CardFooter className="pt-0">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-between group-hover:${tool.color} hover:bg-transparent pl-0 transition-colors`}
                  asChild
                >
                  <Link href={tool.href}>
                    Acessar Ferramenta
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium">Nenhuma ferramenta encontrada</h3>
            <p className="text-slate-500">Tente buscar por outros termos.</p>
          </div>
        )}
      </div>
    </LayoutWrapper>
  )
}
