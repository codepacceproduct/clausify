import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader />

      <main className="pt-24 md:pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Política de Privacidade</h1>
            <p className="text-gray-400">Última atualização: 28 de Novembro de 2024</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Introdução</h2>
                <p>
                  A Clausify (&quot;nós&quot;, &quot;nosso&quot; ou &quot;empresa&quot;) está comprometida em proteger a privacidade dos usuários de
                  nossa plataforma. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e
                  protegemos suas informações pessoais.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Informações que Coletamos</h2>
                <p>Coletamos os seguintes tipos de informações:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    <strong>Dados de Cadastro:</strong> Nome, email, telefone, empresa e cargo.
                  </li>
                  <li>
                    <strong>Dados de Uso:</strong> Informações sobre como você utiliza nossa plataforma.
                  </li>
                  <li>
                    <strong>Contratos:</strong> Documentos enviados para análise são processados de forma segura.
                  </li>
                  <li>
                    <strong>Dados Técnicos:</strong> Endereço IP, tipo de navegador e dispositivo.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Como Usamos suas Informações</h2>
                <p>Utilizamos suas informações para:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Fornecer e melhorar nossos serviços de análise de contratos</li>
                  <li>Personalizar sua experiência na plataforma</li>
                  <li>Enviar comunicações relevantes sobre o serviço</li>
                  <li>Garantir a segurança da plataforma</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Compartilhamento de Dados</h2>
                <p>Não vendemos seus dados pessoais. Podemos compartilhar informações apenas com:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Provedores de serviço que nos auxiliam nas operações</li>
                  <li>Autoridades quando exigido por lei</li>
                  <li>Parceiros de negócio, com seu consentimento expresso</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Segurança dos Dados</h2>
                <p>Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Criptografia AES-256 para dados em repouso</li>
                  <li>TLS 1.3 para dados em trânsito</li>
                  <li>Autenticação de dois fatores disponível</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Backups regulares e redundantes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Seus Direitos</h2>
                <p>De acordo com a LGPD, você tem direito a:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incorretos</li>
                  <li>Solicitar exclusão de dados</li>
                  <li>Revogar consentimento</li>
                  <li>Portabilidade de dados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Contato</h2>
                <p>Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato:</p>
                <p className="mt-4">
                  <strong>Email:</strong> privacidade@clausify.com.br
                  <br />
                  <strong>DPO:</strong> Ana Ferreira
                  <br />
                  <strong>Endereço:</strong> Av. Paulista, 1000, São Paulo - SP
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
