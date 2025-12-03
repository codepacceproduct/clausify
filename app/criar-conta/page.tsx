"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Star, Users, CheckCircle2, User, Building2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CriarContaPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [empresa, setEmpresa] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("As senhas não coincidem")
      return
    }
    if (!acceptTerms) {
      alert("Você precisa aceitar os termos de uso")
      return
    }
    setIsLoading(true)

    setTimeout(() => {
      router.push("/login")
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Different image for register */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/modern-legal-team-collaboration-in-glass-office-wi.jpg"
            alt="Background"
            fill
            className="object-cover blur-sm scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f1a]/95 via-[#0d2820]/90 to-[#0a1f1a]/95" />
        </div>

        <div className="absolute top-20 left-20 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-400/15 rounded-full blur-[100px] animate-pulse delay-700" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-full px-4 py-2 text-sm font-medium text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              Análise Jurídica Confiável
            </div>
          </div>

          <div className="space-y-8 max-w-xl">
            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight">
              Comece sua jornada de <span className="text-emerald-400">transformação</span> jurídica
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed">
              Junte-se a milhares de advogados que já estão revolucionando a forma de analisar contratos com
              inteligência artificial.
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

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-stretch lg:items-center justify-center bg-[#0f1419] overflow-y-auto">
        <div className="w-full max-w-md space-y-5 px-6 py-8 sm:px-8 sm:py-4">
          <div className="flex justify-center">
            <div className="relative w-48 h-16">
              <Image src="/images/clausify-logo.png" alt="Clausify Logo" fill className="object-contain" priority />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-3xl sm:text-3xl font-bold text-white">Criar sua conta</h2>
            <p className="text-gray-400 text-sm">Preencha os dados abaixo para começar</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-base sm:text-sm font-medium text-gray-300">Nome completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="h-14 sm:h-12 bg-[#1a2329] border-[#2a3640] text-white text-base placeholder:text-gray-500 pl-12 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-base sm:text-sm font-medium text-gray-300">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 sm:h-12 bg-[#1a2329] border-[#2a3640] text-white text-base placeholder:text-gray-500 pl-12 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-base sm:text-sm font-medium text-gray-300">Empresa / Escritório (opcional)</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Nome do escritório ou empresa"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className="h-14 sm:h-12 bg-[#1a2329] border-[#2a3640] text-white text-base placeholder:text-gray-500 pl-12 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-base sm:text-sm font-medium text-gray-300">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Crie uma senha forte"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 sm:h-12 bg-[#1a2329] border-[#2a3640] text-white text-base placeholder:text-gray-500 pl-12 pr-12 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
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

            <div className="space-y-2">
              <label className="text-base sm:text-sm font-medium text-gray-300">Confirmar senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-14 sm:h-12 bg-[#1a2329] border-[#2a3640] text-white text-base placeholder:text-gray-500 pl-12 pr-12 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-2"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                className="border-[#2a3640] data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 h-5 w-5 sm:h-4 sm:w-4 mt-0.5"
              />
              <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer leading-tight">
                Li e aceito os{" "}
                <Link href="/termos" className="text-emerald-400 hover:text-emerald-300">
                  Termos de Uso
                </Link>{" "}
                e{" "}
                <Link href="/privacidade" className="text-emerald-400 hover:text-emerald-300">
                  Política de Privacidade
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-14 sm:h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg sm:text-base rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                "Criando conta..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Criar minha conta
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center space-y-4 pb-4">
            <p className="text-base sm:text-sm text-gray-400">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
