"use client"

import { useState } from "react"
import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Button } from "@/components/ui/button"
import { Check, HelpCircle } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    description: "Ideal para advogados autônomos e pequenos escritórios",
    priceMonthly: 197,
    priceYearly: 167,
    features: [
      "Até 50 análises/mês",
      "1 usuário",
      "Análise de risco básica",
      "Suporte por email",
      "Histórico de 30 dias",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    description: "Para escritórios e departamentos jurídicos em crescimento",
    priceMonthly: 497,
    priceYearly: 397,
    features: [
      "Até 200 análises/mês",
      "5 usuários",
      "Análise de risco avançada",
      "Workflow de aprovação",
      "Integração com calendário",
      "Versionamento de contratos",
      "Suporte prioritário",
      "Histórico ilimitado",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "Para grandes empresas com necessidades customizadas",
    priceMonthly: null,
    priceYearly: null,
    features: [
      "Análises ilimitadas",
      "Usuários ilimitados",
      "Todas as funcionalidades",
      "API dedicada",
      "SSO/SAML",
      "SLA garantido",
      "Gerente de sucesso dedicado",
      "Treinamento personalizado",
      "Customizações sob demanda",
    ],
    highlighted: false,
  },
]

const faqs = [
  {
    question: "Posso testar antes de assinar?",
    answer: "Sim! Oferecemos 14 dias de teste grátis em todos os planos, sem necessidade de cartão de crédito.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim, você pode cancelar sua assinatura a qualquer momento. Não há multas ou taxas de cancelamento.",
  },
  {
    question: "Como funciona o limite de análises?",
    answer:
      "Cada documento enviado para análise conta como uma análise. Você pode analisar contratos de qualquer tamanho.",
  },
  {
    question: "Posso fazer upgrade ou downgrade do plano?",
    answer:
      "Sim, você pode alterar seu plano a qualquer momento. As mudanças entram em vigor no próximo ciclo de cobrança.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos cartão de crédito, boleto bancário e PIX. Para planos Enterprise, também oferecemos faturamento.",
  },
  {
    question: "Os dados dos meus contratos estão seguros?",
    answer: "Sim! Utilizamos criptografia AES-256, servidores no Brasil e estamos em conformidade com a LGPD.",
  },
]

export default function PrecosPage() {
  const [isYearly, setIsYearly] = useState(true)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              Preços
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Planos que cabem no seu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                orçamento
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
              Escolha o plano ideal para suas necessidades. Todos incluem 14 dias de teste grátis.
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm ${!isYearly ? "text-white" : "text-gray-500"}`}>Mensal</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  isYearly ? "bg-emerald-500" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    isYearly ? "translate-x-8" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-sm ${isYearly ? "text-white" : "text-gray-500"}`}>
                Anual <span className="text-emerald-400">(economize 20%)</span>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border ${
                  plan.highlighted ? "bg-emerald-500/5 border-emerald-500/30" : "bg-white/[0.02] border-white/5"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                <div className="mb-8">
                  {plan.priceMonthly ? (
                    <>
                      <span className="text-5xl font-bold">R${isYearly ? plan.priceYearly : plan.priceMonthly}</span>
                      <span className="text-gray-500">/mês</span>
                      {isYearly && <p className="text-sm text-gray-500 mt-1">cobrado anualmente</p>}
                    </>
                  ) : (
                    <span className="text-3xl font-bold">Personalizado</span>
                  )}
                </div>
                <Link href="/login">
                  <Button
                    className={`w-full mb-8 ${
                      plan.highlighted ? "bg-emerald-500 hover:bg-emerald-600" : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    {plan.priceMonthly ? "Começar Teste Grátis" : "Falar com Vendas"}
                  </Button>
                </Link>
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQs */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-gray-400 text-sm">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
