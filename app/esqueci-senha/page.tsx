"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, ArrowRight, ArrowLeft, Star, Users, CheckCircle2, Shield, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
        ? `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL}/redefinir-senha`
        : `${window.location.origin}/redefinir-senha`,
    })

    if (authError) {
      setError(authError.message)
      setIsLoading(false)
      return
    }

    setEmailSent(true)
    setIsLoading(false)
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
              Sua segurança é nossa <span className="text-emerald-400">prioridade</span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed">
              Não se preocupe, acontece com todo mundo. Vamos te ajudar a recuperar o acesso à sua conta de forma rápida
              e segura.
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

      {/* Right Side - Forgot Password Form */}
      <div className="flex-1 flex items-stretch lg:items-center justify-center bg-[#0f1419] overflow-y-auto">
        <div className="w-full max-w-md space-y-6 sm:space-y-8 px-6 py-8 sm:px-8 sm:py-4">
          <div className="flex justify-center">
            <div className="relative w-48 h-16">
              <Image src="/images/clausify-logo.png" alt="Clausify Logo" fill className="object-contain" priority />
            </div>
          </div>

          {!emailSent ? (
            <>
              <div className="space-y-2 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
                <h2 className="text-3xl sm:text-3xl font-bold text-white">Esqueceu sua senha?</h2>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">
                  Digite seu e-mail cadastrado e enviaremos um link para você redefinir sua senha.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-base sm:text-sm font-medium text-gray-300">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type="email"
                      placeholder="Digite seu e-mail cadastrado"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-16 sm:h-14 bg-[#1a2329] border-[#2a3640] text-white text-base placeholder:text-gray-500 pl-12 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-16 sm:h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg sm:text-base rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Enviando..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Enviar link de recuperação
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white">E-mail enviado!</h2>
              <p className="text-gray-400 max-w-sm mx-auto">
                Enviamos um link de recuperação para <span className="text-white font-medium">{email}</span>. Verifique
                sua caixa de entrada e a pasta de spam.
              </p>
              <div className="bg-[#1a2329] border border-[#2a3640] rounded-xl p-4 text-left">
                <p className="text-sm text-gray-400">
                  <span className="text-emerald-400 font-medium">Dica:</span> O link expira em 1 hora. Caso não receba o
                  e-mail, verifique se digitou o endereço corretamente.
                </p>
              </div>
              <Button
                onClick={() => {
                  setEmailSent(false)
                  setEmail("")
                }}
                variant="outline"
                className="w-full h-14 border-[#2a3640] text-gray-300 hover:bg-[#1a2329] hover:text-white rounded-xl"
              >
                Tentar outro e-mail
              </Button>
            </div>
          )}

          <div className="text-center space-y-4 pb-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-base sm:text-sm text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
