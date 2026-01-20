import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, Key, Fingerprint, Globe } from "lucide-react"
import Link from "next/link"

export default function SSOSAMLPage() {
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

          <h1 className="text-4xl font-bold mb-6">SSO e SAML</h1>
          <p className="text-xl text-gray-400 mb-12">
            Centralize a autenticação da sua empresa integrando a Clausify ao seu provedor de identidade.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Key className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">O que é SSO?</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Single Sign-On (SSO) permite que seus colaboradores acessem a Clausify usando as mesmas credenciais corporativas (Google Workspace, Microsoft Entra ID, Okta) que já utilizam.
                  </p>
                  <ul className="space-y-2 text-gray-400 ml-4">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Maior segurança (menos senhas para gerenciar)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Onboarding e offboarding automatizados
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Compliance com políticas de TI
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Provedores Suportados</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Suportamos o protocolo SAML 2.0 e OIDC, compatível com a maioria dos provedores do mercado:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-sm font-medium">Okta</div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-sm font-medium">Azure AD</div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-sm font-medium">Google</div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-sm font-medium">OneLogin</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Fingerprint className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Configuração</h2>
                  <p className="text-gray-400 leading-relaxed">
                    A configuração do SSO é exclusiva do plano Enterprise. Para ativar, entre em contato com nosso suporte técnico para receber os metadados XML e as URLs de ACS.
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
