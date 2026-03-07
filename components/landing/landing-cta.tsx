"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Image from "next/image"

export function LandingCTA() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#050505]" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop"
              alt="Advogados em reunião"
              fill
              className="object-cover"
              priority
            />
            {/* Dark Overlay with Emerald Tint */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-emerald-950/80 to-black/60" />
            
            {/* Subtle Animated Grain/Texture */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('/noise.png')" }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 lg:py-20 text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                Pronto para <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">revolucionar</span> sua prática jurídica?
              </h2>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Junte-se a mais de <span className="text-emerald-400 font-semibold">150 escritórios e empresas</span> que já confiam na Clausify para análise de contratos. Tecnologia de ponta para resultados extraordinários.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-8 h-14 text-base font-bold shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.6)] transition-all duration-300 transform hover:-translate-y-1"
                >
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:border-white/40 rounded-full px-8 h-14 text-base font-medium backdrop-blur-sm transition-all duration-300"
                >
                  Agendar Demonstração
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex flex-wrap justify-center gap-6 text-xs sm:text-sm text-gray-400 font-medium"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>14 dias de teste grátis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Sem necessidade de cartão</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Cancelamento a qualquer momento</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
