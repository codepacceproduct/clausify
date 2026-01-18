"use client"

import type React from "react"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Star, Users, CheckCircle2, User, Building2, AlertCircle, XCircle, Smartphone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { getAuthToken } from "@/lib/auth"

export default function CriarContaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0f1419]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  )
}

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [nome, setNome] = useState(searchParams.get("name") || "")
  const [sobrenome, setSobrenome] = useState(searchParams.get("surname") || "")
  const [email, setEmail] = useState(searchParams.get("email") || "")
  const [empresa, setEmpresa] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailExists, setEmailExists] = useState<null | boolean>(null)

  const ensureProfileAndOrganization = async (accessToken?: string | null) => {
    let token = accessToken || null
    if (!token) {
      token = getAuthToken()
    }
    if (!token) return

    const body: any = {
      name: nome.trim(),
      surname: sobrenome.trim(),
      phone: phone.trim() || null,
    }

    const orgName = empresa.trim()

    if (orgName) {
      body.organization = {
        name: orgName,
        industry: null,
        size: null,
        timezone: "america-saopaulo",
        locale: "pt-br",
      }
    }

    try {
      await fetch("/api/settings/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
    } catch {}
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!nome.trim()) {
      setError("Informe seu nome")
      return
    }

    if (!sobrenome.trim()) {
      setError("Informe seu sobrenome")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    if (!acceptTerms) {
      setError("Você precisa aceitar os termos de uso")
      return
    }

    setIsLoading(true)

    const supabase = createClient()
    const fullName = `${nome.trim()} ${sobrenome.trim()}`

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          name: nome.trim(),
          surname: sobrenome.trim(),
          organization: empresa.trim() || null,
          phone: phone.trim() || null,
        },
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
      },
    })

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError("Este e-mail já está cadastrado")
      } else {
        setError(authError.message)
      }
      setIsLoading(false)
      return
    }

    if (data.session) {
      await ensureProfileAndOrganization(data.session.access_token)
      try {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("signup_prefill_email", email)
          sessionStorage.setItem("signup_prefill_password", password)
        }
        localStorage.setItem("user_email", email)
        localStorage.setItem("user_name", fullName)
      } catch {}
      setIsLoading(false)
      router.push("/login")
      return
    }

    if (data.user && !data.session) {
      try {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("signup_prefill_email", email)
          sessionStorage.setItem("signup_prefill_password", password)
        }
      } catch {}
      setIsLoading(false)
      router.push("/login")
      return
    }

    setIsLoading(false)
  }

  useEffect(() => {
    const value = email.trim().toLowerCase()
    setEmailExists(null)
    if (!value || value.length < 5) {
      setIsCheckingEmail(false)
      return
    }

    const okEmail = /.+@.+\..+/.test(value)
    if (!okEmail) {
      setIsCheckingEmail(false)
      return
    }

    let active = true
    const controller = new AbortController()

    setIsCheckingEmail(true)

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(value)}`, {
          signal: controller.signal,
        })
        if (!res.ok) {
          throw new Error("failed")
        }
        const data = await res.json()
        if (!active) return
        if (data && typeof data.exists === "boolean" && data.valid) {
          setEmailExists(Boolean(data.exists))
        } else {
          setEmailExists(null)
        }
      } catch {
        if (!active) return
        setEmailExists(null)
      } finally {
        if (active) {
          setIsCheckingEmail(false)
        }
      }
    }, 300)

    return () => {
      active = false
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [email])

  return (
    <div className="min-h-screen w-full bg-[#0f1419] flex">
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-[45%] flex items-center">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-medium text-emerald-400">Cadastro</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug max-w-md">
                Crie sua conta e comece agora
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 max-w-sm">Leva menos de um minuto.</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-base sm:text-sm font-medium text-gray-300">Nome</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Digite seu nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="h-14 sm:h-12 bg-[#1a2329] border-[#2a3640] text-white text-base placeholder:text-gray-500 pl-12 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-base sm:text-sm font-medium text-gray-300">Sobrenome</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Digite seu sobrenome"
                      value={sobrenome}
                      onChange={(e) => setSobrenome(e.target.value)}
                      className="h-14 sm:h-12 bg-[#1a2329] border-[#2a3640] text-white text-base placeholder:text-gray-500 pl-12 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                      required
                    />
                  </div>
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
                    className="h-14 sm:h-12 bg-[#1a2329] border-[#2a3640] text-white text-base placeholder:text-gray-500 pl-12 pr-12 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                    required
                  />
                  {!isCheckingEmail && email.trim().length > 0 && (
                    <>
                      {emailExists === false && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                      )}
                      {emailExists === true && (
                        <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                      )}
                    </>
                  )}
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
                    onChange={(e) => {
                      setEmpresa(e.target.value)
                    }}
                    className="h-14 sm:h-12 bg-[#1a2329] border-[#2a3640] text-white text-base placeholder:text-gray-500 pl-12 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-base sm:text-sm font-medium text-gray-300">Telefone (opcional)</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-14 sm:h-12 bg-[#1a2329] border-[#2a3640] text-white text-base placeholder:text-gray-500 pl-12 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                    autoComplete="tel"
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
                disabled={isLoading || !!success}
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

        <div className="hidden lg:flex w-full lg:w-[55%] items-center justify-center">
          <div className="relative h-[80vh] max-h-[80vh] aspect-[4/5] rounded-3xl overflow-hidden shadow-lg shadow-emerald-500/10">
            <Image
              src="/modern-legal-team-collaboration-in-glass-office-wi.jpg"
              alt="Equipe jurídica colaborando em escritório moderno"
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
                  Todos os dados jurídicos
                  <br />
                  que você precisa,
                  <br />
                  em um só painel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
