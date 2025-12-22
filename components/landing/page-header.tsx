"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowLeft } from "lucide-react"

const navLinks = [
  { href: "#intro", label: "Visão geral" },
  { href: "#planos", label: "Planos" },
  { href: "#faq", label: "FAQ" },
]

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

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMobileMenuOpen)
    return () => document.body.classList.remove("overflow-hidden")
  }, [isMobileMenuOpen])

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

          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

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
            type="button"
            className="md:hidden text-gray-200 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Alternar menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-sm overflow-y-auto">
          <div className="px-6 pt-28 pb-10 space-y-4 text-lg text-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 border-b border-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
