"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  Clock,
  FileText,
  Users,
  ArrowRight,
  Star,
  Gift,
  Bell,
  Loader2,
} from "lucide-react"

import { getWaitlistCount } from "@/app/actions/waitlist"

interface WaitlistContentProps {
  initialCount: number
}

export default function WaitlistContent({ initialCount }: WaitlistContentProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [queuePosition, setQueuePosition] = useState(0)
  const [totalSignups, setTotalSignups] = useState(initialCount)
  const [isLoadingCount, setIsLoadingCount] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)
  
  const MAX_SPOTS = 600

  // Animated counter effect
  const [countedNumbers, setCountedNumbers] = useState({
    contracts: 0,
    hours: 0,
    accuracy: 0,
  })

  useEffect(() => {
    const targets = { contracts: 5200, hours: 1200, accuracy: 99 }
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setCountedNumbers({
        contracts: Math.round(targets.contracts * progress),
        hours: Math.round(targets.hours * progress),
        accuracy: Math.round(targets.accuracy * progress),
      })
      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name || !whatsapp) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, whatsapp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao se inscrever")
      }

      setQueuePosition(data.position || totalSignups + 1)
      setTotalSignups((prev) => prev + 1)
      setIsSubmitted(true)
    } catch (error: any) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const benefits = [
    {
      icon: Gift,
      title: "3 meses grátis",
      description: "Acesso completo sem custo para os primeiros 500 inscritos",
    },
    {
      icon: Zap,
      title: "Acesso prioritário",
      description: "Seja um dos primeiros a usar a plataforma antes do lançamento oficial",
    },
    {
      icon: Star,
      title: "Preço especial vitalício",
      description: "Garanta até 50% de desconto permanente no seu plano",
    },
    {
      icon: Bell,
      title: "Atualizações exclusivas",
      description: "Receba novidades e participe do desenvolvimento do produto",
    },
  ]

  const features = [
    { icon: FileText, text: "Análise de contratos em segundos" },
    { icon: Shield, text: "Identificação automática de riscos" },
    { icon: Clock, text: "Economia de até 90% do tempo" },
    { icon: Users, text: "Workflow de aprovação integrado" },
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="relative w-36 h-10">
              <Image
                src="/images/clausify-logo.png"
                alt="Clausify"
                fill
                className="object-contain object-left"
                priority
              />
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5">
                Voltar ao site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400 font-medium">Lançamento em Janeiro 2025</span>
                </div>

                {/* Headline */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                    O futuro da{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                      análise jurídica
                    </span>{" "}
                    está chegando
                  </h1>
                  <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                    Seja um dos primeiros a revolucionar sua prática jurídica com inteligência artificial. Garanta seu
                    lugar na lista de espera e tenha acesso exclusivo.
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 pt-4" ref={counterRef}>
                  <div>
                    <div className="text-3xl font-bold text-emerald-400">
                      +{countedNumbers.contracts.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Contratos analisados em beta</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-400">+{countedNumbers.hours.toLocaleString()}h</div>
                    <div className="text-sm text-gray-500">Economizadas por mês</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-400">{countedNumbers.accuracy}%</div>
                    <div className="text-sm text-gray-500">Taxa de precisão</div>
                  </div>
                </div>

                {/* Features List */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <feature.icon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-sm text-gray-300">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Content - Form */}
              <div className="lg:pl-8">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-3xl blur-xl" />

                  <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 lg:p-10">
                    {!isSubmitted ? (
                      <>
                        {/* Form Header */}
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold mb-2">Entre na lista de espera</h2>
                          <p className="text-gray-400">
                            {isLoadingCount ? (
                              <span className="inline-block w-12 h-4 bg-gray-800 animate-pulse rounded mx-1" />
                            ) : (
                              <span className="text-emerald-400 font-semibold">{totalSignups.toLocaleString('pt-BR')}</span>
                            )}{" "}
                            pessoas já garantiram seu lugar
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Vagas preenchidas</span>
                            <span className="text-emerald-400 font-medium">
                              {isLoadingCount ? (
                                <span className="inline-block w-8 h-4 bg-gray-800 animate-pulse rounded" />
                              ) : (
                                `${Math.min(Math.round((totalSignups / MAX_SPOTS) * 100), 100)}%`
                              )}
                            </span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                              style={{ width: `${isLoadingCount ? 0 : Math.min((totalSignups / MAX_SPOTS) * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {isLoadingCount ? (
                              <span className="inline-block w-24 h-4 bg-gray-800 animate-pulse rounded" />
                            ) : (
                              `Apenas ${Math.max(MAX_SPOTS - totalSignups, 0)} vagas restantes com benefícios exclusivos`
                            )}
                          </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Nome completo *</label>
                            <Input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Seu nome"
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              E-mail profissional *
                            </label>
                            <Input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="seu@email.com"
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Empresa (Opcional)
                            </label>
                            <Input
                              type="text"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              placeholder="Nome da sua empresa"
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              WhatsApp
                            </label>
                            <Input
                              type="tel"
                              value={whatsapp}
                              onChange={(e) => setWhatsapp(e.target.value)}
                              placeholder="(11) 99999-9999"
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20"
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold bg-emerald-500 hover:bg-emerald-600 rounded-xl"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Inscrevendo...
                              </>
                            ) : (
                              <>
                                Garantir minha vaga
                                <ArrowRight className="w-5 h-5 ml-2" />
                              </>
                            )}
                          </Button>
                        </form>

                        {/* Trust badges */}
                        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/5">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Shield className="w-4 h-4" />
                            <span>Dados seguros</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Sem spam</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Inscrição confirmada!</h2>
                        <p className="text-gray-400 mb-8">
                          Você está na posição <span className="text-emerald-400 font-bold">#{queuePosition}</span> da
                          lista de espera. Entraremos em contato em breve pelo WhatsApp.
                        </p>
                        <Button
                          onClick={() => {
                            setIsSubmitted(false)
                            setName("")
                            setEmail("")
                            setCompany("")
                            setWhatsapp("")
                          }}
                          variant="outline"
                          className="bg-white text-black hover:bg-gray-100 border-transparent font-medium"
                        >
                          Cadastrar outro e-mail
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; 2024 Clausify. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
