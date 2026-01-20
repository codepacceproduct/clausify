import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, Upload, FileText, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function UploadPrimeiroContratoPage() {
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

          <h1 className="text-4xl font-bold mb-6">Como fazer upload do primeiro contrato</h1>
          <p className="text-xl text-gray-400 mb-12">
            Passo a passo para enviar seu primeiro documento para análise na Clausify.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">1. Acesse o Dashboard</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    No menu lateral esquerdo, clique no botão principal <strong>"Novo Documento"</strong> ou arraste um arquivo diretamente para a área central.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">2. Selecione o Tipo de Documento</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Para ajudar a IA a ser mais precisa, identifique se é um:
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-3 text-sm text-gray-400">
                    <li className="p-3 bg-white/5 rounded-lg border border-white/10">Contrato de Prestação de Serviços</li>
                    <li className="p-3 bg-white/5 rounded-lg border border-white/10">NDA (Acordo de Confidencialidade)</li>
                    <li className="p-3 bg-white/5 rounded-lg border border-white/10">Contrato de Trabalho</li>
                    <li className="p-3 bg-white/5 rounded-lg border border-white/10">Locação de Imóvel</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">3. Aguarde a Análise</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Em poucos segundos, a Clausify processará o texto e exibirá o Score de Risco inicial. Você poderá clicar no documento para ver os detalhes cláusula por cláusula.
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
