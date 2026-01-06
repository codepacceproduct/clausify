"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  Calculator,
  TrendingUp,
  Home,
  Users,
  CreditCard,
  Briefcase,
  PiggyBank,
  FileText,
  Gavel,
  Scale,
  Landmark,
  HeartPulse,
  ShieldCheck,
  Building2,
  Search,
  BadgeDollarSign,
  Receipt,
  Percent,
  ScrollText,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const categories = [
  { id: "all", name: "Todas as calculadoras", icon: Calculator },
  { id: "trabalhista", name: "Trabalhista", icon: Briefcase },
  { id: "bancario", name: "Bancário", icon: Landmark },
  { id: "tributario", name: "Tributário", icon: Receipt },
  { id: "imobiliario", name: "Imobiliário", icon: Home },
  { id: "familiar", name: "Familiar", icon: Users },
  { id: "consumidor", name: "Consumidor", icon: ShieldCheck },
  { id: "previdenciario", name: "Previdenciário", icon: HeartPulse },
  { id: "civil", name: "Civil", icon: Scale },
  { id: "penal", name: "Penal", icon: Gavel },
  { id: "empresarial", name: "Empresarial", icon: Building2 },
]

const calculators = [
  // Trabalhista
  {
    id: "trabalhista-rescisao",
    name: "Verbas Rescisórias",
    description: "Calcule férias, 13º, aviso prévio, FGTS e multa rescisória",
    icon: Briefcase,
    category: "trabalhista",
    href: "/calculos/trabalhista-completo",
  },
  {
    id: "trabalhista-fgts",
    name: "FGTS e Revisões",
    description: "Cálculo de FGTS com juros, correção monetária e diferenças",
    icon: PiggyBank,
    category: "trabalhista",
    href: "/calculos/fgts",
  },
  {
    id: "trabalhista-horas-extras",
    name: "Horas Extras",
    description: "Calcule horas extras, adicional noturno e DSR sobre extras",
    icon: Clock,
    category: "trabalhista",
    href: "/calculos/horas-extras",
  },
  {
    id: "trabalhista-insalubridade",
    name: "Insalubridade e Periculosidade",
    description: "Calcule adicionais de insalubridade e periculosidade",
    icon: AlertTriangle,
    category: "trabalhista",
    href: "/calculos/insalubridade",
  },

  // Bancário
  {
    id: "bancario-rmc-rcc",
    name: "RMC e RCC INSS",
    description: "Revisão de empréstimos com taxa BACEN e juros abusivos",
    icon: BadgeDollarSign,
    category: "bancario",
    href: "/calculos/rmc-rcc",
  },
  {
    id: "bancario-superendividamento",
    name: "Superendividamento",
    description: "Análise de capacidade de pagamento e renegociação",
    icon: CreditCard,
    category: "bancario",
    href: "/calculos/superendividamento",
  },
  {
    id: "bancario-financiamento",
    name: "Revisão de Financiamento",
    description: "Identifique juros abusivos em financiamentos",
    icon: TrendingUp,
    category: "bancario",
    href: "/calculos/revisao-financiamento",
  },
  {
    id: "bancario-amortizacao",
    name: "Amortização SAC e PRICE",
    description: "Compare sistemas de amortização e calcule parcelas",
    icon: Calculator,
    category: "bancario",
    href: "/calculos/amortizacao",
  },

  // Tributário
  {
    id: "tributario-irpf",
    name: "IRPF",
    description: "Calcule Imposto de Renda Pessoa Física",
    icon: Receipt,
    category: "tributario",
    href: "/calculos/irpf",
  },
  {
    id: "tributario-inss",
    name: "Contribuição INSS",
    description: "Calcule contribuições previdenciárias",
    icon: FileText,
    category: "tributario",
    href: "/calculos/inss",
  },
  {
    id: "tributario-pis-cofins",
    name: "PIS/COFINS",
    description: "Cálculo de PIS e COFINS sobre faturamento",
    icon: Percent,
    category: "tributario",
    href: "/calculos/pis-cofins",
  },

  // Imobiliário
  {
    id: "imobiliario-aluguel",
    name: "Dívidas de Aluguel",
    description: "Calcule débitos com multa, juros e correção",
    icon: Home,
    category: "imobiliario",
    href: "/calculos/divida-aluguel",
  },
  {
    id: "imobiliario-itbi",
    name: "ITBI",
    description: "Calcule Imposto de Transmissão de Bens Imóveis",
    icon: Building2,
    category: "imobiliario",
    href: "/calculos/itbi",
  },
  {
    id: "imobiliario-iptu",
    name: "IPTU Atrasado",
    description: "Calcule débitos de IPTU com multa e juros",
    icon: ScrollText,
    category: "imobiliario",
    href: "/calculos/iptu",
  },

  // Familiar
  {
    id: "familiar-pensao",
    name: "Pensão Alimentícia",
    description: "Calcule valores com percentuais e histórico",
    icon: Users,
    category: "familiar",
    href: "/calculos/pensao-alimenticia",
  },
  {
    id: "familiar-partilha",
    name: "Partilha de Bens",
    description: "Calcule divisão de bens em divórcio ou inventário",
    icon: Scale,
    category: "familiar",
    href: "/calculos/partilha-bens",
  },

  // Consumidor
  {
    id: "consumidor-indenizacao",
    name: "Indenização Moral",
    description: "Calcule valores de dano moral e material",
    icon: ShieldCheck,
    category: "consumidor",
    href: "/calculos/indenizacao",
  },

  // Previdenciário
  {
    id: "previdenciario-aposentadoria",
    name: "Tempo de Aposentadoria",
    description: "Calcule tempo de contribuição e idade para aposentadoria",
    icon: HeartPulse,
    category: "previdenciario",
    href: "/calculos/aposentadoria",
  },

  // Civil
  {
    id: "civil-correcao",
    name: "Correção Monetária",
    description: "Corrija valores com INPC, IGP-M, IPCA, TR e SELIC",
    icon: TrendingUp,
    category: "civil",
    href: "/calculos/correcao-monetaria",
  },
  {
    id: "civil-juros",
    name: "Juros Moratórios",
    description: "Calcule juros de mora legais e contratuais",
    icon: Percent,
    category: "civil",
    href: "/calculos/juros-moratorios",
  },

  // Penal
  {
    id: "penal-pena",
    name: "Cálculo de Pena",
    description: "Calcule progressão de regime e detração",
    icon: Gavel,
    category: "penal",
    href: "/calculos/calculo-pena",
  },

  // Empresarial
  {
    id: "empresarial-capital",
    name: "Capital Social",
    description: "Calcule distribuição de quotas e participação",
    icon: Building2,
    category: "empresarial",
    href: "/calculos/capital-social",
  },
]

export default function CalculosPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCalculators = calculators.filter((calc) => {
    const matchesCategory = selectedCategory === "all" || calc.category === selectedCategory
    const matchesSearch =
      calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Cálculos Jurídicos</h1>
            <p className="text-muted-foreground">Calculadoras especializadas para agilizar tarefas do dia a dia</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar calculadora..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                selectedCategory === category.id
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-card border text-muted-foreground hover:border-emerald-500/30 hover:text-foreground",
              )}
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCalculators.map((calculator) => (
            <Link key={calculator.id} href={calculator.href}>
              <Card className="p-5 hover:shadow-md transition-all duration-200 hover:border-emerald-500/30 group cursor-pointer h-full">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <calculator.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1 group-hover:text-emerald-600 transition-colors">
                      {calculator.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{calculator.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredCalculators.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma calculadora encontrada</p>
          </div>
        )}
      </div>
    </LayoutWrapper>
  )
}
