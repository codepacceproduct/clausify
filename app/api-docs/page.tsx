import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Code, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const endpoints = [
	{
		method: "GET",
		path: "/contracts",
		description: "Lista todos os contratos",
	},
	{
		method: "POST",
		path: "/contracts",
		description: "Cria um novo contrato para análise",
	},
	{
		method: "GET",
		path: "/contracts/:id",
		description: "Retorna detalhes de um contrato",
	},
	{
		method: "GET",
		path: "/contracts/:id/analysis",
		description: "Retorna a análise de um contrato",
	},
	{
		method: "POST",
		path: "/contracts/:id/approve",
		description: "Aprova um contrato no workflow",
	},
	{
		method: "GET",
		path: "/playbook/clauses",
		description: "Lista cláusulas do playbook",
	},
]

const codeExample = `// Exemplo: Analisar um contrato
const response = await fetch('https://api.clausify.com.br/v1/contracts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    document: base64EncodedFile,
    type: 'service_agreement',
    analysis_options: {
      risk_analysis: true,
      compliance_check: true,
      clause_extraction: true,
    }
  })
});

const data = await response.json();
console.log(data.analysis);`

export default function ApiDocsPage() {
	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			<PageHeader />

			<main className="pt-24 md:pt-32 pb-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Hero */}
					<div className="text-center mb-16">
						<span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
							API
						</span>
						<h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
							Documentação da{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
								API REST
							</span>
						</h1>
						<p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
							Integre a análise de contratos da Clausify em qualquer aplicação com
							nossa API completa.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<Button className="bg-emerald-500 hover:bg-emerald-600">
								<Code className="w-4 h-4 mr-2" />
								Obter API Key
							</Button>
							<Button
								variant="outline"
								className="border-white/10 bg-transparent text-white hover:bg-white/5"
							>
								<ExternalLink className="w-4 h-4 mr-2" />
								Postman Collection
							</Button>
						</div>
					</div>

					<div className="grid lg:grid-cols-2 gap-12">
						{/* Endpoints */}
						<div>
							<h2 className="text-2xl font-bold mb-6">Endpoints</h2>
							<div className="space-y-3">
								{endpoints.map((endpoint, index) => (
									<div
										key={index}
										className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"
									>
										<div className="flex items-center gap-3 mb-2">
											<span
												className={`px-2 py-1 text-xs font-mono rounded ${
													endpoint.method === "GET"
														? "bg-blue-500/10 text-blue-400"
														: "bg-emerald-500/10 text-emerald-400"
												}`}
											>
												{endpoint.method}
											</span>
											<code className="text-sm text-gray-300">
												{endpoint.path}
											</code>
										</div>
										<p className="text-gray-500 text-sm">
											{endpoint.description}
										</p>
									</div>
								))}
							</div>
						</div>

						{/* Code Example */}
						<div>
							<h2 className="text-2xl font-bold mb-6">Exemplo de Uso</h2>
							<div className="relative bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
								<div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
									<span className="text-sm text-gray-400">JavaScript</span>
									<button className="text-gray-400 hover:text-white">
										<Copy className="w-4 h-4" />
									</button>
								</div>
								<pre className="p-4 text-sm text-gray-300 overflow-x-auto">
									<code>{codeExample}</code>
								</pre>
							</div>

							<div className="mt-8 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
								<h3 className="font-semibold mb-2">Base URL</h3>
								<code className="text-emerald-400">
									https://api.clausify.com.br/v1
								</code>
								<h3 className="font-semibold mt-4 mb-2">Autenticação</h3>
								<p className="text-gray-400 text-sm">
									Todas as requisições devem incluir o header{" "}
									<code className="text-emerald-400">
										Authorization: Bearer YOUR_API_KEY
									</code>
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>

			<LandingFooter />
		</div>
	)
}
