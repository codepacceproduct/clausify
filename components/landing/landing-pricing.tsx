"use client"

import { useState } from "react"
import { Check, Sparkles, Briefcase, Scale, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const plans = [
  {
    name: "Starter",
    description: "Ideal para advogados autônomos e pequenas consultorias",
    priceMonthly: 99,
    priceYearly: 84,
    icon: Briefcase,
    features: [
      "Editor de Documentos Inteligente",
      "50 Análises com IA por mês",
      "Cálculos Jurídicos Trabalhistas/Cíveis",
      "Calendário de Prazos",
      "Biblioteca de Modelos",
      "Suporte por email",
      "1 usuário",
    ],
    cta: "Começar Teste Grátis",
    popular: false,
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "group-hover:border-blue-500/50",
    glow: "group-hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]",
  },
  {
    name: "Professional",
    description: "Para escritórios em crescimento que buscam eficiência",
    priceMonthly: 299,
    priceYearly: 254,
    icon: Scale,
    features: [
      "Tudo do plano Starter",
      "200 Análises com IA por mês",
      "Detecção de Riscos Avançada",
      "Versionamento e Comparação (Diff)",
      "Workflow de Aprovação",
      "Integração Google/Outlook",
      "Suporte Prioritário",
      "Até 5 usuários",
    ],
    cta: "Começar Agora",
    popular: true,
    gradient: "from-emerald-500/20 to-green-500/20",
    border: "border-emerald-500/50",
    glow: "shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]",
  },
  {
    name: "Enterprise",
    description: "Para grandes departamentos jurídicos e alta governança",
    priceMonthly: null,
    priceYearly: null,
    icon: Landmark,
    features: [
      "Tudo do plano Professional",
      "Análises e Usuários Ilimitados",
      "API de Integração Customizada",
      "SSO / SAML & Controle de Acesso",
      "Playbooks de Negociação",
      "Gestor de Conta Dedicado",
      "SLA Garantido",
      "Treinamento Personalizado",
    ],
    cta: "Falar com Consultor",
    popular: false,
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "group-hover:border-purple-500/50",
    glow: "group-hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]",
  },
]

export function LandingPricing() {
  const [isYearly, setIsYearly] = useState(true)

  return (
    <section
      id="pricing"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-emerald-400 font-medium mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Planos
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance tracking-tight">
              Planos desenhados para <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                cada fase do seu escritório
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Escolha a potência ideal para sua equipe. Cancele a qualquer momento.
              <br className="hidden sm:block" />
              Teste gratuitamente por 14 dias com todas as funcionalidades.
            </p>
          </motion.div>
        </div>

        {/* Billing Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-6 mb-16"
        >
          <span className={`text-base font-medium transition-colors cursor-pointer ${!isYearly ? "text-white" : "text-gray-500"}`} onClick={() => setIsYearly(false)}>Mensal</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              isYearly ? "bg-emerald-500" : "bg-white/10"
            }`}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-lg ${
                isYearly ? "translate-x-8" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-base font-medium transition-colors flex items-center gap-2 cursor-pointer ${isYearly ? "text-white" : "text-gray-500"}`} onClick={() => setIsYearly(true)}>
            Anual
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full border border-emerald-500/20"
            >
              -15% OFF
            </motion.span>
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto perspective-1000">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative flex flex-col ${plan.popular ? "z-10 md:-mt-4 md:mb-4" : "z-0"}`}
              >
                {/* Glow Effect on Hover */}
                <div className={`absolute -inset-0.5 rounded-[24px] bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg ${plan.gradient}`} />
                
                <div className={`
                  relative h-full bg-[#0a0a0a] rounded-[22px] p-8 border transition-all duration-500 flex flex-col
                  ${plan.popular 
                    ? `border-emerald-500/50 ${plan.glow}` 
                    : `border-white/10 group-hover:border-white/20 ${plan.glow}`}
                `}>
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-full flex justify-center">
                      <motion.div 
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 uppercase tracking-wide ring-4 ring-[#050505]"
                      >
                        <Sparkles className="w-3 h-3 fill-current" />
                        Mais Escolhido
                      </motion.div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${plan.gradient} border border-white/5 shadow-inner`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed min-h-[40px]">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8 p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center group-hover:bg-white/[0.05] transition-colors">
                    {plan.priceMonthly ? (
                      <div className="relative">
                        <div className="flex items-end justify-center gap-1 mb-1">
                          <span className="text-sm text-gray-400 mb-2 font-medium">R$</span>
                          <AnimatePresence mode="wait">
                            <motion.span 
                              key={isYearly ? "yearly" : "monthly"}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="text-5xl font-bold text-white tracking-tight"
                            >
                              {isYearly ? plan.priceYearly : plan.priceMonthly}
                            </motion.span>
                          </AnimatePresence>
                          <span className="text-gray-400 mb-2 font-medium">/mês</span>
                        </div>
                        {isYearly && (
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-emerald-400 font-medium"
                          >
                            Faturado R$ {plan.priceYearly! * 12} anualmente
                          </motion.p>
                        )}
                      </div>
                    ) : (
                      <div className="h-[76px] flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">Sob Consulta</span>
                        <span className="text-sm text-gray-400 mt-1">Para grandes volumes</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex-grow mb-8">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                      O que está incluso
                    </p>
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 group/item">
                          <div className={`
                            mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
                            ${plan.popular ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-gray-400 group-hover/item:bg-emerald-500/20 group-hover/item:text-emerald-400"}
                          `}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-gray-300 text-sm leading-tight group-hover/item:text-white transition-colors font-medium">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <Link href="/login" className="mt-auto block w-full">
                    <Button
                      className={`w-full rounded-xl h-14 text-base font-bold transition-all duration-300 ${
                        plan.popular
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                          : "bg-white text-black hover:bg-gray-200"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
