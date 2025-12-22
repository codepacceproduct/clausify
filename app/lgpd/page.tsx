import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Shield, Lock, Eye, Trash2, Download, Bell } from "lucide-react"

const rights = [
	{
		icon: Eye,
		title: "Direito de Acesso",
		description: "Você pode solicitar uma cópia de todos os seus dados pessoais armazenados em nossa plataforma.",
	},
	{
		icon: Shield,
		title: "Direito de Correção",
		description: "Solicite a correção de dados pessoais incompletos, inexatos ou desatualizados.",
	},
	{
		icon: Trash2,
		title: "Direito de Exclusão",
		description:
			"Você pode solicitar a exclusão de seus dados pessoais, exceto quando houver obrigação legal de retenção.",
	},
	{
		icon: Download,
		title: "Direito de Portabilidade",
		description: "Receba seus dados em formato estruturado para transferência a outro fornecedor.",
	},
	{
		icon: Bell,
		title: "Direito de Oposição",
		description: "Você pode se opor ao tratamento de seus dados para fins de marketing direto.",
	},
	{
		icon: Lock,
		title: "Revogação de Consentimento",
		description: "Revogue seu consentimento a qualquer momento, sem afetar a licitude do tratamento anterior.",
	},
]

export default function LgpdPage() {
	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			<PageHeader />

			<main className="pt-24 md:pt-32 pb-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Hero */}
					<div className="text-center mb-16">
						<span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
							LGPD
						</span>
						<h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
							Compromisso com a{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
								proteção de dados
							</span>
						</h1>
						<p className="text-xl text-gray-400 max-w-3xl mx-auto">
							A Clausify está 100% em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
						</p>
					</div>

					{/* Rights Grid */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
						{rights.map((right, index) => (
							<div key={index} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
								<div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
									<right.icon className="w-6 h-6 text-emerald-400" />
								</div>
								<h3 className="text-xl font-semibold mb-2">{right.title}</h3>
								<p className="text-gray-400 text-sm">{right.description}</p>
							</div>
						))}
					</div>

					{/* Content */}
					<div className="max-w-4xl mx-auto">
						<div className="space-y-8 text-gray-300">
							<section className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
								<h2 className="text-2xl font-bold text-white mb-4">Base Legal para Tratamento</h2>
								<p className="mb-4">
									Tratamos seus dados pessoais com base nas seguintes hipóteses legais previstas na LGPD:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										<strong>Execução de contrato:</strong> Para fornecer os serviços contratados
									</li>
									<li>
										<strong>Consentimento:</strong> Para comunicações de marketing e funcionalidades opcionais
									</li>
									<li>
										<strong>Legítimo interesse:</strong> Para melhorar nossos serviços e garantir segurança
									</li>
									<li>
										<strong>Obrigação legal:</strong> Para cumprir obrigações fiscais e regulatórias
									</li>
								</ul>
							</section>

							<section className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
								<h2 className="text-2xl font-bold text-white mb-4">Medidas de Segurança</h2>
								<p className="mb-4">Implementamos medidas técnicas e administrativas para proteger seus dados:</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>Criptografia AES-256 para dados em repouso</li>
									<li>TLS 1.3 para dados em trânsito</li>
									<li>Controle de acesso baseado em funções (RBAC)</li>
									<li>Logs de auditoria completos</li>
									<li>Testes de penetração regulares</li>
									<li>Treinamento de equipe em segurança da informação</li>
								</ul>
							</section>

							<section className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
								<h2 className="text-2xl font-bold text-white mb-4">Encarregado de Dados (DPO)</h2>
								<p className="mb-4">Nosso Encarregado pelo Tratamento de Dados Pessoais está disponível para:</p>
								<ul className="list-disc pl-6 space-y-2 mb-6">
									<li>Receber reclamações e comunicações dos titulares</li>
									<li>Prestar esclarecimentos às autoridades</li>
									<li>Orientar funcionários sobre práticas de proteção de dados</li>
								</ul>
								<div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
									<p>
										<strong>Nome:</strong> Ana Ferreira
									</p>
									<p>
										<strong>Email:</strong> dpo@clausify.com.br
									</p>
									<p>
										<strong>Telefone:</strong> +55 (11) 4000-0001
									</p>
								</div>
							</section>

							<section className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
								<h2 className="text-2xl font-bold text-white mb-4">Como Exercer seus Direitos</h2>
								<p className="mb-4">Para exercer qualquer um dos seus direitos, você pode:</p>
								<ul className="list-disc pl-6 space-y-2 mb-6">
									<li>Acessar as configurações de privacidade em sua conta</li>
									<li>Enviar email para privacidade@clausify.com.br</li>
									<li>Utilizar nosso formulário de solicitação de dados</li>
								</ul>
								<p>Responderemos sua solicitação em até 15 dias úteis, conforme previsto na legislação.</p>
							</section>
						</div>
					</div>
				</div>
			</main>

			<LandingFooter />
		</div>
	)
}
