import { NextResponse } from "next/server"

// Mock database of templates
const templates = [
  {
    id: 1,
    name: "Contrato de Prestação de Serviços - Tech",
    category: "Prestação de Serviços",
    description: "Template completo para contratos de serviços de TI e software, incluindo cláusulas de SLA e confidencialidade.",
    clauses: 18,
    pages: 12,
    downloads: 342,
    rating: 4.8,
    lastUpdated: "2025-01-20",
    featured: true,
    author: "Clausify Legal Team",
    version: "2.1.0",
    tags: ["TI", "SaaS", "Serviços"],
    content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE TECNOLOGIA

Pelo presente instrumento particular, de um lado [CONTRATANTE], e de outro [CONTRATADA], têm entre si justo e contratado o seguinte:

1. DO OBJETO
1.1. O presente contrato tem por objeto a prestação de serviços de desenvolvimento de software e consultoria em TI...

2. DAS OBRIGAÇÕES
2.1. Compete à CONTRATADA desempenhar suas atividades com zelo e diligência...

3. DO PREÇO E PAGAMENTO
3.1. Pelos serviços prestados, a CONTRATANTE pagará à CONTRATADA a importância de...

4. DO PRAZO
4.1. O presente contrato terá vigência de 12 (doze) meses...

[...Restante do contrato...]`
  },
  {
    id: 2,
    name: "Contrato de Locação Comercial",
    category: "Locação",
    description: "Modelo padrão para locação de imóveis comerciais, atualizado com a Lei do Inquilinato vigente.",
    clauses: 22,
    pages: 15,
    downloads: 289,
    rating: 4.6,
    lastUpdated: "2025-01-18",
    featured: true,
    author: "Imobiliária Partner",
    version: "1.5.0",
    tags: ["Imóveis", "Comercial"],
    content: `CONTRATO DE LOCAÇÃO COMERCIAL

LOCADOR: [Nome do Locador]...
LOCATÁRIO: [Nome do Locatário]...

1. DO IMÓVEL
1.1. O objeto deste contrato é a locação do imóvel comercial situado na...

2. DO PRAZO
2.1. A locação terá o prazo de [X] meses, iniciando-se em...

3. DO ALUGUEL
3.1. O aluguel mensal será de R$ [Valor], reajustado anualmente pelo IGPM...

[...Restante do contrato...]`
  },
  {
    id: 3,
    name: "Acordo de Confidencialidade (NDA)",
    category: "Confidencialidade",
    description: "NDA bilateral para proteção de informações sensíveis em negociações preliminares.",
    clauses: 8,
    pages: 5,
    downloads: 567,
    rating: 4.9,
    lastUpdated: "2025-01-15",
    featured: false,
    author: "Clausify Legal Team",
    version: "3.0.0",
    tags: ["NDA", "Sigilo", "Proteção"],
    content: `ACORDO DE CONFIDENCIALIDADE (NDA)

As Partes, [Parte A] e [Parte B], acordam o seguinte:

1. INFORMAÇÕES CONFIDENCIAIS
1.1. Consideram-se Informações Confidenciais todas as informações técnicas, comerciais...

2. DO SIGILO
2.1. As Partes obrigam-se a manter o mais absoluto sigilo...

3. DA VIGÊNCIA
3.1. Este acordo vigorará pelo prazo de 5 (cinco) anos...

[...Restante do contrato...]`
  },
  {
    id: 4,
    name: "Contrato de Fornecimento",
    category: "Fornecimento",
    description: "Template para contratos de fornecimento de produtos com cronograma de entrega e penalidades.",
    clauses: 20,
    pages: 14,
    downloads: 198,
    rating: 4.5,
    lastUpdated: "2025-01-12",
    featured: false,
    author: "Supply Chain Experts",
    version: "1.2.0",
    tags: ["Logística", "Produtos"],
    content: `CONTRATO DE FORNECIMENTO

1. OBJETO
1.1. Fornecimento de produtos conforme Anexo I...

2. ENTREGA
2.1. Os prazos de entrega deverão ser rigorosamente cumpridos...

[...Restante do contrato...]`
  },
  {
    id: 5,
    name: "Termo de Parceria Estratégica",
    category: "Parceria",
    description: "Acordo de parceria comercial e estratégica entre empresas para desenvolvimento conjunto.",
    clauses: 16,
    pages: 10,
    downloads: 156,
    rating: 4.7,
    lastUpdated: "2025-01-10",
    featured: false,
    author: "BizDev Corp",
    version: "1.0.1",
    tags: ["Parceria", "Joint Venture"],
    content: `TERMO DE PARCERIA ESTRATÉGICA

1. OBJETIVOS
1.1. As partes desejam cooperar para o desenvolvimento de...

2. RESPONSABILIDADES
2.1. Caberá à PARCEIRA A...
2.2. Caberá à PARCEIRA B...

[...Restante do contrato...]`
  },
  {
    id: 6,
    name: "Contrato de Investimento - Seed",
    category: "Investimento",
    description: "Template para rodadas de investimento inicial (Seed Money) para Startups.",
    clauses: 25,
    pages: 18,
    downloads: 124,
    rating: 4.8,
    lastUpdated: "2025-01-08",
    featured: true,
    author: "Venture Capital Assoc.",
    version: "2.0.0",
    tags: ["Startup", "Investimento", "Seed"],
    content: `CONTRATO DE INVESTIMENTO (MÚTUO CONVERSÍVEL)

1. DO APORTE
1.1. O INVESTIDOR compromete-se a aportar a quantia de...

2. DA CONVERSÃO
2.1. O mútuo poderá ser convertido em participação societária...

[...Restante do contrato...]`
  }
]

export async function GET() {
  // Simulate network delay for "real-time" feel
  await new Promise((resolve) => setTimeout(resolve, 800))
  
  return NextResponse.json(templates)
}
