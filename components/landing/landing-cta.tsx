import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function LandingCTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-400" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-24 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
              Pronto para revolucionar sua prática jurídica?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
              Junte-se a mais de 150 escritórios e empresas que já confiam na Clausify para análise de contratos. Comece
              seu teste gratuito de 14 dias hoje.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/listadeespera">
                <Button
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-white/90 rounded-full px-8 h-14 text-base font-semibold shadow-xl"
                >
                  Entrar na Lista de Espera
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/listadeespera">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 h-14 text-base font-medium bg-transparent"
                >
                  Agendar Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
