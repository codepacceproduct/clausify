import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, BookOpen, CheckCircle, Scale } from "lucide-react"
import Link from "next/link"

export default function PlaybookJuridicoPage() {
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

          <h1 className="text-4xl font-bold mb-6">Playbook Jurídico</h1>
          <p className="text-xl text-gray-400 mb-12">
            Padronize a análise de contratos ensinando à IA as regras específicas da sua empresa.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">O que é o Playbook?</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    O Playbook é a "bíblia" de negociação da sua empresa. Nele, você define quais cláusulas são aceitáveis, quais exigem aprovação e quais são proibidas.
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    A IA da Clausify usa esse guia para comparar os contratos recebidos com o padrão ouro da sua organização, destacando desvios automaticamente.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Configurando Cláusulas</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Para cada tipo de cláusula (ex: Indenização, Multa, Foro), você pode definir:
                  </p>
                  <ul className="space-y-4">
                    <li className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <strong className="block text-emerald-400 mb-1">Posição Preferencial</strong>
                      <span className="text-sm text-gray-400">O texto ideal que sua empresa gostaria de usar.</span>
                    </li>
                    <li className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <strong className="block text-amber-400 mb-1">Posição Aceitável (Fallback)</strong>
                      <span className="text-sm text-gray-400">Variações que podem ser aceitas sem necessidade de escalonar.</span>
                    </li>
                    <li className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <strong className="block text-red-400 mb-1">Deal Breaker</strong>
                      <span className="text-sm text-gray-400">Termos que, se presentes, bloqueiam a assinatura do contrato.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Aplicação Automática</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Uma vez configurado, o Playbook é aplicado em todas as análises. Se um contrato de fornecedor tiver uma multa de 50% e seu Playbook permitir no máximo 10%, a IA sinalizará o risco e sugerirá a redação correta do seu Playbook.
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
