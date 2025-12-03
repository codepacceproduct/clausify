import { LayoutWrapper } from "@/components/layout-wrapper"
import { GeneralSettings } from "@/components/general-settings"
import { NotificationSettings } from "@/components/notification-settings"
import { SecuritySettings } from "@/components/security-settings"
import { IntegrationSettings } from "@/components/integration-settings"
import { TeamsSettings } from "@/components/teams-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabaseServer } from "@/lib/supabase-server"

async function getInitialSettings() {
  const email = process.env.NEXT_PUBLIC_DEFAULT_EMAIL ?? "caiolncoln@gmail.com"
  if (!email) return { profile: null, organization: null }
  let profile: any = null
  {
    const { data: profiles } = await supabaseServer
      .from("profiles")
      .select("id, email, phone, name, surname, regional_preferences, organization_id, avatar_url")
      .eq("email", email)
      .limit(1)
    profile = profiles?.[0] ?? null
  }
  if (!profile) {
    const { data: authUsers } = await supabaseServer
      .from("auth.users")
      .select("id, email")
      .eq("email", email)
      .limit(1)
    const authUser = authUsers?.[0]
    if (authUser) {
      const { data: created } = await supabaseServer
        .from("profiles")
        .upsert({ id: authUser.id, email: authUser.email }, { onConflict: "id" })
        .select()
      profile = created?.[0] ?? null
    }
  }
  let organization: any = null
  if (profile?.organization_id) {
    const { data: orgs } = await supabaseServer
      .from("organizations")
      .select("id, name, industry, size, timezone, locale")
      .eq("id", profile.organization_id)
      .limit(1)
    organization = orgs?.[0] ?? null
  }
  return { profile, organization }
}

export default async function SettingsPage() {
  const { profile, organization } = await getInitialSettings()
  return (
    <LayoutWrapper>
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Gerencie as configurações do sistema</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="teams">Equipes</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <GeneralSettings initialProfile={profile ?? undefined} initialOrganization={organization ?? undefined} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <IntegrationSettings />
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <TeamsSettings />
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  )
}
