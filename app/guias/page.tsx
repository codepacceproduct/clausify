import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { BookOpen, Clock, ChevronRight, Play } from "lucide-react"

const guides = [
  {
    category: "Primeiros Passos",
    items: [
      { title: "Configuração inicial da conta", duration: "5 min", type: "texto" },
      { title: "Seu primeiro contrato analisado", duration: "10 min", type: "video" },
      { title: "Convidando sua equipe", duration: "5 min", type: "texto" },
      { title: "Personalizando o dashboard", duration: "8 min", type: "texto" },
    ],
  },
  {
    category: "Análise de Contratos",
    items: [
      { title: "Tipos de análise disponíveis", duration: "12 min", type: "texto" },
      { title: "Interpretando scores de risco", duration: "15 min", type: "video" },
      { title: "Análise em lote", duration: "8 min", type: "texto" },
      { title: "Exportando relatórios", duration: "10 min", type: "texto" },
    ],
  },
  {
    category: "Playbook Jurídico",
    items: [
      { title: "Criando seu primeiro playbook", duration: "20 min", type: "video" },
      { title: "Adicionando cláusulas padrão", duration: "10 min", type: "texto" },
      { title: "Comparação automática", duration: "12 min", type: "texto" },
      { title: "Gerenciando cláusulas fallback", duration: "8 min", type: "texto" },
    ],
  },
  {
    category: "Workflow e Aprovações",
    items: [
      { title: "Configurando fluxos de aprovação", duration: "15 min", type: "video" },
      { title: "Níveis e permissões", duration: "10 min", type: "texto" },
      { title: "Escalação automática", duration: "8 min", type: "texto" },
      { title: "Delegação de aprovações", duration: "5 min", type: "texto" },
    ],
  },
  {
    category: "Integrações",
    items: [
      { title: "Conectando Google Calendar", duration: "8 min", type: "video" },
      { title: "Integração com Slack", duration: "10 min", type: "texto" },
      { title: "Configurando webhooks", duration: "15 min", type: "texto" },
      { title: "Usando a API REST", duration: "20 min", type: "texto" },
    ],
  },
]

export default function GuiasPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              Guias
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Aprenda no seu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">ritmo</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Tutoriais passo a passo em texto e vídeo para você dominar todas as funcionalidades da Clausify.
            </p>
          </div>

          {/* Guides */}
          <div className="space-y-12">
            {guides.map((section, index) => (
              <div key={index}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                  {section.category}
                </h2>
                <div className="space-y-3">
                  {section.items.map((item, i) => (
                    <a
                      key={i}
                      href="#"
                      className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-emerald-500/30 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        {item.type === "video" ? (
                          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                            <Play className="w-5 h-5 text-emerald-400" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {item.duration}
                            <span className="px-2 py-0.5 bg-white/5 rounded text-xs">
                              {item.type === "video" ? "Vídeo" : "Texto"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
