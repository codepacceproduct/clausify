import { LayoutWrapper } from "@/components/layout-wrapper"
import { GeneralSettings } from "@/components/general-settings"
import { NotificationSettings } from "@/components/notification-settings"
import { SecuritySettings } from "@/components/security-settings"
import { IntegrationSettings } from "@/components/integration-settings"
import { TeamsSettings } from "@/components/teams-settings"
import { AccessControl } from "@/components/access-control"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

async function getInitialSettings() {
  const cookieStore = await cookies()
  const email = cookieStore.get("user_email")?.value || null
  if (!email) {
    redirect("/login")
  }
  let profile: any = null
  {
    const { data: profiles } = await supabaseServer
      .from("profiles")
      .select("id, email, phone, name, surname, regional_preferences, organization_id, avatar_url, role")
      .eq("email", email)
      .limit(1)
    profile = profiles?.[0] ?? null
  }
  if (!profile) {
    redirect("/login")
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

async function getRolePermissionsForProfile(profile: any): Promise<Record<string, boolean>> {
  if (!profile?.organization_id) return {}
  const orgId = profile.organization_id as string
  const role = String(profile?.role || "member").toLowerCase()
  const modules = [
    "dashboard",
    "contratos",
    "portfolio",
    "aprovacoes",
    "calendario",
    "versionamento",
    "playbook",
    "seguranca",
    "assinaturas",
    "configuracoes",
    "configuracoes.general",
    "configuracoes.notifications",
    "configuracoes.security",
    "configuracoes.integrations",
    "configuracoes.teams",
    "integracoes",
    "auditoria",
    "equipes",
    "analises",
  ]
  const defaults: Record<string, Record<string, boolean>> = { admin: {}, moderator: {}, member: {} }
  for (const m of modules) {
    defaults.admin[m] = true
    defaults.moderator[m] = !["seguranca"].includes(m)
    defaults.member[m] = !["seguranca","configuracoes","aprovacoes","auditoria"].includes(m)
  }
  defaults.moderator["configuracoes"] = true
  defaults.moderator["configuracoes.general"] = true
  defaults.moderator["configuracoes.notifications"] = true
  defaults.moderator["configuracoes.integrations"] = true
  defaults.moderator["configuracoes.teams"] = true
  defaults.moderator["configuracoes.security"] = false
  for (const k of [
    "configuracoes.general",
    "configuracoes.notifications",
    "configuracoes.security",
    "configuracoes.integrations",
    "configuracoes.teams",
  ]) {
    defaults.member[k] = false
  }
  const { data } = await supabaseServer
    .from("role_permissions")
    .select("module, allowed")
    .eq("organization_id", orgId)
    .eq("role", role)
  const map: Record<string, boolean> = { ...defaults[role] }
  for (const row of data || []) {
    const key = String(row.module)
    if (role === "admin") {
      map[key] = true
    } else {
      map[key] = !!row.allowed
    }
  }
  if (role === "admin") {
    for (const m of modules) map[m] = true
  }
  return map
}

export default async function SettingsPage() {
  const { profile, organization } = await getInitialSettings()
  const perms = await getRolePermissionsForProfile(profile)
  if (perms.configuracoes === false) {
    redirect("/dashboard")
  }
  const order = ["general","notifications","security","integrations","teams"]
  const tabKeyToModule: Record<string, string> = {
    general: "configuracoes.general",
    notifications: "configuracoes.notifications",
    security: "configuracoes.security",
    integrations: "configuracoes.integrations",
    teams: "configuracoes.teams",
  }
  const defaultTab = order.find((t) => perms[tabKeyToModule[t]] !== false) || "general"
  return (
    <LayoutWrapper>
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Gerencie as configurações do sistema</p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex">
          {perms["configuracoes.general"] !== false && (<TabsTrigger value="general">Geral</TabsTrigger>)}
          {perms["configuracoes.notifications"] !== false && (<TabsTrigger value="notifications">Notificações</TabsTrigger>)}
          {perms["configuracoes.security"] !== false && (<TabsTrigger value="security">Segurança</TabsTrigger>)}
          {perms["configuracoes.integrations"] !== false && (<TabsTrigger value="integrations">Integrações</TabsTrigger>)}
          {perms["configuracoes.teams"] !== false && (<TabsTrigger value="teams">Equipes</TabsTrigger>)}
        </TabsList>

        {perms["configuracoes.general"] !== false && (
          <TabsContent value="general" className="space-y-6">
            <GeneralSettings initialProfile={profile ?? undefined} initialOrganization={organization ?? undefined} />
          </TabsContent>
        )}

        {perms["configuracoes.notifications"] !== false && (
          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings />
          </TabsContent>
        )}

        {perms["configuracoes.security"] !== false && (
          <TabsContent value="security" className="space-y-6">
            <SecuritySettings />
          </TabsContent>
        )}

        {perms["configuracoes.integrations"] !== false && (
          <TabsContent value="integrations" className="space-y-6">
            <IntegrationSettings />
          </TabsContent>
        )}

        {perms["configuracoes.teams"] !== false && (
          <TabsContent value="teams" className="space-y-6">
            <TeamsSettings />
            <AccessControl />
          </TabsContent>
        )}
      </Tabs>
    </LayoutWrapper>
  )
}
