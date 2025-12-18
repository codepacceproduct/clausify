"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, AlertCircle, CheckCircle2 } from "lucide-react"
import Image from "next/image"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw new Error("E-mail ou senha incorretos")
      }

      if (!data.user) {
        throw new Error("Erro ao autenticar")
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profileError || profile?.role !== "admin") {
        await supabase.auth.signOut()
        throw new Error("Acesso não autorizado. Apenas administradores podem acessar esta área.")
      }

      router.push("/admin")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
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
              <Shield className="w-4 h-4" />
              Painel de Administração
            </div>
          </div>

          <div className="space-y-8 max-w-xl">
            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight">
              Gerencie sua plataforma com <span className="text-emerald-400">controle total</span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed">
              Dashboard administrativo para gerenciar leads, lista de espera e acompanhar o crescimento da sua
              plataforma em tempo real.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 border-2 border-[#0a1f1a] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-[#0a1f1a] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-2xl font-bold text-emerald-400">Admin Access</div>
                <p className="text-sm text-gray-400">Acesso seguro e protegido</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-emerald-400">100%</div>
              <p className="text-sm text-gray-400">Controle total</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-emerald-400">Real-time</div>
              <p className="text-sm text-gray-400">Dados em tempo real</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-emerald-400">Seguro</div>
              <p className="text-sm text-gray-400">Autenticação protegida</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-stretch lg:items-center justify-center bg-[#0f1419] overflow-y-auto">
        <div className="w-full max-w-md space-y-6 sm:space-y-8 px-6 py-8 sm:px-8 sm:py-4">
          <div className="flex justify-center">
            <div className="relative w-48 h-16">
              <Image src="/images/clausify-logo.png" alt="Clausify Logo" fill className="object-contain" priority />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-3xl sm:text-3xl font-bold text-white">Admin Dashboard</h2>
            <p className="text-gray-400">Acesso restrito para administradores</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-base sm:text-sm font-medium text-gray-300">E-mail de Administrador</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="email"
                  placeholder="Digite seu e-mail de admin"
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

            <Button
              type="submit"
              className="w-full h-16 sm:h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg sm:text-base rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                "Acessando..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Acessar Admin
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center space-y-4 pb-4">
            <p className="text-sm sm:text-xs text-gray-500 max-w-sm mx-auto px-4">
              Acesso exclusivo para administradores autorizados da plataforma Clausify.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
