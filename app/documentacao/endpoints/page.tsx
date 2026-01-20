import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, Server, Code2, Database } from "lucide-react"
import Link from "next/link"

export default function EndpointsPage() {
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

          <h1 className="text-4xl font-bold mb-6">Endpoints da API</h1>
          <p className="text-xl text-gray-400 mb-12">
            Referência completa dos recursos disponíveis na API REST da Clausify.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Server className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Base URL</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Todas as requisições devem ser feitas para:
                  </p>
                  <div className="bg-[#111] p-4 rounded-xl border border-white/10 font-mono text-sm text-emerald-400">
                    https://api.clausify.com/v1
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Recursos Principais</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-white">Contratos</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 font-mono text-sm">
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase text-xs font-bold">GET</span>
                          <span className="text-gray-300">/contracts</span>
                          <span className="text-gray-500 text-xs ml-auto">Listar contratos</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-sm">
                          <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase text-xs font-bold">POST</span>
                          <span className="text-gray-300">/contracts</span>
                          <span className="text-gray-500 text-xs ml-auto">Criar/Upload</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-sm">
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase text-xs font-bold">GET</span>
                          <span className="text-gray-300">/contracts/:id</span>
                          <span className="text-gray-500 text-xs ml-auto">Detalhes</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-white">Análises</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 font-mono text-sm">
                          <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase text-xs font-bold">POST</span>
                          <span className="text-gray-300">/contracts/:id/analyze</span>
                          <span className="text-gray-500 text-xs ml-auto">Iniciar análise</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-sm">
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase text-xs font-bold">GET</span>
                          <span className="text-gray-300">/contracts/:id/risks</span>
                          <span className="text-gray-500 text-xs ml-auto">Ver riscos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">SDKs</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Facilite a integração usando nossas bibliotecas oficiais:
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm">Node.js</a>
                    <a href="#" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm">Python</a>
                    <a href="#" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm">Go</a>
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
