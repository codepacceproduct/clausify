"use client"

import { Siren, Calendar, MapPin, AlertTriangle, FileText, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Warrant {
  id: string
  number: string
  personName: string
  court: string
  status: "pending" | "fulfilled" | "expired"
  issueDate: string
  validUntil: string
  reason: string
  magistrate: string
}

interface WarrantsResultProps {
  onBack: () => void
}

const MOCK_WARRANTS: Warrant[] = [
  {
    id: "1",
    number: "0012345-67.2023.8.26.0050.01.0001-00",
    personName: "JOÃO DA SILVA",
    court: "TJSP - Tribunal de Justiça de São Paulo",
    status: "pending",
    issueDate: "15/03/2023",
    validUntil: "15/03/2035",
    reason: "Roubo Majorado (Art. 157)",
    magistrate: "Dr. Roberto Medeiros"
  },
  {
    id: "2",
    number: "0098765-43.2022.8.19.0001.01.0002-00",
    personName: "JOÃO DA SILVA",
    court: "TJRJ - Tribunal de Justiça do Rio de Janeiro",
    status: "fulfilled",
    issueDate: "10/02/2022",
    validUntil: "10/02/2030",
    reason: "Furto Qualificado",
    magistrate: "Dra. Ana Paula Souza"
  }
]

export function WarrantsResult({ onBack }: WarrantsResultProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Siren className="h-6 w-6 text-emerald-500" />
            Resultados da Busca
          </h1>
          <p className="text-muted-foreground">
            Foram encontrados {MOCK_WARRANTS.length} registros no Banco Nacional (BNMP).
          </p>
        </div>
        <Button onClick={onBack} variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20">
          Nova Pesquisa
        </Button>
      </div>

      <div className="grid gap-4">
        {MOCK_WARRANTS.map((warrant) => (
          <Card key={warrant.id} className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{warrant.personName}</h3>
                    {warrant.status === 'pending' ? (
                      <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">Pendente de Cumprimento</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Cumprido / Revogado</Badge>
                    )}
                  </div>
                  <p className="text-sm font-mono text-muted-foreground">Mandado nº {warrant.number}</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center justify-end gap-1">
                    <Calendar className="h-3 w-3" />
                    Expedição: {warrant.issueDate}
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-1 text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-3 w-3" />
                    Validade: {warrant.validUntil}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase">Tribunal / Órgão</label>
                  <p className="text-sm font-medium flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    {warrant.court}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase">Motivo / Crime</label>
                  <p className="text-sm font-medium flex items-center gap-2 mt-1">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    {warrant.reason}
                  </p>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full border rounded-lg px-4 bg-slate-50 dark:bg-slate-900/50">
                <AccordionItem value="details" className="border-0">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Ver Detalhes Completos</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 pt-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Magistrado Expedidor:</span>
                        <p className="text-sm">{warrant.magistrate}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Situação Atual:</span>
                        <p className="text-sm capitalize">{warrant.status === 'pending' ? 'Aguardando Cumprimento' : 'Arquivado/Cumprido'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-xs text-muted-foreground">Síntese da Decisão:</span>
                        <p className="text-sm text-muted-foreground mt-1 bg-white dark:bg-slate-950 p-3 rounded border">
                          Determino a expedição de mandado de prisão em desfavor do réu, com prazo de validade de 12 anos, observando-se as cautelas legais e a comunicação aos órgãos competentes.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
