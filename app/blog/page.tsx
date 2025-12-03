import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import Image from "next/image"
import { ArrowRight, Clock, User } from "lucide-react"

const featuredPost = {
  title: "Como a IA está transformando a análise de contratos jurídicos em 2024",
  excerpt:
    "Descubra como a inteligência artificial está revolucionando o trabalho dos advogados, reduzindo tempo de análise em até 90% e aumentando a precisão na identificação de riscos.",
  image: "/ai-legal-technology-futuristic.jpg",
  category: "Tecnologia",
  author: "Ricardo Silva",
  date: "28 Nov, 2024",
  readTime: "8 min",
}

const posts = [
  {
    title: "5 cláusulas de risco que você precisa identificar em contratos de locação",
    excerpt: "Aprenda a identificar as principais armadilhas em contratos de locação comercial e residencial.",
    category: "Contratos",
    author: "Mariana Costa",
    date: "25 Nov, 2024",
    readTime: "5 min",
  },
  {
    title: "LGPD para advogados: o guia definitivo de conformidade",
    excerpt: "Tudo que você precisa saber sobre a Lei Geral de Proteção de Dados e como garantir conformidade.",
    category: "LGPD",
    author: "Ana Ferreira",
    date: "20 Nov, 2024",
    readTime: "12 min",
  },
  {
    title: "Workflow de aprovação: como implementar em seu escritório",
    excerpt: "Um guia passo a passo para criar fluxos de aprovação eficientes para contratos.",
    category: "Produtividade",
    author: "Carlos Santos",
    date: "15 Nov, 2024",
    readTime: "6 min",
  },
  {
    title: "O futuro dos contratos inteligentes no Brasil",
    excerpt: "Uma análise sobre smart contracts e como eles podem impactar o mercado jurídico brasileiro.",
    category: "Tendências",
    author: "Ricardo Silva",
    date: "10 Nov, 2024",
    readTime: "10 min",
  },
  {
    title: "Case de sucesso: como o escritório XYZ reduziu 70% do tempo de análise",
    excerpt: "Conheça a história de um dos maiores escritórios do país e sua jornada de transformação digital.",
    category: "Cases",
    author: "Mariana Costa",
    date: "5 Nov, 2024",
    readTime: "7 min",
  },
  {
    title: "Checklist: 10 pontos essenciais em contratos de prestação de serviços",
    excerpt: "Um checklist completo para revisar contratos de prestação de serviços com eficiência.",
    category: "Contratos",
    author: "Ana Ferreira",
    date: "1 Nov, 2024",
    readTime: "4 min",
  },
]

const categories = ["Todos", "Tecnologia", "Contratos", "LGPD", "Produtividade", "Tendências", "Cases"]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              Blog
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Insights sobre{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                direito e tecnologia
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Artigos, guias e cases para profissionais do direito que querem se manter atualizados.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 text-sm rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <div className="group relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative aspect-video md:aspect-auto bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                  <Image
                    src={featuredPost.image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="text-emerald-400 text-sm font-medium mb-4">{featuredPost.category}</span>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-400 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                    <span>{featuredPost.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article
                key={index}
                className="group p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all cursor-pointer"
              >
                <span className="text-emerald-400 text-sm font-medium">{post.category}</span>
                <h3 className="text-xl font-semibold mt-3 mb-3 group-hover:text-emerald-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm mb-6">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 mx-auto">
              Carregar mais artigos <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
