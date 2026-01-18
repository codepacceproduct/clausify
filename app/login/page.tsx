"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Star, Users, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    try {
      if (typeof window === "undefined") return
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true")
        const v = emailRef.current?.value || ""
        if (v) localStorage.setItem("rememberEmail", v)
      } else {
        localStorage.setItem("rememberMe", "false")
      }
    } catch {}
  }, [rememberMe])

  useEffect(() => {
    try {
      if (typeof window === "undefined") return

      const prefillEmail = sessionStorage.getItem("signup_prefill_email")
      const prefillPassword = sessionStorage.getItem("signup_prefill_password")

      if (prefillEmail) {
        if (emailRef.current) emailRef.current.value = prefillEmail
        sessionStorage.removeItem("signup_prefill_email")
      } else {
        const remembered = localStorage.getItem("rememberMe") === "true"
        const saved = remembered ? localStorage.getItem("rememberEmail") || "" : ""
        if (emailRef.current) emailRef.current.value = saved
        setRememberMe(remembered)
      }

      if (prefillPassword) {
        setPassword(prefillPassword)
        sessionStorage.removeItem("signup_prefill_password")
      }
    } catch {}
  }, [])

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      // Use getUser to validate the session with the server
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      
      if (user && !error) {
        router.push("/dashboard")
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const email = emailRef.current?.value || ""

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      if (authError.message.includes("Invalid login credentials")) {
        setError("E-mail ou senha incorretos")
      } else if (authError.message.includes("Email not confirmed")) {
        setError("Confirme seu e-mail antes de fazer login")
      } else {
        setError(authError.message)
      }
      setIsLoading(false)
      return
    }

    if (data.session) {
      try {
        const meta = data.user?.user_metadata || {}
        const orgName = (meta.organization || "").trim()
        const firstName = (meta.name || "").trim() || email
        const surnameMeta = (meta.surname || "").trim()
        const token = data.session.access_token

        if (token && orgName) {
          const headers: any = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
          try {
            const resProfile = await fetch("/api/settings/profile", { headers })
            const profileJson = await resProfile.json().catch(() => ({}))
            const currentOrgId = profileJson?.profile?.organization_id || null

            if (!currentOrgId) {
              const body: any = {
                name: firstName,
                surname: surnameMeta,
                organization: {
                  name: orgName,
                  industry: null,
                  size: null,
                  timezone: "america-saopaolo",
                  locale: "pt-br",
                },
              }

              await fetch("/api/settings/profile", {
                method: "POST",
                headers,
                body: JSON.stringify(body),
              })
            }
          } catch {}
        }

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true")
          localStorage.setItem("rememberEmail", email)
        }
        localStorage.setItem("user_email", email)
        localStorage.setItem("user_name", data.user?.user_metadata?.full_name || email)
      } catch {}
      router.push("/dashboard")
    }

    setIsLoading(false)
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0f1419] flex">
      <div className="w-full max-w-6xl mx-auto h-full px-4 lg:px-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-[45%] h-full flex items-center">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-medium text-emerald-400">Login</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug max-w-md">
                Acesse sua conta
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 max-w-sm">
                Tecnologia feita para quem leva
                <br />
                o direito a sério.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-base sm:text-sm font-medium text-gray-300">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    ref={emailRef}
                    type="email"
                    placeholder="Digite seu e-mail"
                    className="h-14 sm:h-12 bg-[#1a2329] border-[#2a3640] text-white text-base placeholder:text-gray-500 pl-12 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
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
                  href="/esqueci-senha"
                  className="text-base sm:text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium text-center sm:text-right"
                >
                  Esqueceu sua senha?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-14 sm:h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg sm:text-base rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
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

            <div className="space-y-3 pt-2">
              <p className="text-base sm:text-sm text-gray-400">
                Não tem uma conta?{" "}
                <Link
                  href="/criar-conta"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  Criar conta agora
                </Link>
              </p>

              <p className="text-sm sm:text-xs text-gray-500 max-w-sm">
                Todos os seus dados estão seguros e jamais serão compartilhados.{" "}
                <Link href="/privacidade" className="text-gray-400 hover:text-gray-300 underline">
                  Termos de Uso e Políticas de Privacidade
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex w-full lg:w-[55%] h-full items-center justify-center">
          <div className="relative h-[80%] max-h-[80%] aspect-[4/5] rounded-3xl overflow-hidden shadow-lg shadow-emerald-500/10">
            <Image
              src="/professional-lawyer-in-modern-office-reviewing-leg.jpg"
              alt="Profissional jurídico utilizando a plataforma"
              fill
              className="object-cover"
              priority
            />

            <div className="absolute top-6 left-6 bg-[#0f1419]/80 rounded-2xl px-4 py-3 shadow-lg">
              <div className="flex flex-col gap-2 items-start">
                <div className="relative h-6 w-24 -ml-3">
                  <Image src="/images/clausify-logo.png" alt="Clausify Logo" fill className="object-contain" />
                </div>
                <p className="text-xs leading-snug text-white max-w-[12rem]">
                  Decisões jurídicas.
                  <br />
                  Mais rápidas.
                  <br />
                  Mais inteligentes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
