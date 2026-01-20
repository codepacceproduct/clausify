import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, ShieldAlert, Sliders, ListFilter } from "lucide-react"
import Link from "next/link"

export default function ClassificacaoRiscosPage() {
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

          <h1 className="text-4xl font-bold mb-6">Classificação de Riscos</h1>
          <p className="text-xl text-gray-400 mb-12">
            Entenda e personalize como a plataforma identifica e classifica os riscos nos seus documentos.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Matriz de Risco Padrão</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    A Clausify utiliza uma matriz de risco baseada em Probabilidade x Impacto, treinada em milhares de contratos.
                  </p>
                  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm text-gray-400">
                      <thead className="bg-white/5 text-white font-semibold">
                        <tr>
                          <th className="p-4">Nível</th>
                          <th className="p-4">Cor</th>
                          <th className="p-4">Descrição</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr>
                          <td className="p-4">Crítico</td>
                          <td className="p-4"><span className="px-2 py-1 rounded bg-red-500/20 text-red-400">Vermelho</span></td>
                          <td className="p-4">Violações legais, multas desproporcionais, cláusulas nulas.</td>
                        </tr>
                        <tr>
                          <td className="p-4">Alto</td>
                          <td className="p-4"><span className="px-2 py-1 rounded bg-orange-500/20 text-orange-400">Laranja</span></td>
                          <td className="p-4">Desequilíbrio contratual severo, responsabilidade ilimitada.</td>
                        </tr>
                        <tr>
                          <td className="p-4">Moderado</td>
                          <td className="p-4"><span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">Amarelo</span></td>
                          <td className="p-4">Termos vagos, prazos apertados, renovação automática indesejada.</td>
                        </tr>
                        <tr>
                          <td className="p-4">Baixo</td>
                          <td className="p-4"><span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400">Azul</span></td>
                          <td className="p-4">Pontos de atenção menores, recomendações de melhoria.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Sliders className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Personalização de Critérios</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Sua organização pode ter tolerâncias a risco diferentes. Você pode ajustar os pesos na área de configurações.
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    <li>Definir palavras-chave proibidas (Blacklist).</li>
                    <li>Ajustar o limite de valor financeiro para alertas.</li>
                    <li>Configurar jurisdições aceitáveis.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ListFilter className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Categorias Analisadas</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Nossa IA classifica automaticamente os riscos em categorias como: Financeiro, Operacional, Compliance, Reputacional e Jurídico, facilitando a filtragem e delegação para os departamentos responsáveis.
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
