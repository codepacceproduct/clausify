import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, UserPlus, Mail, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function CriarContaPage() {
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

          <h1 className="text-4xl font-bold mb-6">Criar sua conta</h1>
          <p className="text-xl text-gray-400 mb-12">
            O primeiro passo para revolucionar sua gestão jurídica é criar sua conta na Clausify.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <span className="text-emerald-400 font-bold">1</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Acesse a página de registro</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Clique no botão "Começar Gratuitamente" na página inicial ou acesse diretamente <Link href="/login" className="text-emerald-400 hover:underline">nossa página de login</Link>. 
                    Se você ainda não tem uma conta, selecione a opção de registro.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <span className="text-emerald-400 font-bold">2</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Preencha seus dados</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Você precisará fornecer algumas informações básicas para configurar seu perfil:
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    <li className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <Mail className="w-5 h-5 text-emerald-400" />
                      <span>E-mail profissional</span>
                    </li>
                    <li className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <UserPlus className="w-5 h-5 text-emerald-400" />
                      <span>Nome completo</span>
                    </li>
                    <li className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>Senha segura</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <span className="text-emerald-400 font-bold">3</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Verifique seu e-mail</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Para garantir a segurança da sua conta, enviaremos um link de confirmação para o e-mail cadastrado. 
                    Clique no link para ativar sua conta e acessar o dashboard.
                  </p>
                  <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200 text-sm">
                    Nota: Verifique sua pasta de spam caso não receba o e-mail em alguns minutos.
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
