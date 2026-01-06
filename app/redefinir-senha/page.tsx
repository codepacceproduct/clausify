"use client"

import type React from "react"

import { Suspense, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, ArrowRight, Star, Users, CheckCircle2, Eye, EyeOff, AlertCircle, KeyRound } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function RedefinirSenhaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0f1419]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}

function ResetPasswordContent() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)

  // Check if user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // User should have a session from the recovery link
      if (session) {
        setIsValidSession(true)
      } else {
        setIsValidSession(false)
      }
    }
    checkSession()

    // Listen for auth state changes (when user clicks recovery link)
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsValidSession(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    setIsLoading(true)

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    })

    if (updateError) {
      setError(updateError.message)
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)

    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side */}
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
              Crie uma nova senha <span className="text-emerald-400">segura</span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed">
              Escolha uma senha forte para proteger sua conta. Recomendamos usar letras maiúsculas, minúsculas, números
              e símbolos.
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

      {/* Right Side - Reset Password Form */}
      <div className="flex-1 flex items-stretch lg:items-center justify-center bg-[#0f1419] overflow-y-auto">
        <div className="w-full max-w-md space-y-6 sm:space-y-8 px-6 py-8 sm:px-8 sm:py-4">
          <div className="flex justify-center">
            <div className="relative w-48 h-16">
              <Image src="/images/clausify-logo.png" alt="Clausify Logo" fill className="object-contain" priority />
            </div>
          </div>

          {isValidSession === null ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : isValidSession === false ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white">Link inválido ou expirado</h2>
              <p className="text-gray-400 max-w-sm mx-auto">
                O link de recuperação de senha é inválido ou já expirou. Solicite um novo link para redefinir sua senha.
              </p>
              <Link href="/esqueci-senha">
                <Button className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl">
                  Solicitar novo link
                </Button>
              </Link>
            </div>
          ) : success ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white">Senha redefinida!</h2>
              <p className="text-gray-400 max-w-sm mx-auto">
                Sua senha foi alterada com sucesso. Você será redirecionado para o dashboard em instantes...
              </p>
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="space-y-2 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <KeyRound className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
                <h2 className="text-3xl sm:text-3xl font-bold text-white">Redefinir senha</h2>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">Digite sua nova senha abaixo.</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-base sm:text-sm font-medium text-gray-300">Nova senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua nova senha"
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

                <div className="space-y-2">
                  <label className="text-base sm:text-sm font-medium text-gray-300">Confirmar nova senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-16 sm:h-14 bg-[#1a2329] border-[#2a3640] text-white text-base placeholder:text-gray-500 pl-12 pr-12 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
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

                <Button
                  type="submit"
                  className="w-full h-16 sm:h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg sm:text-base rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Redefinindo..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Redefinir senha
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>
            </>
          )}

          <div className="text-center space-y-4 pb-4">
            <p className="text-sm sm:text-xs text-gray-500 max-w-sm mx-auto px-4">
              Lembrou sua senha?{" "}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
