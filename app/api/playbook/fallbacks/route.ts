import { NextResponse } from "next/server"

// Mock database of fallback clauses
const fallbacks = [
  {
    id: "FB-001",
    name: "Limitação de Responsabilidade - Cap Financeiro",
    category: "Responsabilidade",
    originalClause: "A parte não será responsável por danos indiretos ou consequenciais, sendo sua responsabilidade ilimitada apenas para dolo ou culpa grave.",
    fallbackClause:
      "A responsabilidade total de cada parte será limitada a 100% (cem por cento) do valor total pago nos últimos 12 (doze) meses anteriores ao evento danoso, excluindo-se danos indiretos, lucros cessantes ou danos consequenciais, exceto em casos de dolo, fraude ou violação de propriedade intelectual.",
    risk: "medium",
    usageCount: 156,
    lastUsed: "2025-01-25",
    notes: "Usar quando a contraparte não aceitar limitação total ou exclusão de responsabilidade. É um meio-termo comum em contratos de SaaS.",
    tags: ["SaaS", "Financeiro", "Comum"]
  },
  {
    id: "FB-002",
    name: "Prazo de Pagamento - 45 Dias",
    category: "Financeiro",
    originalClause: "Pagamento à vista na assinatura do contrato ou em até 10 dias da emissão da Nota Fiscal.",
    fallbackClause: "O pagamento deverá ser efetuado em até 45 (quarenta e cinco) dias após a emissão e recebimento da Nota Fiscal competente, mediante depósito bancário ou boleto.",
    risk: "low",
    usageCount: 89,
    lastUsed: "2025-01-27",
    notes: "Alternativa para grandes empresas que possuem ciclos de pagamento mais longos (Net 45).",
    tags: ["Enterprise", "Pagamento"]
  },
  {
    id: "FB-003",
    name: "Confidencialidade - 2 Anos",
    category: "Confidencialidade",
    originalClause: "As informações confidenciais serão mantidas em sigilo por tempo indeterminado ou 5 anos.",
    fallbackClause:
      "As obrigações de confidencialidade permanecerão vigentes durante o prazo deste Contrato e por um período de 2 (dois) anos após o seu término ou rescisão.",
    risk: "medium",
    usageCount: 42,
    lastUsed: "2025-01-20",
    notes: "Aceitável se a informação não for crítica (segredos industriais). Para segredos comerciais, tentar manter 5 anos.",
    tags: ["Sigilo", "Prazo"]
  },
  {
    id: "FB-004",
    name: "Rescisão - Justa Causa Ampliada",
    category: "Rescisão",
    originalClause: "Rescisão apenas por inadimplemento não sanado em 30 dias.",
    fallbackClause: "Qualquer parte poderá rescindir este contrato imediatamente, mediante notificação escrita, em caso de violação material não sanada em 30 dias, falência, recuperação judicial ou insolvência da outra parte.",
    risk: "low",
    usageCount: 67,
    lastUsed: "2025-01-28",
    notes: "Adiciona proteção contra insolvência da contraparte.",
    tags: ["Segurança", "Proteção"]
  },
  {
    id: "FB-005",
    name: "Multa por Atraso - 2%",
    category: "Penalidades",
    originalClause: "Multa de 10% sobre o valor da parcela em atraso.",
    fallbackClause: "O atraso no pagamento sujeitará a parte inadimplente a multa moratória de 2% (dois por cento) e juros de 1% (um por cento) ao mês, calculados pro rata die.",
    risk: "low",
    usageCount: 210,
    lastUsed: "2025-01-22",
    notes: "Padrão de mercado (Código de Defesa do Consumidor e praxe comercial). Difícil de contestar.",
    tags: ["Padrão", "Financeiro"]
  },
  {
    id: "FB-006",
    name: "Foro - Arbitragem (Câmara de Comércio)",
    category: "Foro",
    originalClause: "Fica eleito o foro da Comarca de São Paulo/SP.",
    fallbackClause:
      "Qualquer disputa decorrente deste contrato será resolvida definitivamente por arbitragem, de acordo com o Regulamento da Câmara de Comércio Brasil-Canadá (CCBC), por um ou mais árbitros nomeados na forma do referido Regulamento.",
    risk: "medium",
    usageCount: 12,
    lastUsed: "2025-01-15",
    notes: "Recomendado apenas para contratos acima de R$ 1MM devido aos custos da arbitragem.",
    tags: ["Arbitragem", "Alto Valor"]
  }
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700))
  
  return NextResponse.json(fallbacks)
}
