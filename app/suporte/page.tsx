"use client"

import { useState } from "react"
import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Button } from "@/components/ui/button"
import { MessageSquare, Mail, Phone, FileQuestion, Book, Video, ChevronDown, Search } from "lucide-react"
import Link from "next/link"

const supportOptions = [
  {
    icon: MessageSquare,
    title: "Chat ao Vivo",
    description: "Fale com nossa equipe em tempo real",
    action: "Iniciar Chat",
    available: true,
  },
  {
    icon: Mail,
    title: "Email",
    description: "suporte@clausify.com.br",
    action: "Enviar Email",
    available: true,
  },
  {
    icon: Phone,
    title: "Telefone",
    description: "+55 (11) 4000-0000",
    action: "Ligar Agora",
    available: true,
  },
]

const quickLinks = [
  { icon: Book, title: "Documentação", href: "/documentacao" },
  { icon: Video, title: "Tutoriais em Vídeo", href: "/guias" },
  { icon: FileQuestion, title: "FAQ", href: "#faq" },
]

const faqs = [
  {
    question: "Como faço para resetar minha senha?",
    answer: "Clique em 'Esqueci minha senha' na tela de login e siga as instruções enviadas para seu email.",
  },
  {
    question: "Posso cancelar minha assinatura a qualquer momento?",
    answer:
      "Sim, você pode cancelar sua assinatura a qualquer momento sem multas. Acesse Configurações > Assinatura > Cancelar.",
  },
  {
    question: "Quais formatos de arquivo são aceitos?",
    answer: "Aceitamos DOCX e TXT. O tamanho máximo por arquivo é 10MB.",
  },
  {
    question: "Como adicionar novos usuários à minha equipe?",
    answer:
      "Vá em Configurações > Equipe > Convidar Usuário. Você pode definir permissões específicas para cada membro.",
  },
  {
    question: "A Clausify está em conformidade com a LGPD?",
    answer:
      "Sim, estamos 100% em conformidade com a LGPD. Todos os dados são criptografados e armazenados em servidores no Brasil.",
  },
]

export default function SuportePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              Suporte
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Como podemos{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                ajudar?
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Nossa equipe está pronta para resolver qualquer dúvida ou problema que você encontrar.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Descreva seu problema..."
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Support Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {supportOptions.map((option, index) => (
              <div key={index} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{option.description}</p>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">{option.action}</Button>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all"
              >
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                  <link.icon className="w-6 h-6 text-gray-400" />
                </div>
                <span className="font-medium">{link.title}</span>
              </Link>
            ))}
          </div>

          {/* FAQ */}
          <div id="faq" className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-medium">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-400">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
