import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Zap, Scale, BarChart3, Lock, Users } from "lucide-react"

export default function SobrePage() {
  return (
    <LayoutWrapper>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <Badge variant="outline" className="px-4 py-1 text-sm border-emerald-500/50 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20">
            Plataforma de Inteligência Jurídica
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Clausify <span className="text-emerald-600">Enterprise</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A solução definitiva para gestão contratual, análise preditiva e inteligência de dados jurídicos. 
            Potencialize sua equipe com tecnologia de ponta e insights estratégicos.
          </p>
        </div>

        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900/50">
            <CardHeader>
              <Zap className="h-8 w-8 text-amber-500 mb-2" />
              <CardTitle>Análise Contratual IA</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Algoritmos avançados que analisam cláusulas em segundos, identificando riscos, inconsistências e oportunidades de negociação com precisão cirúrgica.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900/50">
            <CardHeader>
              <Scale className="h-8 w-8 text-emerald-500 mb-2" />
              <CardTitle>Jurimetria Avançada</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Acesse dados de milhões de processos em tempo real. Preveja tendências, analise o comportamento de magistrados e tome decisões baseadas em dados.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900/50">
            <CardHeader>
              <Shield className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Segurança Militar</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Seus dados protegidos com criptografia de ponta a ponta. Conformidade total com LGPD e normas internacionais de segurança da informação.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900/50">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-violet-500 mb-2" />
              <CardTitle>Dashboard Executivo</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Visão 360º da sua operação jurídica. KPIs em tempo real, gestão de prazos e monitoramento de produtividade em um único painel intuitivo.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900/50">
            <CardHeader>
              <Users className="h-8 w-8 text-indigo-500 mb-2" />
              <CardTitle>Gestão de Equipes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Controle de acesso granular, distribuição inteligente de tarefas e fluxo de aprovações customizável para departamentos jurídicos modernos.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900/50">
            <CardHeader>
              <Lock className="h-8 w-8 text-rose-500 mb-2" />
              <CardTitle>Compliance Automático</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Monitoramento contínuo de conformidade. Alertas automáticos sobre alterações legislativas e riscos regulatórios que impactam seu negócio.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Call to Action */}
        <div className="mt-8 relative overflow-hidden rounded-2xl bg-slate-950 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20" />
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold">Desbloqueie todo o potencial</h2>
              <p className="text-slate-300 text-lg">
                Você está visualizando a versão gratuita. Para ter acesso a todas as ferramentas de análise, jurimetria e gestão, atualize seu plano agora mesmo.
              </p>
            </div>
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 h-12 text-lg shadow-lg hover:shadow-emerald-500/25 transition-all">
              <Link href="/configuracoes">Fazer Upgrade</Link>
            </Button>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
