import { PageHeader } from "@/components/landing/page-header"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Termos de Uso</h1>
            <p className="text-gray-400">Última atualização: 28 de Novembro de 2024</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
                <p>
                  Ao acessar e usar a plataforma Clausify, você concorda em cumprir estes Termos de Uso. Se não
                  concordar com qualquer parte destes termos, não utilize nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Descrição do Serviço</h2>
                <p>
                  A Clausify oferece uma plataforma de análise de contratos jurídicos utilizando inteligência
                  artificial. Nossos serviços incluem:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Análise automatizada de contratos</li>
                  <li>Identificação de riscos e cláusulas críticas</li>
                  <li>Gestão de portfólio de contratos</li>
                  <li>Workflow de aprovação</li>
                  <li>Integrações com ferramentas externas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Uso Aceitável</h2>
                <p>Você concorda em:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Fornecer informações precisas e atualizadas</li>
                  <li>Manter a confidencialidade de suas credenciais</li>
                  <li>Não compartilhar sua conta com terceiros</li>
                  <li>Não usar o serviço para fins ilegais</li>
                  <li>Não tentar violar a segurança da plataforma</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Propriedade Intelectual</h2>
                <p>
                  Todos os direitos de propriedade intelectual da plataforma Clausify, incluindo software, algoritmos,
                  interface e conteúdo, pertencem exclusivamente à Clausify. Os contratos enviados por você permanecem
                  de sua propriedade.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Limitação de Responsabilidade</h2>
                <p>
                  A Clausify fornece análises automatizadas como ferramenta de apoio à decisão. As análises não
                  substituem a consultoria jurídica profissional. Não nos responsabilizamos por:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Decisões tomadas com base nas análises</li>
                  <li>Erros ou omissões nas análises automatizadas</li>
                  <li>Danos indiretos ou consequenciais</li>
                  <li>Interrupções temporárias do serviço</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Pagamento e Assinatura</h2>
                <p>
                  Os planos são cobrados conforme a periodicidade escolhida (mensal ou anual). Você pode cancelar sua
                  assinatura a qualquer momento, com acesso mantido até o final do período pago.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Modificações</h2>
                <p>
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão
                  comunicadas por email com 30 dias de antecedência.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Foro</h2>
                <p>
                  Este contrato é regido pelas leis brasileiras. Fica eleito o foro da comarca de São Paulo - SP para
                  dirimir quaisquer controvérsias.
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
