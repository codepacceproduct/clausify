export const calculatorCategories = [
  { id: "all", name: "Todas as calculadoras", icon: "Calculator" },
  { id: "trabalhista", name: "Trabalhista", icon: "Briefcase" },
  { id: "bancario", name: "Bancário", icon: "Landmark" },
  { id: "tributario", name: "Tributário", icon: "Receipt" },
  { id: "imobiliario", name: "Imobiliário", icon: "Home" },
  { id: "familiar", name: "Familiar", icon: "Users" },
  { id: "consumidor", name: "Consumidor", icon: "ShieldCheck" },
  { id: "previdenciario", name: "Previdenciário", icon: "HeartPulse" },
  { id: "civil", name: "Civil", icon: "Scale" },
  { id: "penal", name: "Penal", icon: "Gavel" },
  { id: "empresarial", name: "Empresarial", icon: "Building2" },
]

export const calculatorsList = [
  // Trabalhista
  {
    id: "trabalhista-rescisao",
    name: "Verbas Rescisórias",
    description: "Calcule férias, 13º, aviso prévio, FGTS e multa rescisória",
    icon: "Briefcase",
    category: "trabalhista",
    href: "/calculos/trabalhista-completo",
  },
  {
    id: "trabalhista-fgts",
    name: "FGTS e Revisões",
    description: "Cálculo de FGTS com juros, correção monetária e diferenças",
    icon: "PiggyBank",
    category: "trabalhista",
    href: "/calculos/fgts",
  },
  {
    id: "trabalhista-horas-extras",
    name: "Horas Extras",
    description: "Calcule horas extras, adicional noturno e DSR sobre extras",
    icon: "Clock",
    category: "trabalhista",
    href: "/calculos/horas-extras",
  },
  {
    id: "trabalhista-insalubridade",
    name: "Insalubridade e Periculosidade",
    description: "Calcule adicionais de insalubridade e periculosidade",
    icon: "AlertTriangle",
    category: "trabalhista",
    href: "/calculos/insalubridade",
  },

  // Bancário
  {
    id: "bancario-rmc-rcc",
    name: "RMC e RCC INSS",
    description: "Revisão de empréstimos com taxa BACEN e juros abusivos",
    icon: "BadgeDollarSign",
    category: "bancario",
    href: "/calculos/rmc-rcc",
  },
  {
    id: "bancario-superendividamento",
    name: "Superendividamento",
    description: "Análise de capacidade de pagamento e renegociação",
    icon: "CreditCard",
    category: "bancario",
    href: "/calculos/superendividamento",
  },
  {
    id: "bancario-financiamento",
    name: "Revisão de Financiamento",
    description: "Identifique juros abusivos em financiamentos",
    icon: "TrendingUp",
    category: "bancario",
    href: "/calculos/revisao-financiamento",
  },
  {
    id: "bancario-amortizacao",
    name: "Amortização SAC e PRICE",
    description: "Compare sistemas de amortização e calcule parcelas",
    icon: "Calculator",
    category: "bancario",
    href: "/calculos/amortizacao",
  },

  // Tributário
  {
    id: "tributario-irpf",
    name: "IRPF",
    description: "Calcule Imposto de Renda Pessoa Física",
    icon: "Receipt",
    category: "tributario",
    href: "/calculos/irpf",
  },
  {
    id: "tributario-inss",
    name: "Contribuição INSS",
    description: "Calcule contribuições previdenciárias",
    icon: "FileText",
    category: "tributario",
    href: "/calculos/inss",
  },
  {
    id: "tributario-pis-cofins",
    name: "PIS/COFINS",
    description: "Cálculo de PIS e COFINS sobre faturamento",
    icon: "Percent",
    category: "tributario",
    href: "/calculos/pis-cofins",
  },

  // Imobiliário
  {
    id: "imobiliario-aluguel",
    name: "Dívidas de Aluguel",
    description: "Calcule débitos com multa, juros e correção",
    icon: "Home",
    category: "imobiliario",
    href: "/calculos/divida-aluguel",
  },
  {
    id: "imobiliario-itbi",
    name: "ITBI",
    description: "Calcule Imposto de Transmissão de Bens Imóveis",
    icon: "Building2",
    category: "imobiliario",
    href: "/calculos/itbi",
  },
  {
    id: "imobiliario-iptu",
    name: "IPTU Atrasado",
    description: "Calcule débitos de IPTU com multa e juros",
    icon: "ScrollText",
    category: "imobiliario",
    href: "/calculos/iptu",
  },

  // Familiar
  {
    id: "familiar-pensao",
    name: "Pensão Alimentícia",
    description: "Calcule valores com percentuais e histórico",
    icon: "Users",
    category: "familiar",
    href: "/calculos/pensao-alimenticia",
  },
  {
    id: "familiar-partilha",
    name: "Partilha de Bens",
    description: "Calcule divisão de bens em divórcio ou inventário",
    icon: "Scale",
    category: "familiar",
    href: "/calculos/partilha-bens",
  },

  // Consumidor
  {
    id: "consumidor-indenizacao",
    name: "Indenização Moral",
    description: "Calcule valores de dano moral e material",
    icon: "ShieldCheck",
    category: "consumidor",
    href: "/calculos/indenizacao",
  },

  // Previdenciário
  {
    id: "previdenciario-aposentadoria",
    name: "Tempo de Aposentadoria",
    description: "Calcule tempo de contribuição e idade para aposentadoria",
    icon: "HeartPulse",
    category: "previdenciario",
    href: "/calculos/aposentadoria",
  },

  // Civil
  {
    id: "civil-correcao",
    name: "Correção Monetária",
    description: "Atualize valores pelo IGPM, IPCA, INPC e outros índices",
    icon: "Scale",
    category: "civil",
    href: "/calculos/correcao-monetaria",
  },
  {
    id: "civil-juros",
    name: "Juros Moratórios",
    description: "Calcule juros legais simples ou compostos",
    icon: "Percent",
    category: "civil",
    href: "/calculos/juros-moratorios",
  },

  // Penal
  {
    id: "penal-pena",
    name: "Cálculo de Pena",
    description: "Dosimetria, progressão de regime e detração",
    icon: "Gavel",
    category: "penal",
    href: "/calculos/calculo-pena",
  },

  // Empresarial
  {
    id: "empresarial-capital",
    name: "Capital Social",
    description: "Atualização de quotas e distribuição de lucros",
    icon: "Building2",
    category: "empresarial",
    href: "/calculos/capital-social",
  },
]
