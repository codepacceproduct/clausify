import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WaitlistTable } from "@/components/admin/waitlist-table"
import { WaitlistStats } from "@/components/admin/waitlist-stats"
import { getWaitlistLeads, getWaitlistStats } from "@/lib/admin/waitlist"

export const dynamic = "force-dynamic"

export default async function AdminWaitlistPage() {
  const leads = await getWaitlistLeads()
  const stats = await getWaitlistStats()

  return (
    <div className="space-y-6">
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
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">Todos ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pendentes ({stats.pending})</TabsTrigger>
              <TabsTrigger value="contacted">Contatados ({stats.contacted})</TabsTrigger>
              <TabsTrigger value="converted">Convertidos ({stats.converted})</TabsTrigger>
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
