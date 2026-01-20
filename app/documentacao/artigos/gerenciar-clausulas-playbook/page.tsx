import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, BookOpen, Edit3, Save } from "lucide-react"
import Link from "next/link"

export default function GerenciarClausulasPlaybookPage() {
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

          <h1 className="text-4xl font-bold mb-6">Gerenciar Cláusulas do Playbook</h1>
          <p className="text-xl text-gray-400 mb-12">
            Mantenha sua biblioteca de cláusulas atualizada para garantir a conformidade nas análises.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">1. Acesse a Biblioteca</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    No menu <strong>Playbook</strong>, você verá a lista de todas as cláusulas padrão (Indenização, Confidencialidade, Lei Aplicável, etc.).
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Edit3 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">2. Editando uma Cláusula</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Ao clicar em uma cláusula, você pode definir três variações de texto:
                  </p>
                  <ul className="space-y-3 text-gray-400">
                    <li className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <strong className="block text-emerald-400 mb-1">Texto Preferencial</strong>
                      A redação ideal que sua empresa sempre tenta usar.
                    </li>
                    <li className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <strong className="block text-amber-400 mb-1">Texto Aceitável</strong>
                      Uma versão alternativa, menos rigorosa, mas ainda aprovada.
                    </li>
                    <li className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <strong className="block text-red-400 mb-1">Termos Proibidos</strong>
                      Palavras-chave ou condições que nunca devem ser aceitas (ex: "Renovação automática por 5 anos").
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Save className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">3. Versionamento do Playbook</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Toda alteração gera uma nova versão do Playbook. Você pode reverter para versões anteriores caso uma mudança na política da empresa precise ser desfeita.
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
