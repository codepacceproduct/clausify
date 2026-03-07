"use client"

import { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { testimonials } from "./testimonials-data"

// Categories for the filter tabs
const categories = [
  "Todos",
  "Família",
  "Cível e Bancário",
  "Trabalhista",
  "Empresarial e Tributário",
  "Previdenciário",
]

export function LandingTestimonials() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 1 },
      "(min-width: 1024px)": { slidesToScroll: 1 },
    },
  })

  // Filter testimonials based on category
  const filteredTestimonials =
    activeCategory === "Todos"
      ? testimonials
      : testimonials.filter((t) => t.category === activeCategory)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Reset carousel when filter changes
  useEffect(() => {
    if (emblaApi) emblaApi.reInit()
  }, [activeCategory, emblaApi])

  return (
    <section id="testimonials" className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-emerald-500 font-medium text-lg tracking-wide">
            Cases
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white max-w-4xl mx-auto leading-tight">
            Mais de 5.000 escritórios já alcançaram receitas milionárias com a Clausify. O próximo pode ser o seu.
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                activeCategory === cat
                  ? "bg-[#0f1c2e] border-emerald-500/50 text-white shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]"
                  : "bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-6">
              {filteredTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="pl-6 min-w-full md:min-w-[50%] lg:min-w-[33.333%]"
                >
                  <div className="bg-[#080c14] border border-white/5 rounded-2xl p-8 h-full flex flex-col justify-between hover:border-emerald-500/20 transition-colors group min-h-[400px]">
                    
                    {/* Top Content */}
                    <div>
                      <Quote className="w-12 h-12 text-emerald-500 mb-6 fill-emerald-500/10" />
                      <p className="text-gray-300 text-lg leading-relaxed mb-8">
                        "{testimonial.quote}"
                      </p>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                      <div className="relative w-12 h-12 rounded-full bg-gray-800 overflow-hidden shrink-0">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-base">
                          {testimonial.author}
                        </p>
                        <p className="text-emerald-500/80 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <button
            onClick={scrollPrev}
            className="w-12 h-12 rounded-full bg-[#0f1c2e] border border-white/10 flex items-center justify-center text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={scrollNext}
            className="w-12 h-12 rounded-full bg-[#0f1c2e] border border-white/10 flex items-center justify-center text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300 group"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  )
}
