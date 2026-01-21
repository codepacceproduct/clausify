import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, Bell, Clock, Zap } from "lucide-react"
import Link from "next/link"

export default function AlertasAutomaticosPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/documentacao" 
            className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Documentação
          </Link>

          <h1 className="text-4xl font-bold mb-6">Alertas Automáticos</h1>
          <p className="text-xl text-gray-400 mb-12">
            Não perca prazos nem deixe passar riscos despercebidos. Configure o sistema de notificações da Clausify.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Notificações de Risco</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Receba avisos imediatos quando um contrato analisado contiver riscos acima do seu limite de tolerância.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-2">No Dashboard</h4>
                      <p className="text-sm text-gray-400">Alertas visuais e badges de notificação na interface.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-2">Por E-mail</h4>
                      <p className="text-sm text-gray-400">Resumo diário ou alertas em tempo real para riscos críticos.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Gestão de Prazos</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    A IA extrai automaticamente datas importantes dos contratos (vencimento, renovação, prazos de pagamento) e cria lembretes.
                  </p>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                      Alertas de renovação automática (30, 60, 90 dias antes)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                      Lembretes de vencimento de contrato
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                      Avisos de reajuste de valores (IGPM, IPCA)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Gatilhos de Workflow</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Configure ações automáticas baseadas em alertas. Por exemplo: "Se Risco &gt; 80, solicitar aprovação do Diretor Jurídico" ou "Se valor &gt; R$ 50k, notificar Financeiro".
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
