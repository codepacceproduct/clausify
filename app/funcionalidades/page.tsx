import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import {
  FileSearch,
  Shield,
  GitCompare,
  Calendar,
  CheckCircle,
  Zap,
  FileText,
  Users,
  Bell,
  Lock,
  BarChart3,
  Workflow,
} from "lucide-react"

const features = [
  {
    icon: FileSearch,
    title: "Análise de Contratos com IA",
    description:
      "Nossa inteligência artificial analisa cada cláusula do seu contrato, identificando riscos, oportunidades e pontos de atenção em segundos.",
    benefits: ["Análise em menos de 3 minutos", "Identificação automática de cláusulas", "Sugestões de melhorias"],
  },
  {
    icon: Shield,
    title: "Análise de Riscos",
    description:
      "Classifique automaticamente os riscos de cada contrato em alto, médio ou baixo, com explicações detalhadas de cada ponto crítico.",
    benefits: ["Score de risco automático", "Alertas em tempo real", "Histórico de riscos"],
  },
  {
    icon: GitCompare,
    title: "Versionamento de Contratos",
    description:
      "Compare diferentes versões do mesmo contrato, visualize alterações com diff visual e mantenha histórico completo de mudanças.",
    benefits: ["Diff visual lado a lado", "Timeline de alterações", "Restauração de versões"],
  },
  {
    icon: Calendar,
    title: "Calendário de Obrigações",
    description:
      "Nunca perca um prazo importante. Sincronize vencimentos, renovações e obrigações com Google Calendar e Outlook.",
    benefits: ["Lembretes automáticos", "Integração com calendários", "Visão mensal e semanal"],
  },
  {
    icon: Workflow,
    title: "Workflow de Aprovação",
    description:
      "Configure fluxos de aprovação multinível com analistas, gestores e diretores. Acompanhe cada etapa em tempo real.",
    benefits: ["Múltiplos níveis", "Comentários e feedback", "Escalação automática"],
  },
  {
    icon: FileText,
    title: "Playbook Jurídico",
    description:
      "Crie e gerencie seus modelos de cláusulas padrão. Compare contratos recebidos com seu playbook automaticamente.",
    benefits: ["Biblioteca de cláusulas", "Comparação automática", "Cláusulas fallback"],
  },
  {
    icon: Users,
    title: "Gestão de Portfólio",
    description:
      "Visualize todos os seus contratos em um único lugar. Filtre por cliente, tipo, valor ou status de risco.",
    benefits: ["Visão consolidada", "Filtros avançados", "Exportação de dados"],
  },
  {
    icon: Bell,
    title: "Notificações Inteligentes",
    description:
      "Receba alertas personalizados sobre contratos que precisam de atenção, prazos próximos e mudanças importantes.",
    benefits: ["Email e push", "Configuração por tipo", "Resumo diário/semanal"],
  },
  {
    icon: Lock,
    title: "Segurança Avançada",
    description:
      "Seus contratos protegidos com criptografia de ponta a ponta, controle de acesso granular e logs de auditoria.",
    benefits: ["Criptografia AES-256", "2FA obrigatório", "Logs completos"],
  },
  {
    icon: BarChart3,
    title: "Relatórios e Analytics",
    description:
      "Dashboards interativos com métricas importantes: tempo de análise, tipos de risco, economia gerada e muito mais.",
    benefits: ["Gráficos interativos", "Export PDF/Excel", "Métricas personalizadas"],
  },
  {
    icon: Zap,
    title: "Integrações",
    description:
      "Conecte a Clausify com suas ferramentas favoritas: Google Drive, Dropbox, OneDrive, Slack e sistemas de gestão.",
    benefits: ["API REST completa", "Webhooks", "+20 integrações"],
  },
  {
    icon: CheckCircle,
    title: "Conformidade Legal",
    description: "Verificação automática de conformidade com LGPD, Marco Civil e outras regulamentações brasileiras.",
    benefits: ["Checklist automático", "Relatório de conformidade", "Atualizações legais"],
  },
]

export default function FuncionalidadesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              Funcionalidades
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Tudo que você precisa para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                gerenciar contratos
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto text-balance">
              Conheça todas as funcionalidades que fazem da Clausify a plataforma mais completa para análise e gestão de
              contratos jurídicos.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
