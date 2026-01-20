import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, Radio, Shield, Activity } from "lucide-react"
import Link from "next/link"

export default function WebhooksPage() {
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

          <h1 className="text-4xl font-bold mb-6">Webhooks</h1>
          <p className="text-xl text-gray-400 mb-12">
            Receba notificações em tempo real no seu sistema quando eventos importantes ocorrerem na Clausify.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Eventos Disponíveis</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Você pode se inscrever para ouvir os seguintes eventos:
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-3 text-sm text-gray-400">
                    <li className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <strong className="block text-white mb-1">contract.analyzed</strong>
                      Disparado quando a análise de IA é concluída.
                    </li>
                    <li className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <strong className="block text-white mb-1">risk.alert</strong>
                      Quando um risco crítico é detectado.
                    </li>
                    <li className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <strong className="block text-white mb-1">contract.signed</strong>
                      Quando um documento é assinado eletronicamente.
                    </li>
                    <li className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <strong className="block text-white mb-1">deadline.approaching</strong>
                      Aviso de vencimento de prazo.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Formato do Payload</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Os webhooks são enviados como requisições POST com um corpo JSON. Exemplo para <code>contract.analyzed</code>:
                  </p>
                  <div className="bg-[#111] p-4 rounded-xl border border-white/10 overflow-x-auto">
                    <pre className="text-sm font-mono text-gray-300">
{`{
  "event": "contract.analyzed",
  "data": {
    "contract_id": "cnt_123456",
    "score": 85,
    "risk_level": "low",
    "completed_at": "2024-03-20T14:30:00Z"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Verificação de Assinatura</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Para garantir que o webhook veio realmente da Clausify, verifique o header <code>X-Clausify-Signature</code> usando sua chave secreta de webhook (HMAC SHA-256).
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
