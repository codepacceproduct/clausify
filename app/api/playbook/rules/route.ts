import { NextResponse } from "next/server"

// Mock database of analysis rules
const rules = [
  {
    id: 1,
    rule: "Não aceitar índice IGPM para reajuste",
    severity: "high",
    rationale: "O IGPM tem alta volatilidade. Preferir IPCA ou INPC para maior previsibilidade de custos.",
    category: "Financeiro",
    active: true,
    lastUpdated: "2025-01-15"
  },
  {
    id: 2,
    rule: "Exigir cláusula de Proteção de Dados (LGPD)",
    severity: "high",
    rationale: "Obrigatório por lei. A ausência pode gerar multas pesadas da ANPD.",
    category: "Compliance",
    active: true,
    lastUpdated: "2025-01-10"
  },
  {
    id: 3,
    rule: "Multa rescisória não pode exceder 30% do saldo restante",
    severity: "medium",
    rationale: "Valores acima de 30% são frequentemente considerados abusivos pela jurisprudência.",
    category: "Rescisão",
    active: true,
    lastUpdated: "2025-01-08"
  },
  {
    id: 4,
    rule: "Foro de eleição deve ser na sede da Contratante",
    severity: "low",
    rationale: "Facilita a defesa em caso de litígio, reduzindo custos com deslocamento.",
    category: "Jurídico",
    active: true,
    lastUpdated: "2025-01-05"
  },
  {
    id: 5,
    rule: "Prazo de pagamento mínimo de 30 dias após emissão da NF",
    severity: "medium",
    rationale: "Necessário para fluxo de caixa interno. Prazos menores que 15 dias são proibidos.",
    category: "Financeiro",
    active: true,
    lastUpdated: "2025-01-20"
  }
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600))
  
  return NextResponse.json(rules)
}

export async function POST(request: Request) {
  const body = await request.json()
  // Simulate adding
  const newRule = {
    ...body,
    id: rules.length + 1,
    active: true,
    lastUpdated: new Date().toISOString().split('T')[0]
  }
  return NextResponse.json(newRule)
}
