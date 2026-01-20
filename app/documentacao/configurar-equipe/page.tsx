import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, Users, Shield, Settings } from "lucide-react"
import Link from "next/link"

export default function ConfigurarEquipePage() {
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

          <h1 className="text-4xl font-bold mb-6">Configurar equipe</h1>
          <p className="text-xl text-gray-400 mb-12">
            Gerencie o acesso e colaboração da sua equipe jurídica na plataforma.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Convidar membros</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Para adicionar novos membros à sua organização:
                  </p>
                  <ol className="list-decimal list-inside text-gray-400 space-y-2 ml-4">
                    <li>Acesse <strong>Configurações</strong> no menu lateral.</li>
                    <li>Selecione a aba <strong>Equipe</strong>.</li>
                    <li>Clique no botão <strong>Convidar Membro</strong>.</li>
                    <li>Insira o e-mail do colaborador e selecione a função inicial.</li>
                  </ol>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Papéis e Permissões</h2>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    A Clausify oferece diferentes níveis de acesso para garantir a segurança dos dados:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">Administrador</h4>
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Acesso Total</span>
                      </div>
                      <p className="text-sm text-gray-400">Pode gerenciar faturamento, configurações da organização, convidar/remover membros e visualizar todos os contratos.</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">Editor</h4>
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Edição</span>
                      </div>
                      <p className="text-sm text-gray-400">Pode criar, editar e analisar contratos. Acesso limitado às configurações globais.</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">Visualizador</h4>
                        <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">Leitura</span>
                      </div>
                      <p className="text-sm text-gray-400">Pode apenas visualizar contratos e relatórios, sem permissão de edição ou upload.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Gerenciamento</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Você pode alterar permissões ou remover membros a qualquer momento através do painel de equipe. 
                    Membros removidos perdem acesso imediato a todos os documentos da organização.
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
