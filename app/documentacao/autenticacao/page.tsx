import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, Lock, KeyRound, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function AutenticacaoPage() {
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

          <h1 className="text-4xl font-bold mb-6">Autenticação da API</h1>
          <p className="text-xl text-gray-400 mb-12">
            Aprenda a autenticar suas requisições para interagir programaticamente com a Clausify.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">API Keys</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    A autenticação é feita através de Bearer Tokens. Você deve gerar uma chave de API no painel de desenvolvedor.
                  </p>
                  <div className="bg-[#111] p-4 rounded-xl border border-white/10 font-mono text-sm text-gray-300 overflow-x-auto">
                    Authorization: Bearer sk_live_1234567890abcdef
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Segurança</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Nunca exponha sua chave secreta (`sk_live_...`) no lado do cliente (frontend). As chaves devem ser armazenadas em variáveis de ambiente no seu servidor.
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    Recomendamos rotacionar suas chaves periodicamente através do painel de configurações da API.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Escopos</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Ao criar uma chave, você pode limitar seu acesso a escopos específicos para aumentar a segurança:
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-3 text-sm text-gray-400">
                    <li className="flex items-center gap-2">
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-emerald-400">contracts:read</code>
                      Leitura de contratos
                    </li>
                    <li className="flex items-center gap-2">
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-emerald-400">contracts:write</code>
                      Upload de contratos
                    </li>
                    <li className="flex items-center gap-2">
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-emerald-400">analysis:read</code>
                      Ver análises
                    </li>
                    <li className="flex items-center gap-2">
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-emerald-400">webhooks:manage</code>
                      Gerenciar webhooks
                    </li>
                  </ul>
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
