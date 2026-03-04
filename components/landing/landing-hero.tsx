"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Shield, Zap, FileCheck, Sparkles } from "lucide-react"

export function LandingHero() {
  const [isVisible] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75 // Slow down slightly for better effect
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover opacity-60"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay for transparency/readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />
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
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight max-w-5xl mx-auto leading-[1.1]">
            <span className="text-white">Seu escritório</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-400 bg-clip-text text-transparent font-extrabold">
              em um só lugar
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Muito além da análise. Crie contratos, calcule prazos, gerencie versões e organize sua agenda com o poder da IA. Uma plataforma completa para sua rotina jurídica.
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
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Dados 100% seguros</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Automação Inteligente</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-500" />
              <span>Gestão de ponta a ponta</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
