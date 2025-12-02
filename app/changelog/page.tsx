import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Sparkles, Bug, Zap } from "lucide-react"

const changelog = [
  {
    version: "2.4.0",
    date: "28 de Novembro, 2024",
    changes: [
      {
        type: "feature",
        title: "Workflow de Aprovação",
        description: "Sistema completo de aprovação multinível com comentários e histórico.",
      },
      {
        type: "feature",
        title: "Calendário de Obrigações",
        description: "Nova página de calendário com integração Google Calendar e Outlook.",
      },
      {
        type: "feature",
        title: "Versionamento de Contratos",
        description: "Compare versões com diff visual e timeline de alterações.",
      },
      {
        type: "improvement",
        title: "Performance de Análise",
        description: "Redução de 40% no tempo de análise de contratos.",
      },
    ],
  },
  {
    version: "2.3.0",
    date: "15 de Novembro, 2024",
    changes: [
      {
        type: "feature",
        title: "Playbook Jurídico",
        description: "Biblioteca de cláusulas padrão com comparação automática.",
      },
      {
        type: "feature",
        title: "Análise de Conformidade LGPD",
        description: "Verificação automática de conformidade com a LGPD.",
      },
      {
        type: "improvement",
        title: "Nova Interface do Dashboard",
        description: "Design completamente reformulado para melhor usabilidade.",
      },
      {
        type: "fix",
        title: "Correção de Export PDF",
        description: "Resolvido problema de formatação em relatórios exportados.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "1 de Novembro, 2024",
    changes: [
      {
        type: "feature",
        title: "Integração com Slack",
        description: "Receba notificações de contratos diretamente no Slack.",
      },
      {
        type: "feature",
        title: "API de Webhooks",
        description: "Eventos em tempo real para integrações customizadas.",
      },
      {
        type: "improvement",
        title: "Busca Avançada",
        description: "Novos filtros de busca por cláusula, risco e data.",
      },
      { type: "fix", title: "Correção de Autenticação", description: "Melhorias na estabilidade do login." },
    ],
  },
  {
    version: "2.1.0",
    date: "15 de Outubro, 2024",
    changes: [
      { type: "feature", title: "Análise em Lote", description: "Envie múltiplos contratos para análise simultânea." },
      {
        type: "improvement",
        title: "Novo Modelo de IA",
        description: "IA atualizada com maior precisão na identificação de riscos.",
      },
      { type: "improvement", title: "Mobile Responsivo", description: "Interface otimizada para dispositivos móveis." },
    ],
  },
  {
    version: "2.0.0",
    date: "1 de Outubro, 2024",
    changes: [
      { type: "feature", title: "Clausify 2.0", description: "Nova versão com interface completamente redesenhada." },
      {
        type: "feature",
        title: "Gestão de Portfólio",
        description: "Visualize todos seus contratos em um único lugar.",
      },
      { type: "feature", title: "Relatórios Personalizados", description: "Crie e exporte relatórios customizados." },
      { type: "improvement", title: "Nova Arquitetura", description: "Infraestrutura mais rápida e confiável." },
    ],
  },
]

const typeConfig = {
  feature: { icon: Sparkles, label: "Novidade", color: "text-emerald-400 bg-emerald-500/10" },
  improvement: { icon: Zap, label: "Melhoria", color: "text-blue-400 bg-blue-500/10" },
  fix: { icon: Bug, label: "Correção", color: "text-orange-400 bg-orange-500/10" },
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              Changelog
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              O que há de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">novo</span>
            </h1>
            <p className="text-xl text-gray-400">Acompanhe todas as atualizações e melhorias da plataforma Clausify.</p>
          </div>

          {/* Timeline */}
          <div className="space-y-12">
            {changelog.map((release, index) => (
              <div key={index} className="relative pl-8 border-l border-white/10">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-emerald-500 rounded-full" />
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">v{release.version}</h2>
                  <p className="text-gray-500">{release.date}</p>
                </div>
                <div className="space-y-4">
                  {release.changes.map((change, i) => {
                    const config = typeConfig[change.type as keyof typeof typeConfig]
                    const Icon = config.icon
                    return (
                      <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="flex items-start gap-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
                            {config.label}
                          </span>
                          <div>
                            <h3 className="font-semibold mb-1">{change.title}</h3>
                            <p className="text-gray-400 text-sm">{change.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
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
