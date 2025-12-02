import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Button } from "@/components/ui/button"
import { Target, Eye, Heart, Users, Globe } from "lucide-react"
import Link from "next/link"

const values = [
  {
    icon: Target,
    title: "Inovação",
    description: "Buscamos constantemente novas formas de usar tecnologia para simplificar o trabalho jurídico.",
  },
  {
    icon: Heart,
    title: "Compromisso",
    description: "Tratamos cada contrato dos nossos clientes com o mesmo cuidado que trataríamos os nossos.",
  },
  {
    icon: Eye,
    title: "Transparência",
    description: "Acreditamos em comunicação clara e honesta com nossos clientes e parceiros.",
  },
  {
    icon: Users,
    title: "Colaboração",
    description: "Trabalhamos lado a lado com advogados para criar a melhor ferramenta possível.",
  },
]

const stats = [
  { value: "50K+", label: "Contratos Analisados" },
  { value: "2000+", label: "Clientes Ativos" },
  { value: "98%", label: "Satisfação" },
  { value: "15", label: "Países" },
]

const team = [
  { name: "Ricardo Silva", role: "CEO & Co-fundador", image: "/professional-ceo.png" },
  { name: "Ana Ferreira", role: "CTO & Co-fundadora", image: "/professional-woman-cto.png" },
  { name: "Carlos Santos", role: "Head of Product", image: "/professional-man-product.jpg" },
  { name: "Mariana Costa", role: "Head of Legal", image: "/professional-woman-lawyer.png" },
]

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              Sobre Nós
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Transformando o{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                direito com IA
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Nascemos da frustração de advogados que perdiam horas analisando contratos manualmente. Nossa missão é
              devolver tempo para que profissionais do direito foquem no que realmente importa.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="text-4xl font-bold text-emerald-400 mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Story */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  A Clausify nasceu em 2022, quando dois advogados e um engenheiro de software se uniram com um objetivo
                  comum: revolucionar a forma como contratos são analisados no Brasil.
                </p>
                <p>
                  Frustrados com o tempo gasto em análises manuais e a quantidade de riscos que passavam despercebidos,
                  desenvolvemos uma inteligência artificial capaz de identificar problemas em contratos com precisão
                  superior a 95%.
                </p>
                <p>
                  Hoje, mais de 2000 escritórios e departamentos jurídicos confiam na Clausify para analisar milhares de
                  contratos todos os meses, economizando tempo e reduzindo riscos.
                </p>
              </div>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
              <Globe className="w-32 h-32 text-emerald-500/50" />
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-400 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Liderança</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-white/5">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-gray-400 text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-12 bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl">
            <h2 className="text-3xl font-bold mb-4">Quer fazer parte dessa história?</h2>
            <p className="text-gray-400 mb-8">
              Estamos sempre em busca de talentos apaixonados por tecnologia e direito.
            </p>
            <Link href="/carreiras">
              <Button className="bg-emerald-500 hover:bg-emerald-600">Ver Vagas Abertas</Button>
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
