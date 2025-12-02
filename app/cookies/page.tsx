import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Cookie, Shield, BarChart3, Settings } from "lucide-react"

const cookieTypes = [
  {
    icon: Shield,
    title: "Cookies Essenciais",
    description: "Necessários para o funcionamento básico da plataforma. Não podem ser desativados.",
    examples: ["Autenticação", "Preferências de sessão", "Segurança"],
  },
  {
    icon: BarChart3,
    title: "Cookies de Análise",
    description: "Nos ajudam a entender como você usa a plataforma para melhorar sua experiência.",
    examples: ["Google Analytics", "Mixpanel", "Hotjar"],
  },
  {
    icon: Settings,
    title: "Cookies de Preferências",
    description: "Permitem que a plataforma lembre suas preferências e configurações.",
    examples: ["Tema escuro/claro", "Idioma", "Layout do dashboard"],
  },
  {
    icon: Cookie,
    title: "Cookies de Marketing",
    description: "Usados para exibir anúncios relevantes. Podem ser desativados sem afetar o uso.",
    examples: ["Google Ads", "Facebook Pixel", "LinkedIn Insight"],
  },
]

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              Cookies
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Política de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Cookies
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Entenda como usamos cookies e tecnologias semelhantes para melhorar sua experiência.
            </p>
          </div>

          {/* Cookie Types */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {cookieTypes.map((type, index) => (
              <div key={index} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <type.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{type.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {type.examples.map((example, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8 text-gray-300">
              <section className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                <h2 className="text-2xl font-bold text-white mb-4">O que são Cookies?</h2>
                <p>
                  Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita nossa
                  plataforma. Eles nos ajudam a lembrar suas preferências, entender como você usa o serviço e melhorar
                  sua experiência geral.
                </p>
              </section>

              <section className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                <h2 className="text-2xl font-bold text-white mb-4">Como Gerenciar Cookies</h2>
                <p className="mb-4">Você pode controlar cookies de várias formas:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Configurações do navegador:</strong> A maioria dos navegadores permite bloquear ou excluir
                    cookies
                  </li>
                  <li>
                    <strong>Painel de preferências:</strong> Use nosso banner de cookies para personalizar suas
                    preferências
                  </li>
                  <li>
                    <strong>Opt-out de terceiros:</strong> Visite os sites dos provedores para desativar rastreamento
                  </li>
                </ul>
              </section>

              <section className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                <h2 className="text-2xl font-bold text-white mb-4">Tempo de Retenção</h2>
                <p className="mb-4">O tempo que um cookie permanece em seu dispositivo depende do tipo:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Cookies de sessão:</strong> Expiram quando você fecha o navegador
                  </li>
                  <li>
                    <strong>Cookies persistentes:</strong> Permanecem por um período definido (geralmente 1-2 anos)
                  </li>
                  <li>
                    <strong>Cookies de autenticação:</strong> Válidos por 30 dias ou até o logout
                  </li>
                </ul>
              </section>

              <section className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <h2 className="text-2xl font-bold text-white mb-4">Atualizações desta Política</h2>
                <p>
                  Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas através
                  de um aviso em nossa plataforma ou por email. A data da última atualização está sempre indicada no
                  topo da página.
                </p>
                <p className="mt-4 text-emerald-400">Última atualização: 28 de Novembro de 2024</p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
