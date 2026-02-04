"use client"

import { useState, useRef } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, ChevronRight, Lock } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePermissions } from "@/contexts/permissions-context"
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

function useDraggableScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [hasMoved, setHasMoved] = useState(false)

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return
    setIsDragging(true)
    setHasMoved(false)
    setStartX(e.pageX - ref.current.offsetLeft)
    setScrollLeft(ref.current.scrollLeft)
  }

  const onMouseLeave = () => {
    setIsDragging(false)
  }

  const onMouseUp = () => {
    setIsDragging(false)
    setTimeout(() => setHasMoved(false), 0)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !ref.current) return
    e.preventDefault()
    const x = e.pageX - ref.current.offsetLeft
    const walk = (x - startX) * 1.5
    ref.current.scrollLeft = scrollLeft - walk
    if (Math.abs(walk) > 5) {
      setHasMoved(true)
    }
  }

  const onClickCapture = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove, onClickCapture, isDragging }
}

export function CalculosList({ calculators, categories }: CalculosListProps) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { allowedCalculators } = usePermissions()
  
  // Only use draggable scroll for categories now
  const categoriesScroll = useDraggableScroll<HTMLDivElement>()

  const filteredCalculators = calculators.filter((calc) => {
    const matchesSearch = calc.name.toLowerCase().includes(search.toLowerCase()) || 
                          calc.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "all" || calc.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <LayoutWrapper>
      <div className="space-y-8 pb-8">
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
              className="pl-9 bg-background border-border/60 focus-visible:ring-emerald-500/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div 
            ref={categoriesScroll.ref}
            className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide cursor-grab active:cursor-grabbing select-none w-full px-1 items-center"
            onMouseDown={categoriesScroll.onMouseDown}
            onMouseLeave={categoriesScroll.onMouseLeave}
            onMouseUp={categoriesScroll.onMouseUp}
            onMouseMove={categoriesScroll.onMouseMove}
            onClickCapture={categoriesScroll.onClickCapture}
          >
            {categories.map((category) => {
              const Icon = Icons[category.icon as keyof typeof Icons] || Calculator
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "whitespace-nowrap transition-all",
                    selectedCategory === category.id 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent" 
                      : "hover:bg-accent/50 hover:text-accent-foreground border-border/60"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Calculators Grid List */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 pb-6">
          {filteredCalculators.map((calc) => {
            const Icon = Icons[calc.icon as keyof typeof Icons] || Calculator
            const isAllowed = allowedCalculators === "all" || allowedCalculators.includes(calc.id)

            if (!isAllowed) {
              return (
                <div key={calc.id} className="group relative h-full">
                  <Card className="h-full border-border/40 bg-slate-50/50 dark:bg-slate-900/20 opacity-75 backdrop-blur-sm shadow-sm flex flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                          <Icon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                        </div>
                        <Lock className="w-5 h-5 text-slate-300" />
                      </div>
                      <CardTitle className="text-lg text-slate-500 dark:text-slate-400">
                        {calc.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {calc.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-500 border-border/40">
                        {categories.find(c => c.id === calc.category)?.name}
                      </Badge>
                    </CardContent>
                    
                    {/* Upgrade Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl">
                      <Link href="/configuracoes">
                        <Button variant="default" className="shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                          <Lock className="w-4 h-4 mr-2" />
                          Fazer Upgrade
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              )
            }

            return (
              <div key={calc.id}>
                <Link href={calc.href} className="group h-full block">
                  <Card className="h-full hover:shadow-md transition-all duration-300 border-border/60 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 bg-card hover:bg-accent/5 flex flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {calc.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {calc.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground/80 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {categories.find(c => c.id === calc.category)?.name}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )
          })}
        </div>

        {filteredCalculators.length === 0 && (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/20 rounded-xl border border-dashed border-border/60">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Nenhuma calculadora encontrada.</p>
          </div>
        )}
      </div>
    </LayoutWrapper>
  )
}
