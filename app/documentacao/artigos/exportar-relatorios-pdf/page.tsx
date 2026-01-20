import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, FileDown, Settings, Filter } from "lucide-react"
import Link from "next/link"

export default function ExportarRelatoriosPdfPage() {
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

          <h1 className="text-4xl font-bold mb-6">Exportar Relatórios em PDF</h1>
          <p className="text-xl text-gray-400 mb-12">
            Compartilhe os resultados da análise com sua equipe ou clientes externos.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <FileDown className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">1. Botão de Exportação</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Na tela de análise do contrato, no canto superior direito, você encontrará o botão <strong>"Exportar"</strong>. Clique nele e selecione a opção "Relatório PDF".
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Filter className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">2. Personalize o Conteúdo</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Antes de gerar o arquivo, você pode escolher o que incluir:
                  </p>
                  <ul className="space-y-2 text-gray-400 ml-4">
                    <li className="flex items-center gap-2">
                      <input type="checkbox" checked readOnly className="accent-emerald-500" />
                      Resumo Executivo (Score e Principais Riscos)
                    </li>
                    <li className="flex items-center gap-2">
                      <input type="checkbox" checked readOnly className="accent-emerald-500" />
                      Detalhamento de Cláusulas
                    </li>
                    <li className="flex items-center gap-2">
                      <input type="checkbox" checked readOnly className="accent-emerald-500" />
                      Sugestões de Redação
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">3. Marca Branca (White Label)</h2>
                  <p className="text-gray-400 leading-relaxed">
                    No plano Enterprise, é possível remover o logo da Clausify e adicionar o logotipo do seu escritório ou empresa no cabeçalho do relatório PDF.
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
