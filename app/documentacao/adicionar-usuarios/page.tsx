import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, UserPlus, Mail, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

export default function AdicionarUsuariosPage() {
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

          <h1 className="text-4xl font-bold mb-6">Adicionar Usuários</h1>
          <p className="text-xl text-gray-400 mb-12">
            Saiba como convidar membros da sua equipe e gerenciar o crescimento do seu time na Clausify.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Convite por E-mail</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    O método mais comum é enviar um convite direto para o e-mail corporativo do colaborador.
                  </p>
                  <ol className="list-decimal list-inside text-gray-400 space-y-2 ml-2">
                    <li>Acesse <strong>Configurações &gt; Equipe</strong>.</li>
                    <li>Clique no botão <strong>Convidar Membro</strong>.</li>
                    <li>Digite o e-mail e selecione a função inicial.</li>
                    <li>O usuário receberá um link de ativação válido por 48 horas.</li>
                  </ol>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <LinkIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Link de Convite</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Para onboarding em massa, você pode gerar um link temporário que permite o cadastro de qualquer pessoa com o domínio de e-mail da sua empresa (ex: @suaempresa.com.br).
                  </p>
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <p className="text-sm text-amber-300">
                      <strong>Atenção:</strong> Este link deve ser compartilhado apenas em canais internos seguros.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Status do Convite</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Você pode acompanhar quem aceitou o convite na lista de membros. Convites pendentes podem ser reenviados ou revogados a qualquer momento.
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
