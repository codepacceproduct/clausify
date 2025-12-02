import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Briefcase, Heart, Zap, Users, Coffee, Laptop } from "lucide-react"
import Link from "next/link"

const benefits = [
  { icon: Laptop, title: "100% Remoto", description: "Trabalhe de qualquer lugar do mundo" },
  { icon: Heart, title: "Plano de Saúde", description: "Cobertura completa para você e família" },
  { icon: Coffee, title: "Auxílio Home Office", description: "R$500/mês para seu escritório" },
  { icon: Zap, title: "Horário Flexível", description: "Organize seu tempo como preferir" },
  { icon: Users, title: "Stock Options", description: "Seja dono da empresa" },
  { icon: Briefcase, title: "PLR", description: "Participação nos lucros" },
]

const jobs = [
  {
    title: "Senior Full-Stack Developer",
    department: "Engenharia",
    location: "Remoto",
    type: "Tempo integral",
    description:
      "Buscamos um desenvolvedor full-stack experiente para liderar projetos de ponta usando Next.js e Python.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remoto",
    type: "Tempo integral",
    description: "Procuramos um designer apaixonado por criar experiências incríveis para usuários do setor jurídico.",
  },
  {
    title: "Machine Learning Engineer",
    department: "IA",
    location: "Remoto",
    type: "Tempo integral",
    description: "Venha trabalhar com NLP e LLMs para revolucionar a análise de contratos jurídicos.",
  },
  {
    title: "Customer Success Manager",
    department: "Sucesso do Cliente",
    location: "São Paulo ou Remoto",
    type: "Tempo integral",
    description: "Ajude nossos clientes a extrair o máximo valor da plataforma Clausify.",
  },
  {
    title: "Legal Operations Specialist",
    department: "Legal",
    location: "Remoto",
    type: "Tempo integral",
    description: "Buscamos advogado(a) para ajudar a definir padrões e melhorar nossa análise de contratos.",
  },
]

export default function CarreirasPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              Carreiras
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Faça parte do{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                futuro do direito
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Estamos construindo a próxima geração de ferramentas jurídicas. Junte-se a um time de pessoas apaixonadas
              por tecnologia e impacto.
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Por que trabalhar na Clausify?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Jobs */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-12">Vagas Abertas</h2>
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="group p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold group-hover:text-emerald-400 transition-colors">
                          {job.title}
                        </h3>
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-md">
                          {job.department}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{job.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 shrink-0">Candidatar-se</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center p-12 bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl">
            <h2 className="text-3xl font-bold mb-4">Não encontrou sua vaga?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Estamos sempre procurando pessoas talentosas. Envie seu currículo e entraremos em contato quando houver
              uma oportunidade.
            </p>
            <Link href="/contato">
              <Button variant="outline" className="border-white/10 hover:bg-white/5 bg-transparent text-white">
                Enviar Currículo
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
