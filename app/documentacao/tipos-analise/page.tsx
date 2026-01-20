import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, FileSearch, Scale, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function TiposAnalisePage() {
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

          <h1 className="text-4xl font-bold mb-6">Tipos de Análise</h1>
          <p className="text-xl text-gray-400 mb-12">
            Entenda como a IA da Clausify se adapta a diferentes contextos jurídicos para fornecer insights precisos.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <FileSearch className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Análise Contratual Padrão</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Ideal para revisão geral de documentos. Nossa IA verifica a presença de cláusulas essenciais e identifica termos comuns.
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    <li className="p-3 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">
                      Identificação de Partes
                    </li>
                    <li className="p-3 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">
                      Vigência e Rescisão
                    </li>
                    <li className="p-3 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">
                      Foro e Lei Aplicável
                    </li>
                    <li className="p-3 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">
                      Confidencialidade
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Análises Especializadas</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Você pode selecionar contextos específicos para uma revisão mais aprofundada:
                  </p>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-1">Trabalhista</h4>
                      <p className="text-sm text-gray-400">Verificação de conformidade com a CLT, riscos de vínculo empregatício e benefícios.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-1">Imobiliário</h4>
                      <p className="text-sm text-gray-400">Foco em garantias, índices de reajuste, benfeitorias e condições de devolução do imóvel.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-1">Tecnologia (SaaS/SLA)</h4>
                      <p className="text-sm text-gray-400">Análise de níveis de serviço, propriedade intelectual, proteção de dados (LGPD/GDPR).</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Detecção de Anomalias</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Independentemente do tipo escolhido, o sistema sempre busca por inconsistências, erros de numeração, referências cruzadas quebradas e definições ausentes.
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
