import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"

const integrations = [
	{
		name: "Google Drive",
		category: "Armazenamento",
		description:
			"Importe contratos diretamente do Google Drive e salve análises automaticamente.",
		logo: "🟡",
		features: [
			"Importação automática",
			"Sincronização bidirecional",
			"Backup automático",
		],
	},
	{
		name: "Dropbox",
		category: "Armazenamento",
		description: "Conecte sua conta Dropbox para acessar contratos de qualquer lugar.",
		logo: "🔵",
		features: ["Importação de pastas", "Versionamento", "Compartilhamento seguro"],
	},
	{
		name: "OneDrive",
		category: "Armazenamento",
		description: "Integração completa com Microsoft OneDrive para empresas.",
		logo: "🔷",
		features: ["SSO Microsoft", "SharePoint", "Teams integration"],
	},
	{
		name: "Google Calendar",
		category: "Calendário",
		description:
			"Sincronize prazos e obrigações contratuais com seu Google Calendar.",
		logo: "📅",
		features: ["Eventos automáticos", "Lembretes", "Compartilhamento"],
	},
	{
		name: "Outlook Calendar",
		category: "Calendário",
		description:
			"Integração nativa com calendário do Outlook para empresas Microsoft.",
		logo: "📆",
		features: ["Exchange Online", "Reuniões automáticas", "Notificações"],
	},
	{
		name: "Slack",
		category: "Comunicação",
		description:
			"Receba notificações sobre contratos diretamente no Slack do seu time.",
		logo: "💬",
		features: ["Alertas em canais", "Comandos slash", "Bot interativo"],
	},
	{
		name: "Microsoft Teams",
		category: "Comunicação",
		description:
			"Integração completa com Teams para colaboração em contratos.",
		logo: "👥",
		features: ["Mensagens diretas", "Tabs personalizadas", "Aprovações no Teams"],
	},
	{
		name: "Zapier",
		category: "Automação",
		description: "Conecte a Clausify com +5000 aplicativos através do Zapier.",
		logo: "⚡",
		features: ["Triggers", "Actions", "Multi-step zaps"],
	},
	{
		name: "Webhooks",
		category: "Desenvolvimento",
		description: "Receba eventos em tempo real através de webhooks HTTP.",
		logo: "🔗",
		features: ["Eventos personalizados", "Retry automático", "Logs detalhados"],
	},
	{
		name: "API REST",
		category: "Desenvolvimento",
		description: "API completa para integrar a Clausify com qualquer sistema.",
		logo: "🛠️",
		features: ["Documentação completa", "SDKs oficiais", "Rate limiting flexível"],
	},
	{
		name: "SAP",
		category: "ERP",
		description: "Integração enterprise com SAP para gestão de contratos.",
		logo: "🏢",
		features: ["SAP S/4HANA", "Workflow integration", "Custom fields"],
	},
	{
		name: "Salesforce",
		category: "CRM",
		description: "Conecte contratos com oportunidades e contas do Salesforce.",
		logo: "☁️",
		features: ["Objetos customizados", "Lightning components", "Reports"],
	},
]

const categories = [
	"Todos",
	"Armazenamento",
	"Calendário",
	"Comunicação",
	"Automação",
	"Desenvolvimento",
	"ERP",
	"CRM",
]

export default function IntegracoesPage() {
	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			<PageHeader />

			<main className="pt-24 md:pt-32 pb-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Hero */}
					<div className="text-center mb-16">
						<span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
						 Integrações
						</span>
						<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance leading-[1.15]">
							Integrações em
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
								{" "}
								escala
							</span>
						</h1>
						<p className="text-xl text-gray-400 max-w-3xl mx-auto">
							A Clausify se integra com mais de 20 ferramentas para automatizar seu
							fluxo de trabalho jurídico.
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

					{/* Integrations Grid */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{integrations.map((integration, index) => (
							<div
								key={index}
								className="group p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all duration-300"
							>
								<div className="flex items-start justify-between mb-4">
									<div className="flex items-center gap-4">
										<span className="text-3xl">{integration.logo}</span>
										<div>
											<h3 className="font-semibold">{integration.name}</h3>
											<span className="text-xs text-emerald-400">
												{integration.category}
											</span>
										</div>
									</div>
								</div>
								<p className="text-gray-400 text-sm mb-4">
									{integration.description}
								</p>
								<ul className="space-y-2 mb-4">
									{integration.features.map((feature, i) => (
										<li
											key={i}
											className="flex items-center gap-2 text-xs text-gray-500"
										>
											<Check className="w-3 h-3 text-emerald-500" />
											{feature}
										</li>
									))}
								</ul>
								<button className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group-hover:gap-2 transition-all">
									Configurar{" "}
									<ArrowRight className="w-4 h-4" />
								</button>
							</div>
						))}
					</div>

					{/* CTA */}
					<div className="mt-20 text-center p-12 bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl">
						<h2 className="text-3xl font-bold mb-4">
							Não encontrou sua integração?
						</h2>
						<p className="text-gray-400 mb-8 max-w-2xl mx-auto">
							Use nossa API REST para criar integrações customizadas ou entre em
							contato para sugerirmos novas integrações.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<Link href="/api-docs">
								<Button className="bg-emerald-500 hover:bg-emerald-600">
									Ver Documentação da API
								</Button>
							</Link>
							<Link href="/contato">
								<Button
									variant="outline"
									className="border-white/10 hover:bg-white/5 bg-transparent text-white"
								>
									Sugerir Integração
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</main>

			<LandingFooter />
		</div>
	)
}
