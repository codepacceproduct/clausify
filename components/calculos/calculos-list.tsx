"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
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
  Receipt,
  Percent,
  ScrollText,
  Clock,
  AlertTriangle,
  BadgeDollarSign,
} from "lucide-react"

const Icons = {
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
  Receipt,
  Percent,
  ScrollText,
  Clock,
  AlertTriangle,
  BadgeDollarSign,
}

interface CalculatorItem {
  id: string
  name: string
  description: string
  icon: string
  category: string
  href: string
}

interface Category {
  id: string
  name: string
  icon: string
}

interface CalculosListProps {
  calculators: CalculatorItem[]
  categories: Category[]
}

export function CalculosList({ calculators, categories }: CalculosListProps) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredCalculators = calculators.filter((calc) => {
    const matchesSearch = calc.name.toLowerCase().includes(search.toLowerCase()) || 
                          calc.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "all" || calc.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Calculadoras Jurídicas</h1>
          <p className="text-muted-foreground mt-1">
            Ferramentas precisas para agilizar seus cálculos trabalhistas, cíveis e previdenciários.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar calculadora..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((category) => {
              const Icon = Icons[category.icon as keyof typeof Icons] || Calculator
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.map((calc) => {
            const Icon = Icons[calc.icon as keyof typeof Icons] || Calculator
            return (
              <Link key={calc.id} href={calc.href} className="group">
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {calc.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {calc.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {categories.find(c => c.id === calc.category)?.name}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {filteredCalculators.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma calculadora encontrada.</p>
          </div>
        )}
      </div>
    </LayoutWrapper>
  )
}
