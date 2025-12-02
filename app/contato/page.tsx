"use client"

import type React from "react"

import { useState } from "react"
import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, MessageSquare, CheckCircle } from "lucide-react"

const contactInfo = [
  { icon: Mail, title: "Email", value: "contato@clausify.com.br", description: "Respondemos em até 24h" },
  { icon: Phone, title: "Telefone", value: "+55 (11) 4000-0000", description: "Seg-Sex, 9h às 18h" },
  { icon: MapPin, title: "Escritório", value: "São Paulo, SP", description: "Av. Paulista, 1000" },
]

export default function ContatoPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              Contato
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Fale{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                conosco
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Tem alguma dúvida, sugestão ou quer saber mais sobre a Clausify? Estamos aqui para ajudar.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <info.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      <p className="text-white">{info.value}</p>
                      <p className="text-gray-500 text-sm">{info.description}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold">Chat ao Vivo</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">Precisa de ajuda imediata? Nosso time está online.</p>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Iniciar Chat</Button>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Mensagem Enviada!</h3>
                    <p className="text-gray-400 mb-6">
                      Obrigado pelo contato. Nossa equipe responderá em até 24 horas.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="border-white/10 bg-transparent text-white"
                    >
                      Enviar Nova Mensagem
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nome Completo</label>
                        <Input
                          placeholder="Seu nome"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Telefone</label>
                        <Input
                          placeholder="(11) 99999-9999"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Assunto</label>
                        <select className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white">
                          <option value="">Selecione</option>
                          <option value="vendas">Vendas</option>
                          <option value="suporte">Suporte</option>
                          <option value="parceria">Parceria</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Mensagem</label>
                      <Textarea
                        placeholder="Como podemos ajudar?"
                        rows={6}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 resize-none"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600">
                      Enviar Mensagem
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
