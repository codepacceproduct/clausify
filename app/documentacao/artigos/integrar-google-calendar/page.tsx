import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, Calendar, Settings, Bell } from "lucide-react"
import Link from "next/link"

export default function IntegrarGoogleCalendarPage() {
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

          <h1 className="text-4xl font-bold mb-6">Integrar com Google Calendar</h1>
          <p className="text-xl text-gray-400 mb-12">
            Sincronize prazos de contratos e vencimentos diretamente na sua agenda.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">1. Conecte sua Conta</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Vá até <strong>Configurações &gt; Integrações</strong> e procure pelo card do Google Calendar. Clique em "Conectar" e autorize o acesso da Clausify à sua agenda.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">2. Escolha os Eventos</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Selecione quais tipos de data você quer sincronizar:
                  </p>
                  <ul className="space-y-2 text-gray-400 ml-4">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Data de Vencimento do Contrato
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Prazo de Renovação Automática (Aviso Prévio)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Datas de Pagamento/Parcelas
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">3. Configurar Lembretes</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Você pode definir notificações personalizadas dentro do próprio Google Calendar (ex: e-mail 1 dia antes, notificação push 30 min antes) para cada evento criado pela Clausify.
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
