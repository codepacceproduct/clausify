"use client"

import { CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const benefits = [
  {
    title: "Para Advogados",
    description:
      "Reduza horas de trabalho manual para minutos. Foque no que realmente importa: estratégia e relacionamento com clientes.",
    items: [
      "Análise 85% mais rápida",
      "Identificação automática de riscos",
      "Relatórios prontos para clientes",
      "Histórico completo de análises",
    ],
    image: "/lawyer-working-on-laptop-with-legal-documents-mode.jpg",
  },
  {
    title: "Para Empresas",
    description:
      "Tenha controle total do seu portfólio de contratos. Nunca mais perca um prazo ou deixe passar uma cláusula problemática.",
    items: [
      "Gestão centralizada de contratos",
      "Workflows de aprovação customizados",
      "Alertas de vencimento automáticos",
      "Compliance e auditoria facilitados",
    ],
    image: "/corporate-team-reviewing-contracts-on-large-screen.jpg",
  },
]

export function LandingBenefits() {
  return (
    <section
      id="benefits"
      className="relative py-24 sm:py-32 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <p className="text-emerald-400 font-medium mb-4">Benefícios</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            Feito para quem leva o direito a sério
          </h2>
          <p className="text-gray-400 text-lg">
            Seja você um advogado independente ou parte de uma grande empresa, a Clausify se adapta às suas
            necessidades.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="space-y-20">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-20`}
            >
              {/* Image */}
              <div className="flex-1 w-full">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                  <Image
                    src={benefit.image || "/placeholder.svg"}
                    alt={benefit.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 to-transparent" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">{benefit.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed">{benefit.description}</p>

                <ul className="space-y-4">
                  {benefit.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/login">
                  <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-6 mt-4">
                    Saiba mais
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
