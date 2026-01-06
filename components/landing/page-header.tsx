"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowLeft } from "lucide-react"

export function PageHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/" className="relative w-36 h-10">
              <Image
                src="/images/clausify-logo.png"
                alt="Clausify"
                fill
                className="object-contain object-left"
                priority
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5">
                Entrar
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6">
                Começar Grátis
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 p-6 space-y-4">
            <Link href="/login" className="block">
              <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent">
                Entrar
              </Button>
            </Link>
            <Link href="/login" className="block">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Começar Grátis</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
