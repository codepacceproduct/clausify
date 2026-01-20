"use client"

import { useState } from "react"
import { FileSearch, ShieldAlert, GitCompare, Calendar, Users, BookOpen, ArrowRight, CheckCircle, Calculator, PenTool } from "lucide-react"

const features = [
  {
    icon: PenTool,
    title: "Criação de Contratos",
    description: "Crie documentos do zero ou utilize modelos inteligentes. Editor completo com sugestões de cláusulas em tempo real.",
    benefits: ["Editor rico integrado", "Biblioteca de modelos", "Sugestões via IA"],
    color: "emerald",
  },
  {
    icon: FileSearch,
    title: "Análise com IA",
    description:
      "Nossa IA analisa cada cláusula, identificando riscos e termos importantes em segundos. Segurança e precisão na revisão.",
    benefits: ["Extração de dados", "Classificação de riscos", "Resumo executivo"],
    color: "blue",
  },
  {
    icon: Calculator,
    title: "Cálculos Jurídicos",
    description: "Ferramentas precisas para cálculos trabalhistas, cíveis e previdenciários. Atualização automática de índices.",
    benefits: ["Correção monetária", "Cálculo de prazos", "Juros compostos"],
    color: "amber",
  },
  {
    icon: GitCompare,
    title: "Versionamento",
    description: "Controle total sobre as versões dos seus documentos. Compare alterações e restaure históricos com um clique.",
    benefits: ["Diff visual intuitivo", "Histórico completo", "Rastreamento de mudanças"],
    color: "purple",
  },
  {
    icon: Calendar,
    title: "Calendário Inteligente",
    description: "Gestão automatizada de prazos processuais e contratuais. Nunca mais perca uma data importante.",
    benefits: ["Integração com Google/Outlook", "Lembretes automáticos", "Visão de equipe"],
    color: "cyan",
  },
  {
    icon: Users,
    title: "Workflow & Playbook",
    description:
      "Padronize processos com playbooks de negociação e fluxos de aprovação multinível para sua equipe.",
    benefits: ["Aprovações em cadeia", "Cláusulas padrão", "Governança corporativa"],
    color: "red",
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
