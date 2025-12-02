"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Star, Users, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { login } from "@/lib/auth"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      if (login(email, password)) {
        router.push("/dashboard")
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen h-screen flex flex-col lg:flex-row overflow-hidden">
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/professional-lawyer-in-modern-office-reviewing-leg.jpg"
            alt="Background"
            fill
            className="object-cover blur-sm scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f1a]/95 via-[#0d2820]/90 to-[#0a1f1a]/95" />
        </div>

        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-400/10 rounded-full blur-[100px] animate-pulse delay-700" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-full px-4 py-2 text-sm font-medium text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              Análise Jurídica Confiável
            </div>
          </div>

          <div className="space-y-8 max-w-xl">
            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight">
              O lugar para advogados que querem <span className="text-emerald-400">revolucionar</span> sua prática
              jurídica
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed">
              Análise inteligente de contratos, identificação de riscos e gestão completa do seu portfólio jurídico em
              uma única plataforma.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 border-2 border-[#0a1f1a] flex items-center justify-center text-white font-semibold text-sm">
                  JD
                </div>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-[#0a1f1a] flex items-center justify-center text-white font-semibold text-sm">
                  MS
                </div>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-[#0a1f1a] flex items-center justify-center text-white font-semibold text-sm">
                  AB
                </div>
                <div className="w-11 h-11 rounded-full bg-emerald-500/20 backdrop-blur-sm border-2 border-[#0a1f1a] flex items-center justify-center text-emerald-400 font-bold text-sm">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                  ))}
                  <span className="ml-2 text-2xl font-bold text-emerald-400">4.9</span>
                </div>
                <p className="text-sm text-gray-400">Baseado em +256 reviews</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-emerald-400">+5.2k</div>
              <p className="text-sm text-gray-400">Contratos analisados</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-emerald-400">99.2%</div>
              <p className="text-sm text-gray-400">Taxa de precisão</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-emerald-400">24/7</div>
              <p className="text-sm text-gray-400">Suporte disponível</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-stretch lg:items-center justify-center bg-[#0f1419] overflow-y-auto">
        <div className="w-full max-w-md space-y-6 sm:space-y-8 px-6 py-8 sm:px-8 sm:py-4">
          <div className="flex justify-center">
            {/* Replaced text and icon with the new logo image */}
            <div className="relative w-48 h-16">
              <Image src="/images/clausify-logo.png" alt="Clausify Logo" fill className="object-contain" priority />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-3xl sm:text-3xl font-bold text-white">Acesse sua conta</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-base sm:text-sm font-medium text-gray-300">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-16 sm:h-14 bg-[#1a2329] border-[#2a3640] text-white text-base placeholder:text-gray-500 pl-12 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-base sm:text-sm font-medium text-gray-300">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-16 sm:h-14 bg-[#1a2329] border-[#2a3640] text-white text-base placeholder:text-gray-500 pl-12 pr-12 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-[#2a3640] data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 h-5 w-5 sm:h-4 sm:w-4"
                />
                <label htmlFor="remember" className="text-base sm:text-sm text-gray-300 cursor-pointer">
                  Lembrar-me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-base sm:text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium text-center sm:text-right"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-16 sm:h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg sm:text-base rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                "Acessando..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Acessar
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center space-y-4 pb-4">
            <p className="text-base sm:text-sm text-gray-400">
              Ainda não faz parte da Comunidade?{" "}
              <Link
                href="/register"
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                Aplique agora!
              </Link>
            </p>

            <p className="text-sm sm:text-xs text-gray-500 max-w-sm mx-auto px-4">
              Todos os seus dados estão seguros e jamais serão compartilhados.{" "}
              <Link href="/privacy" className="text-gray-400 hover:text-gray-300 underline">
                Termos de Uso e Políticas de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
