import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WaitlistTable } from "@/components/admin/waitlist-table"
import { WaitlistStats } from "@/components/admin/waitlist-stats"
import { getWaitlistLeads } from "@/lib/admin/waitlist"

export const dynamic = "force-dynamic"

export default async function AdminWaitlistPage() {
  const leads = await getWaitlistLeads()
  
  // Calculate stats
  const total = leads.length
  const pending = leads.filter(l => l.status === "pending").length
  const contacted = leads.filter(l => l.status === "contacted").length
  const converted = leads.filter(l => l.status === "converted").length
  
  // Calculate "today" signups
  const today = new Date().toISOString().split('T')[0]
  const todaySignups = leads.filter(l => l.createdAt.startsWith(today)).length
  
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0

  const stats = {
    total,
    pending,
    contacted,
    converted,
    todaySignups,
    conversionRate
  }

  return (
    <div className="space-y-6 py-10 md:py-14">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">Lista de Espera</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Gerencie leads da lista de espera</p>
      </div>

      <WaitlistStats stats={stats} />

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Todos os Leads</CardTitle>
          <CardDescription>Visualize e gerencie todos os leads cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 flex w-full flex-wrap gap-2 overflow-x-auto">
              <TabsTrigger className="min-w-[140px] flex-1 sm:flex-initial" value="all">
                Todos ({stats.total})
              </TabsTrigger>
              <TabsTrigger className="min-w-[140px] flex-1 sm:flex-initial" value="pending">
                Pendentes ({stats.pending})
              </TabsTrigger>
              <TabsTrigger className="min-w-[140px] flex-1 sm:flex-initial" value="contacted">
                Contatados ({stats.contacted})
              </TabsTrigger>
              <TabsTrigger className="min-w-[140px] flex-1 sm:flex-initial" value="converted">
                Convertidos ({stats.converted})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <WaitlistTable leads={leads} />
            </TabsContent>
            <TabsContent value="pending">
              <WaitlistTable leads={leads.filter((l) => l.status === "pending")} />
            </TabsContent>
            <TabsContent value="contacted">
              <WaitlistTable leads={leads.filter((l) => l.status === "contacted")} />
            </TabsContent>
            <TabsContent value="converted">
              <WaitlistTable leads={leads.filter((l) => l.status === "converted")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
