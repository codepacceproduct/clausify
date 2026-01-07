import { NextResponse } from "next/server"

// Mock database of standard clauses
const clauses = [
  {
    id: 1,
    title: "Confidencialidade - Padrão",
    category: "Confidencialidade",
    description: "Cláusula padrão de confidencialidade para contratos comerciais, cobrindo 5 anos pós-término.",
    usageCount: 234,
    lastUpdated: "2025-01-15",
    status: "approved",
    risk: "low",
    content: "As partes se comprometem a manter sigilo sobre todas as informações confidenciais trocadas durante a vigência deste contrato, não podendo revelá-las a terceiros sem prévia autorização por escrito.",
    tags: ["Sigilo", "Padrão"]
  },
  {
    id: 2,
    title: "Rescisão Antecipada - Sem Multa",
    category: "Rescisão",
    description: "Permite rescisão sem penalidades mediante aviso prévio de 60 dias.",
    usageCount: 189,
    lastUpdated: "2025-01-10",
    status: "approved",
    risk: "medium",
    content: "Qualquer das partes poderá rescindir este contrato mediante aviso prévio de 60 (sessenta) dias, sem a incidência de qualquer multa ou penalidade.",
    tags: ["Flexível", "Sem Multa"]
  },
  {
    id: 3,
    title: "Garantia de Execução - 10%",
    category: "Garantias",
    description: "Exige garantia financeira de 10% do valor total do contrato.",
    usageCount: 156,
    lastUpdated: "2025-01-08",
    status: "approved",
    risk: "low",
    content: "O CONTRATADO prestará garantia equivalente a 10% (dez por cento) do valor total do contrato para assegurar o fiel cumprimento de suas obrigações.",
    tags: ["Financeiro", "Segurança"]
  },
  {
    id: 4,
    title: "Responsabilidade Civil - Limitada",
    category: "Responsabilidade",
    description: "Limita responsabilidade ao valor do contrato, protegendo contra danos indiretos.",
    usageCount: 142,
    lastUpdated: "2025-01-05",
    status: "review",
    risk: "high",
    content: "A responsabilidade civil das partes fica limitada ao valor total deste contrato, excluindo-se lucros cessantes e danos indiretos.",
    tags: ["Limitação", "Risco"]
  },
  {
    id: 5,
    title: "Propriedade Intelectual - Transferência Total",
    category: "Propriedade Intelectual",
    description: "Transfere todos os direitos de PI desenvolvidos para o contratante.",
    usageCount: 128,
    lastUpdated: "2025-01-03",
    status: "approved",
    risk: "medium",
    content: "Todos os direitos de propriedade intelectual decorrentes dos serviços prestados serão transferidos integral e exclusivamente ao CONTRATANTE.",
    tags: ["Cessão", "Direitos Autorais"]
  },
  {
    id: 6,
    title: "Prazo de Vigência - Indeterminado",
    category: "Vigência",
    description: "Contrato sem prazo determinado, rescisível a qualquer momento com aviso.",
    usageCount: 98,
    lastUpdated: "2025-01-01",
    status: "approved",
    risk: "low",
    content: "Este contrato vigorará por prazo indeterminado, iniciando-se na data de sua assinatura.",
    tags: ["Indeterminado"]
  },
  {
    id: 7,
    title: "Foro de Eleição - São Paulo",
    category: "Disposições Gerais",
    description: "Define a comarca de São Paulo para resolução de conflitos.",
    usageCount: 312,
    lastUpdated: "2025-01-22",
    status: "approved",
    risk: "low",
    content: "As partes elegem o foro da Comarca de São Paulo/SP para dirimir quaisquer dúvidas oriundas deste contrato.",
    tags: ["Jurídico", "Foro"]
  }
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600))
  
  return NextResponse.json(clauses)
}
