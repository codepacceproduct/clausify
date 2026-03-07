"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowRight } from "lucide-react"

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#features", label: "Recursos" },
    { href: "#ecosystem", label: "Ecossistema" },
    { href: "#benefits", label: "Vantagens" },
    { href: "#pricing", label: "Planos" },
    { href: "#testimonials", label: "Cases" },
  ]

  return (
    <header
      className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 flex justify-center px-4`}
    >
      <div 
        className={`w-full max-w-5xl rounded-full border border-white/10 bg-black/50 backdrop-blur-md transition-all duration-300 px-6 py-3 ${
          isScrolled ? "bg-black/80 shadow-lg shadow-black/20" : "bg-black/50"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative w-32 h-8 flex-shrink-0">
            <Image
              src="/images/clausify-logo.png"
              alt="Clausify"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/login">
              <Button className="bg-white hover:bg-gray-200 text-black rounded-full px-6 h-10 font-medium group">
                Começar Grátis
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-400 hover:text-white py-2 text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 space-y-3 flex flex-col items-center">
            <Link href="/login" className="block w-full">
              <Button variant="ghost" className="w-full text-gray-300 hover:text-white">
                Entrar
              </Button>
            </Link>
            <Link href="/login" className="block w-full">
              <Button className="w-full bg-white hover:bg-gray-200 text-black rounded-full">
                Começar Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
