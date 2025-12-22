"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Shield, Zap, FileCheck, Sparkles } from "lucide-react"

export function LandingHero() {
  const [isVisible] = useState(true)

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div
          className={`text-center space-y-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-300">Powered by AI</span>
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs font-medium">
              Novo
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.15] text-balance">
            <span className="text-white">Análise jurídica</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-400 bg-clip-text text-transparent font-extrabold">
              inteligente
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto">
            Revolucione sua prática jurídica com IA. Analise contratos em minutos, identifique riscos automaticamente e
            tome decisões estratégicas com confiança.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-8 h-14 text-base font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:scale-105"
              >
                Começar Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 rounded-full px-8 h-14 text-base font-medium bg-transparent"
            >
              <Play className="mr-2 w-5 h-5 fill-current" />
              Ver Demo
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Dados 100% seguros</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Análise em minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-500" />
              <span>+5.000 contratos analisados</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div
          className={`mt-20 relative transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Image
              src="/images/dashboard-preview.png"
              alt="Clausify Dashboard"
              width={1200}
              height={700}
              className="w-full max-w-5xl h-auto object-contain rounded-2xl shadow-2xl shadow-emerald-500/10"
            />
          </div>

          {/* Floating Cards - using Tailwind animate-bounce as alternative */}
          <div className="absolute left-0 lg:left-10 top-1/2 bg-[#1a2329] border border-white/10 rounded-xl p-4 shadow-2xl hidden lg:block animate-float-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Análise de Risco</p>
                <p className="text-sm font-semibold text-white">3 cláusulas críticas</p>
              </div>
            </div>
          </div>

          <div className="absolute right-0 lg:right-10 top-2/3 bg-[#1a2329] border border-white/10 rounded-xl p-4 shadow-2xl hidden lg:block animate-float-card-delayed">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Tempo de Análise</p>
                <p className="text-sm font-semibold text-white">2 min 34 seg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
