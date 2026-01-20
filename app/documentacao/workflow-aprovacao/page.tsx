import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, GitPullRequest, UserCheck, Layers } from "lucide-react"
import Link from "next/link"

export default function WorkflowAprovacaoPage() {
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

          <h1 className="text-4xl font-bold mb-6">Workflow de Aprovação</h1>
          <p className="text-xl text-gray-400 mb-12">
            Automatize o fluxo de validação de contratos envolvendo as pessoas certas na hora certa.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <GitPullRequest className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Fluxos Condicionais</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Crie regras inteligentes para rotear documentos automaticamente:
                  </p>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                      <p>Contratos <strong>acima de R$ 50.000</strong> vão para o Diretor Financeiro.</p>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                      <p>Cláusulas de <strong>LGPD</strong> acionam o DPO (Encarregado de Dados).</p>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                      <p>Contratos Padrão (Score &gt; 90) podem ter <strong>aprovação automática</strong>.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Aprovação Sequencial vs. Paralela</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Flexibilidade para definir a ordem das assinaturas internas:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-2">Sequencial</h4>
                      <p className="text-sm text-gray-400">Jurídico aprova {'>'} Financeiro aprova {'>'} CEO assina. Um bloqueia o próximo.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-2">Paralela</h4>
                      <p className="text-sm text-gray-400">Jurídico e Financeiro recebem ao mesmo tempo. O documento segue quando todos aprovarem.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Rastreabilidade</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Cada etapa do workflow é registrada no log de auditoria: quem aprovou, quando, e quais comentários foram deixados. Se alguém rejeitar, o fluxo volta para o solicitante com o motivo obrigatório.
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
