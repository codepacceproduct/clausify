"use client"

import { useState } from "react"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "A Clausify transformou completamente nossa rotina. O que antes levava dias para analisar, agora fazemos em horas. A precisão da IA é impressionante.",
    author: "Dra. Marina Santos",
    role: "Sócia - Santos & Advogados Associados",
    avatar: "MS",
    rating: 5,
  },
  {
    quote:
      "O workflow de aprovação e o versionamento de contratos nos deram um controle que nunca tivemos. Reduzimod erros em 90% e ganhamos agilidade.",
    author: "Ricardo Almeida",
    role: "Diretor Jurídico - TechCorp Brasil",
    avatar: "RA",
    rating: 5,
  },
  {
    quote:
      "A integração com calendário é game-changer. Nunca mais perdemos um prazo de renovação. O ROI foi positivo já no primeiro mês.",
    author: "Dra. Carla Mendes",
    role: "Head Legal - StartupX",
    avatar: "CM",
    rating: 5,
  },
  {
    quote:
      "Recomendo para qualquer escritório que queira modernizar. A curva de aprendizado é mínima e o suporte é excepcional.",
    author: "Dr. Felipe Costa",
    role: "Advogado Imobiliário",
    avatar: "FC",
    rating: 5,
  },
]

export function LandingTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-emerald-400 font-medium mb-4">Depoimentos</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            O que nossos clientes dizem
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            {/* Quote Icon */}
            <Quote className="absolute top-8 right-8 w-20 h-20 text-emerald-500/10" />

            {/* Rating */}
            <div className="flex gap-1 mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-emerald-400 text-emerald-400" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-xl sm:text-2xl text-white leading-relaxed mb-8 relative z-10">
              "{testimonials[currentIndex].quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                {testimonials[currentIndex].avatar}
              </div>
              <div>
                <p className="font-semibold text-white">{testimonials[currentIndex].author}</p>
                <p className="text-gray-400 text-sm">{testimonials[currentIndex].role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-emerald-400 w-6" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
