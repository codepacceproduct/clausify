import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, MoreHorizontal, ArrowUpRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

import { cn } from "@/lib/utils"

type Risk = "low" | "medium" | "high"

async function fetchRecentContracts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("contracts")
    .select("id, name, type, created_at, risk_level, status")
    .order("created_at", { ascending: false })
    .limit(5)

  const statusToRisk: Record<string, Risk> = {
    analyzed: "low",
    uploaded: "medium",
    failed: "high",
  }

  return (
    data?.map((row) => ({
      id: row.id,
      client: row.name ?? "Contrato Sem Nome",
      type: row.type ?? "Geral",
      risk: (row.risk_level as Risk) || (statusToRisk[row.status ?? "uploaded"] ?? "medium"),
      date: new Date(row.created_at).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      status: row.status === "analyzed" ? "Analisado" : row.status === "uploaded" ? "Pendente" : "Erro",
    })) ?? []
  )
}

export async function RecentContracts() {
  const contracts = await fetchRecentContracts()
  
  return (
    <Card className="h-full bg-card text-card-foreground border-border shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold tracking-tight">Contratos Recentes</CardTitle>
          <CardDescription>Últimas análises e uploads realizados</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="hidden sm:flex" asChild>
          <Link href="/contratos">
            Ver todos <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {contracts.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Nenhum contrato recente encontrado.</p>
            </div>
          )}
          {contracts.map((contract, index) => (
            <div
              key={contract.id || index}
              className="group flex items-center justify-between p-4 hover:bg-muted/30 rounded-lg transition-all border border-transparent hover:border-border/50 hover:shadow-sm"
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                  contract.type === 'Geral' ? "bg-primary/10 text-primary border-primary/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                )}>
                  <FileText className="h-5 w-5" />
                </div>
                <div className="space-y-1 overflow-hidden">
                  <p className="truncate font-medium leading-none text-foreground group-hover:text-primary transition-colors">
                    {contract.client}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{contract.type}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                    <span>{contract.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize shadow-sm",
                    contract.risk === "low"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : contract.risk === "medium"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  )}
                >
                  {contract.risk === "low" ? "Baixo Risco" : contract.risk === "medium" ? "Risco Médio" : "Alto Risco"}
                </Badge>
                
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                  <Link href={`/contratos/${contract.id}`}>
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Ações</span>
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
