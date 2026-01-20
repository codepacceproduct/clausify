import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, Upload, FileSearch, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function PrimeiroContratoPage() {
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

          <h1 className="text-4xl font-bold mb-6">Seu primeiro contrato</h1>
          <p className="text-xl text-gray-400 mb-12">
            Aprenda como fazer upload e analisar seu primeiro contrato usando a inteligência artificial da Clausify.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">1. Upload do documento</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    No seu dashboard, clique no botão "Nova Análise" ou "Upload". Você pode arrastar e soltar seu arquivo ou selecioná-lo do seu computador.
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    <li>Formatos suportados: PDF, DOCX, TXT</li>
                    <li>Tamanho máximo: 10MB</li>
                    <li>Recomendamos documentos com texto selecionável (OCR)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <FileSearch className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">2. Selecione o tipo de análise</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Escolha o tipo de contrato (ex: Prestação de Serviços, NDA, Locação) e o nível de análise desejado. 
                    Nossa IA irá adaptar os critérios de revisão baseados no tipo selecionado.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">3. Revise os resultados</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Em segundos, você receberá um relatório completo contendo:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-2">Score de Risco</h4>
                      <p className="text-sm text-gray-400">Uma pontuação de 0 a 100 indicando a segurança do documento.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-2">Cláusulas Críticas</h4>
                      <p className="text-sm text-gray-400">Pontos de atenção que exigem sua revisão imediata.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-2">Sugestões</h4>
                      <p className="text-sm text-gray-400">Recomendações de alteração para mitigar riscos.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-2">Resumo</h4>
                      <p className="text-sm text-gray-400">Visão geral das obrigações e prazos.</p>
                    </div>
                  </div>
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
