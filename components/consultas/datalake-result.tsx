"use client"

import { User, MapPin, Phone, Mail, Building2, Calendar, DollarSign, Users, Briefcase, Car, ArrowLeft, Copy, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

interface DataLakeResultProps {
  data: any
  onBack: () => void
}

export function DataLakeResult({ data, onBack }: DataLakeResultProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-2 pl-0 hover:pl-2 transition-all hover:bg-transparent hover:text-emerald-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para busca
      </Button>

      {/* Header Info */}
      <Card className="border-emerald-200 dark:border-emerald-900 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-400" />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border-4 border-white dark:border-slate-900 shadow-lg">
              {data.type === "pf" ? (
                <User className="h-10 w-10 text-slate-400" />
              ) : (
                <Building2 className="h-10 w-10 text-slate-400" />
              )}
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 uppercase">
                  {data.name}
                </h1>
                <Badge variant={data.status === "Regular" ? "default" : "destructive"} className={data.status === "Regular" ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                  {data.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-foreground">{data.document}</span>
                  <button onClick={() => copyToClipboard(data.document, "doc")} className="ml-1 text-slate-400 hover:text-emerald-500">
                    {copiedField === "doc" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Nascimento/Abertura: {data.birthDate}
                </div>
                {data.motherName && (
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    Mãe: {data.motherName}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
          <TabsTrigger 
            value="contact" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1"
          >
            Contatos e Endereços
          </TabsTrigger>
          <TabsTrigger 
            value="professional" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1"
          >
            {data.type === "pf" ? "Profissional e Renda" : "Sócios e Capital"}
          </TabsTrigger>
          <TabsTrigger 
            value="assets" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1"
          >
            Bens e Veículos
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="contact" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-500" />
                    Endereços
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.addresses.map((addr: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0 border-slate-100 dark:border-slate-800">
                      <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{addr.street}, {addr.number} {addr.complement}</p>
                        <p className="text-sm text-muted-foreground">{addr.neighborhood} - {addr.city}/{addr.state}</p>
                        <p className="text-xs text-muted-foreground mt-1">CEP: {addr.zipCode}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Phone className="h-5 w-5 text-emerald-500" />
                      Telefones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.phones.map((phone: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{phone.number}</span>
                          {phone.isWhatsapp && (
                            <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-600 px-1 py-0 h-4">WhatsApp</Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{phone.type}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="h-5 w-5 text-emerald-500" />
                      E-mails
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.emails.map((email: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors overflow-hidden">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-sm truncate">{email}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="professional" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {data.type === "pf" ? (
              <div className="grid md:grid-cols-2 gap-6">
                 <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-emerald-500" />
                      Ocupação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Profissão Principal</p>
                        <p className="text-base">{data.profession}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Vínculo Empregatício</p>
                        <p className="text-base">{data.employment}</p>
                     </div>
                  </CardContent>
                 </Card>
                 <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-emerald-500" />
                      Renda Estimada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        {data.income}
                     </div>
                     <p className="text-sm text-muted-foreground mt-2">
                        Baseado em modelos preditivos e histórico.
                     </p>
                  </CardContent>
                 </Card>
              </div>
            ) : (
              <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-500" />
                    Quadro Societário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.partners.length > 0 ? (
                      data.partners.map((partner: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <User className="h-5 w-5 text-slate-500" />
                              </div>
                              <div>
                                <p className="font-medium">{partner.name}</p>
                                <p className="text-xs text-muted-foreground">{partner.role}</p>
                              </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhum sócio encontrado na base.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-emerald-500" />
                    Dados Corporativos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase">Natureza Jurídica</p>
                      <p className="text-sm mt-1">{data.legalNature || "Não informado"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase">Capital Social</p>
                      <p className="text-sm mt-1 font-mono">
                        {data.shareCapital 
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(data.shareCapital))
                          : "Não informado"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                     <p className="text-xs text-muted-foreground font-medium uppercase mb-2">Regime Tributário</p>
                     <div className="flex gap-2">
                        <Badge variant={data.taxInfo?.isSimples ? "default" : "secondary"} className={data.taxInfo?.isSimples ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                            {data.taxInfo?.isSimples ? "Simples Nacional" : "Não Optante Simples"}
                        </Badge>
                        {data.taxInfo?.isMei && (
                            <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                                MEI
                            </Badge>
                        )}
                     </div>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                     <p className="text-xs text-muted-foreground font-medium uppercase mb-2">Atividade Principal (CNAE)</p>
                     <div className="bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded text-sm border border-emerald-100 dark:border-emerald-900/30">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 mr-2">{data.mainActivity?.code}</span>
                        {data.mainActivity?.text}
                     </div>
                  </div>

                  {data.secondaryActivities?.length > 0 && (
                    <div className="pt-2">
                       <p className="text-xs text-muted-foreground font-medium uppercase mb-2">Atividades Secundárias</p>
                       <ScrollArea className="h-32 rounded border p-2">
                         <div className="space-y-2">
                           {data.secondaryActivities.map((cnae: any, i: number) => (
                             <div key={i} className="text-xs">
                               <span className="font-bold text-slate-600 dark:text-slate-400 mr-2">{cnae.code}</span>
                               {cnae.text}
                             </div>
                           ))}
                         </div>
                       </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="assets" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="grid md:grid-cols-2 gap-6">
                <Card>
                   <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                         <Car className="h-5 w-5 text-emerald-500" />
                         Veículos
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      {data.vehicles.length > 0 ? (
                         data.vehicles.map((vehicle: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                               <div className="space-y-1">
                                  <p className="font-medium">{vehicle.model}</p>
                                  <div className="flex gap-2 text-xs text-muted-foreground">
                                     <span>{vehicle.plate}</span>
                                     <span>•</span>
                                     <span>{vehicle.year}</span>
                                  </div>
                               </div>
                            </div>
                         ))
                      ) : (
                         <p className="text-sm text-muted-foreground">Nenhum veículo encontrado.</p>
                      )}
                   </CardContent>
                </Card>
             </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
