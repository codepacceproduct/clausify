import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, Upload, FileType, HardDrive } from "lucide-react"
import Link from "next/link"

export default function UploadDocumentosPage() {
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

          <h1 className="text-4xl font-bold mb-6">Upload de Documentos</h1>
          <p className="text-xl text-gray-400 mb-12">
            Saiba como importar seus contratos e documentos para a plataforma Clausify de forma rápida e segura.
          </p>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Métodos de Importação</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Existem duas formas principais de enviar documentos para análise:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-2">Drag & Drop</h4>
                      <p className="text-sm text-gray-400">Arraste seus arquivos diretamente para a área de upload no dashboard.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-semibold text-white mb-2">Seleção de Arquivo</h4>
                      <p className="text-sm text-gray-400">Clique no botão "Upload" para navegar pelos arquivos do seu computador.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <FileType className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Formatos Suportados</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    A Clausify suporta os formatos de documentos jurídicos mais comuns. Para melhores resultados, certifique-se de que o texto seja selecionável.
                  </p>
                  <ul className="space-y-2 text-gray-400 ml-4">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      PDF (Nativo ou OCR)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Microsoft Word (.docx, .doc)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Texto Simples (.txt, .rtf)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <HardDrive className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Limites e Armazenamento</h2>
                  <p className="text-gray-400 leading-relaxed">
                    O tamanho máximo por arquivo é de <strong>50MB</strong>. Todos os documentos são criptografados em repouso e em trânsito, garantindo a confidencialidade das suas informações jurídicas.
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
