import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Book, Code, Zap, Shield, FileText, Users, Search, ArrowRight } from "lucide-react"

const sections = [
	{
		icon: Zap,
		title: "Início Rápido",
		description: "Comece a usar a Clausify em menos de 5 minutos.",
		links: ["Criar conta", "Primeiro contrato", "Configurar equipe"],
	},
	{
		icon: FileText,
		title: "Análise de Contratos",
		description: "Aprenda a analisar contratos com nossa IA.",
		links: ["Upload de documentos", "Tipos de análise", "Interpretar resultados"],
	},
	{
		icon: Shield,
		title: "Gestão de Riscos",
		description: "Configure e gerencie alertas de risco.",
		links: ["Classificação de riscos", "Alertas automáticos", "Relatórios"],
	},
	{
		icon: Users,
		title: "Equipe e Permissões",
		description: "Gerencie usuários e controle de acesso.",
		links: ["Adicionar usuários", "Roles e permissões", "SSO/SAML"],
	},
	{
		icon: Code,
		title: "API e Integrações",
		description: "Conecte a Clausify com seus sistemas.",
		links: ["Autenticação", "Endpoints", "Webhooks"],
	},
	{
		icon: Book,
		title: "Guias Avançados",
		description: "Domine todas as funcionalidades.",
		links: ["Playbook jurídico", "Workflow de aprovação", "Versionamento"],
	},
]

const popularArticles = [
	"Como fazer upload do primeiro contrato",
	"Entendendo a análise de risco",
	"Configurar workflow de aprovação",
	"Integrar com Google Calendar",
	"Gerenciar cláusulas do playbook",
	"Exportar relatórios em PDF",
]

export default function DocumentacaoPage() {
	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			<PageHeader />

			<main className="pt-24 md:pt-32 pb-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Hero */}
					<div className="text-center mb-16">
						<span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
							Documentação
						</span>
						<h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 text-balance">
							Centro de{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
								conhecimento
							</span>
						</h1>
						<p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
							Tudo que você precisa para dominar a Clausify. Guias, tutoriais e
							referência da API.
						</p>

						{/* Search */}
						<div className="max-w-2xl mx-auto relative">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
							<input
								type="text"
								placeholder="Buscar na documentação..."
								className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
							/>
						</div>
					</div>

					{/* Sections Grid */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
						{sections.map((section, index) => (
							<div
								key={index}
								className="group p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all"
							>
								<div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
									<section.icon className="w-6 h-6 text-emerald-400" />
								</div>
								<h3 className="text-xl font-semibold mb-2">{section.title}</h3>
								<p className="text-gray-400 text-sm mb-4">
									{section.description}
								</p>
								<ul className="space-y-2">
									{section.links.map((link, i) => (
										<li key={i}>
											<a
												href="#"
												className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
											>
												{link}
												<ArrowRight className="w-3 h-3" />
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>

					{/* Popular Articles */}
					<div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
						<h2 className="text-2xl font-bold mb-6">Artigos Populares</h2>
						<div className="grid md:grid-cols-2 gap-4">
							{popularArticles.map((article, index) => (
								<a
									key={index}
									href="#"
									className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-emerald-500/30 transition-all group"
								>
									<span className="text-gray-300 group-hover:text-white transition-colors">
										{article}
									</span>
									<ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
								</a>
							))}
						</div>
					</div>
				</div>
			</main>

			<LandingFooter />
		</div>
	)
}
