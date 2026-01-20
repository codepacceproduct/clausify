import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, ShieldCheck, Users, Lock } from "lucide-react"
import Link from "next/link"

export default function RolesPermissoesPage() {
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

          <h1 className="text-4xl font-bold mb-6">Roles e Permissões</h1>
          <p className="text-xl text-gray-400 mb-12">
            Entenda a hierarquia de acesso e garanta que cada membro tenha as permissões adequadas.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Funções Padrão</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    A Clausify oferece 4 níveis de acesso pré-configurados:
                  </p>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-1">Administrador</h4>
                      <p className="text-sm text-gray-400">Acesso total. Pode gerenciar faturamento, configurações da empresa e outros administradores.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-1">Editor</h4>
                      <p className="text-sm text-gray-400">Pode criar, editar e aprovar documentos. Não acessa configurações financeiras.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-1">Visualizador</h4>
                      <p className="text-sm text-gray-400">Apenas leitura. Pode ver documentos e relatórios, mas não pode fazer alterações.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Grupos de Acesso</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Para grandes equipes, crie grupos (ex: "Jurídico Trabalhista", "Compras") e atribua permissões ao grupo em vez de individualmente.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Permissões Granulares</h2>
                  <p className="text-gray-400 leading-relaxed">
                    No plano Enterprise, é possível criar roles customizadas, definindo permissões específicas para cada ação (ex: "Pode ver contratos, mas não valores financeiros").
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
