import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, BarChart3, Download, Share2 } from "lucide-react"
import Link from "next/link"

export default function RelatoriosPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/documentacao" 
            className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Documentação
          </Link>

          <h1 className="text-4xl font-bold mb-6">Relatórios e Dashboards</h1>
          <p className="text-xl text-gray-400 mb-12">
            Transforme dados contratuais em inteligência de negócios com nossos relatórios avançados.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Dashboard Executivo</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Tenha uma visão panorâmica da sua carteira de contratos com métricas em tempo real.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-2">KPIs Principais</h4>
                      <p className="text-sm text-gray-400">Total de contratos, valor total da carteira, risco médio, tempo médio de aprovação.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-2">Distribuição</h4>
                      <p className="text-sm text-gray-400">Gráficos por tipo de contrato, departamento solicitante, fornecedor e status.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Exportação de Dados</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Você pode extrair os dados para apresentações ou análises externas.
                  </p>
                  <ul className="space-y-2 text-gray-400 ml-4">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <strong>PDF:</strong> Relatórios formatados prontos para impressão ou envio.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <strong>Excel/CSV:</strong> Dados brutos para manipulação em planilhas.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <strong>API:</strong> Conexão direta com BI (Power BI, Tableau) via API.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Share2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Relatórios de Auditoria</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Gere logs completos de atividade para compliance, mostrando quem acessou, editou ou aprovou cada documento, com data e hora (carimbo de tempo).
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
