import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, PieChart, AlertCircle, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function InterpretarResultadosPage() {
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

          <h1 className="text-4xl font-bold mb-6">Interpretar Resultados</h1>
          <p className="text-xl text-gray-400 mb-12">
            Aprenda a ler e utilizar o relatório de análise gerado pela Clausify para tomar decisões mais rápidas.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <PieChart className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Score Geral</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    O Score de Risco (0-100) é um indicador rápido da saúde do seu contrato.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="text-2xl font-bold text-emerald-400 mb-1">80-100</div>
                      <div className="text-xs text-emerald-300 uppercase font-semibold">Seguro</div>
                    </div>
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                      <div className="text-2xl font-bold text-amber-400 mb-1">50-79</div>
                      <div className="text-xs text-amber-300 uppercase font-semibold">Atenção</div>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="text-2xl font-bold text-red-400 mb-1">0-49</div>
                      <div className="text-xs text-red-300 uppercase font-semibold">Crítico</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Classificação de Riscos</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Cada cláusula analisada é categorizada de acordo com seu potencial impacto:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <span className="shrink-0 w-2 h-2 mt-2 rounded-full bg-red-500"></span>
                      <div>
                        <strong className="text-white block">Risco Alto</strong>
                        <span className="text-sm text-gray-400">Cláusulas que podem gerar prejuízo financeiro significativo ou responsabilidade legal grave. Ex: Multas abusivas, rescisão unilateral sem aviso.</span>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="shrink-0 w-2 h-2 mt-2 rounded-full bg-amber-500"></span>
                      <div>
                        <strong className="text-white block">Risco Médio</strong>
                        <span className="text-sm text-gray-400">Pontos que fogem do padrão de mercado ou são ambíguos, mas não necessariamente críticos. Ex: Prazos de pagamento curtos, renovação automática.</span>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500"></span>
                      <div>
                        <strong className="text-white block">Informativo</strong>
                        <span className="text-sm text-gray-400">Dados extraídos para conhecimento, sem juízo de valor negativo. Ex: Datas, valores, nomes.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Sugestões de Redação</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Para cada risco identificado, a Clausify oferece uma sugestão de nova redação para a cláusula. 
                    Você pode copiar essa sugestão diretamente ou usá-la como base para sua negociação.
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
