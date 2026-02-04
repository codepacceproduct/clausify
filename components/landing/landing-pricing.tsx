"use client"

import { useState } from "react"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    description: "Perfeito para advogados autônomos",
    priceMonthly: 99,
    priceYearly: 84,
    features: [
      "50 análises por mês",
      "Detecção de riscos básica",
      "Histórico de 30 dias",
      "Suporte por email",
      "1 usuário",
    ],
    cta: "Começar Grátis",
    popular: false,
  },
  {
    name: "Professional",
    description: "Para escritórios em crescimento",
    priceMonthly: 299,
    priceYearly: 254,
    features: [
      "200 análises por mês",
      "Detecção de riscos avançada",
      "Versionamento de contratos",
      "Workflow de aprovação",
      "Integração com calendário",
      "Playbook customizado",
      "Suporte prioritário",
      "5 usuários",
    ],
    cta: "Começar Agora",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Para grandes departamentos jurídicos",
    priceMonthly: null,
    priceYearly: null,
    features: [
      "Análises ilimitadas",
      "Todas as funcionalidades",
      "API de integração",
      "SSO / SAML",
      "SLA garantido",
      "Gerente de sucesso dedicado",
      "Treinamento personalizado",
      "Usuários ilimitados",
    ],
    cta: "Falar com Vendas",
    popular: false,
  },
]

export function LandingPricing() {
  const [isYearly, setIsYearly] = useState(true)

  return (
    <section
      id="pricing"
      className="relative py-24 sm:py-32 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-emerald-400 font-medium mb-4">Preços</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            Planos para cada necessidade
          </h2>
          <p className="text-gray-400 text-lg">Comece gratuitamente por 14 dias. Sem cartão de crédito.</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm ${!isYearly ? "text-white" : "text-gray-400"}`}>Mensal</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              isYearly ? "bg-emerald-500" : "bg-white/10"
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                isYearly ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-sm ${isYearly ? "text-white" : "text-gray-400"}`}>
            Anual
            <span className="ml-2 text-emerald-400 text-xs font-medium">-15%</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 transition-all ${
                plan.popular
                  ? "bg-gradient-to-b from-emerald-500/10 to-transparent border-2 border-emerald-500/30 scale-105"
                  : "bg-white/[0.02] border border-white/5 hover:border-white/10"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    Mais popular
                  </div>
                </div>
              )}

              {/* Plan Info */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                {plan.priceMonthly ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      R$ {isYearly ? plan.priceYearly : plan.priceMonthly}
                    </span>
                    <span className="text-gray-400">/mês</span>
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-white">Personalizado</div>
                )}
              </div>

              {/* CTA */}
              <Link href="/login" className="block mb-8">
                <Button
                  className={`w-full rounded-full h-12 ${
                    plan.popular
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
