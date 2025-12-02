"use client"

import { useState } from "react"
import { FileSearch, ShieldAlert, GitCompare, Calendar, Users, BookOpen, ArrowRight, CheckCircle } from "lucide-react"

const features = [
  {
    icon: FileSearch,
    title: "Análise Inteligente",
    description:
      "IA avançada que analisa cada cláusula do seu contrato, identificando termos importantes, obrigações e potenciais problemas.",
    benefits: ["Extração automática de dados", "Classificação de cláusulas", "Resumo executivo"],
    color: "emerald",
  },
  {
    icon: ShieldAlert,
    title: "Detecção de Riscos",
    description:
      "Identifique cláusulas problemáticas, termos desfavoráveis e riscos jurídicos antes que se tornem problemas reais.",
    benefits: ["Alertas em tempo real", "Níveis de severidade", "Sugestões de melhoria"],
    color: "red",
  },
  {
    icon: GitCompare,
    title: "Versionamento",
    description: "Compare diferentes versões de contratos com visualização clara das alterações, adições e remoções.",
    benefits: ["Diff visual intuitivo", "Histórico completo", "Rastreamento de mudanças"],
    color: "blue",
  },
  {
    icon: Calendar,
    title: "Calendário Jurídico",
    description: "Nunca mais perca um prazo. Gerencie vencimentos, renovações e obrigações contratuais em um só lugar.",
    benefits: ["Lembretes automáticos", "Integração com calendários", "Visão consolidada"],
    color: "amber",
  },
  {
    icon: Users,
    title: "Workflow de Aprovação",
    description:
      "Fluxos de aprovação multinível com rastreamento completo. Analistas, gestores e diretores em sintonia.",
    benefits: ["Aprovações em cadeia", "Comentários e feedback", "Auditoria completa"],
    color: "purple",
  },
  {
    icon: BookOpen,
    title: "Playbook",
    description:
      "Biblioteca de modelos, cláusulas padrão e fallbacks aprovados pela sua empresa para negociações mais rápidas.",
    benefits: ["Templates personalizados", "Cláusulas alternativas", "Padrões de mercado"],
    color: "cyan",
  },
]

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
}

export function LandingFeatures() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <p className="text-emerald-400 font-medium mb-4">Funcionalidades</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            Tudo que você precisa para gerenciar contratos
          </h2>
          <p className="text-gray-400 text-lg">
            Uma plataforma completa que combina inteligência artificial com as melhores práticas jurídicas.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const colors = colorMap[feature.color]
            const isHovered = hoveredIndex === index

            return (
              <div
                key={index}
                className={`group relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10 ${
                  isHovered ? "scale-[1.02]" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-6`}
                >
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>

                {/* Benefits */}
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className={`w-4 h-4 ${colors.text}`} />
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* Hover Arrow */}
                <div
                  className={`absolute bottom-6 right-6 transition-all duration-300 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
                >
                  <ArrowRight className={`w-5 h-5 ${colors.text}`} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
