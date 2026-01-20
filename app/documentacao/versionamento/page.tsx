import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, History, GitCompare, RefreshCcw } from "lucide-react"
import Link from "next/link"

export default function VersionamentoPage() {
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

          <h1 className="text-4xl font-bold mb-6">Versionamento de Contratos</h1>
          <p className="text-xl text-gray-400 mb-12">
            Controle todas as alterações e negociações com um sistema de versionamento robusto.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <History className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Histórico Completo</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    A Clausify salva automaticamente cada nova versão do documento (V1, V2, V3...) quando você faz upload de uma revisão ou edita online.
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    Você pode acessar qualquer versão anterior a qualquer momento, visualizar quem fez as alterações e restaurar versões antigas se necessário.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <GitCompare className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Comparação de Versões (Redline)</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Nossa ferramenta de <strong>Diff Checker</strong> compara duas versões lado a lado e destaca visualmente o que mudou:
                  </p>
                  <ul className="space-y-2 text-gray-400 ml-4">
                    <li className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 px-2 rounded text-xs">Adicionado</span>
                      Texto novo aparece em verde.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-red-500/20 text-red-400 px-2 rounded text-xs line-through">Removido</span>
                      Texto excluído aparece em vermelho tachado.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <RefreshCcw className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Controle de Alterações</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Compatível com o "Track Changes" do Word. Se você baixar um documento, editar no Word com controle de alterações ativado e fizer upload novamente, a Clausify reconhecerá e incorporará essas marcações.
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
