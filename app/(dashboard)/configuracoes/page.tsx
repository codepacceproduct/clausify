import { LayoutWrapper } from "@/components/layout-wrapper"
import { SettingsNav } from "@/components/settings/settings-nav"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { OrganizationSettings } from "@/components/settings/organization-settings"
import { TeamManagement } from "@/components/settings/team-management"
import { SecuritySettings } from "@/components/settings/security-settings"
import { SubscriptionSettings } from "@/components/settings/subscription-settings"
import { supabaseServer } from "@/lib/supabase-server"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getPlanLimits } from "@/lib/permissions"

async function getInitialSettings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    redirect("/login")
  }

  const email = user.email
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
  
  // Fetch current subscription plan
  let plan = "free"
  if (profile.organization_id) {
    const { data: sub } = await supabaseServer
      .from("subscriptions")
      .select("plan")
      .eq("organization_id", profile.organization_id)
      .single()
    if (sub?.plan) {
      plan = sub.plan
    }
  }
  
  return { profile, plan }
}

async function getRolePermissionsForProfile(profile: any): Promise<Record<string, boolean>> {
  if (!profile?.organization_id) return {}
  const orgId = profile.organization_id as string
  const role = String(profile?.role || "member").toLowerCase()
  const modules = [
    "configuracoes",
    "configuracoes.general",
    "configuracoes.security",
    "configuracoes.teams",
  ]
  const defaults: Record<string, Record<string, boolean>> = { admin: {}, moderator: {}, member: {} }
  
  defaults.admin["configuracoes"] = true
  defaults.admin["configuracoes.general"] = true
  defaults.admin["configuracoes.teams"] = true
  defaults.admin["configuracoes.security"] = true

  defaults.moderator["configuracoes"] = true
  defaults.moderator["configuracoes.general"] = true
  defaults.moderator["configuracoes.teams"] = true
  defaults.moderator["configuracoes.security"] = false

  defaults.member["configuracoes"] = false
  defaults.member["configuracoes.general"] = false
  defaults.member["configuracoes.teams"] = false
  defaults.member["configuracoes.security"] = false

  const { data } = await supabaseServer
    .from("role_permissions")
    .select("module, allowed")
    .eq("organization_id", orgId)
    .eq("role", role)
    .in("module", modules)

  const map: Record<string, boolean> = { ...defaults[role] }
  for (const row of data || []) {
    const key = String(row.module)
    if (role === "admin") {
      map[key] = true
    } else {
      map[key] = !!row.allowed
    }
  }
  return map
}

export default async function ConfiguracoesPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { profile, plan } = await getInitialSettings()
  const perms = await getRolePermissionsForProfile(profile)
  const planLimits = await getPlanLimits(plan)
  const params = await searchParams

  // Strict permission check for page access
  if (perms["configuracoes"] === false) {
    redirect("/dashboard")
  }

  const currentTab = params.tab || "profile"
  
  // Build allowed tabs based on Role AND Plan limits
  const allowedTabs = ["profile"]
  
  if (perms["configuracoes.general"] !== false) {
      allowedTabs.push("organization")
  }

  // Everyone (except maybe limited members) should see subscription if they are admin/owner, 
  // but for now let's assume admins/mods can see it or map it to a specific permission.
  // Using 'configuracoes.general' as a proxy for now or adding a new check.
  // Actually, let's just allow it for admins/owners usually.
  // Based on getRolePermissionsForProfile, let's assume it's part of 'configuracoes'.
  // I will add it to allowedTabs if 'configuracoes' is true (which is checked at page level)
  // BUT usually only admins manage billing. 
  // Let's check role.
  const role = profile?.role || "member"
  if (role === "admin" || role === "owner") {
    allowedTabs.push("subscription")
  }
  
  // Check 'equipes' permission from Plan AND Role
  const hasTeamsPlan = planLimits.allowed_modules.includes("equipes")
  if (hasTeamsPlan && perms["configuracoes.teams"] !== false) {
      allowedTabs.push("team")
  }
  
  // Check 'auditoria' permission from Plan AND Role
  const hasAuditPlan = planLimits.allowed_modules.includes("auditoria")
  if (hasAuditPlan && perms["configuracoes.security"] !== false) {
      allowedTabs.push("security")
  }

  return (
    <LayoutWrapper>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          </div>
          <div className="hidden space-y-6 pb-16 md:block">
            <div className="space-y-0.5">
              <h3 className="text-lg font-medium">Preferências</h3>
              <p className="text-muted-foreground">
                Gerencie as configurações da sua conta e preferências de email.
              </p>
            </div>
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <div className="flex-1 lg:max-w-7xl mx-auto w-full">
                <SettingsNav allowedTabs={allowedTabs} className="mb-8" />
                
                {currentTab === "profile" && <ProfileSettings />}
                {currentTab === "organization" && perms["configuracoes.general"] !== false && <OrganizationSettings />}
                {currentTab === "subscription" && (profile?.role === "admin" || profile?.role === "owner") && <SubscriptionSettings />}
                {currentTab === "team" && hasTeamsPlan && perms["configuracoes.teams"] !== false && <TeamManagement />}
                {currentTab === "security" && hasAuditPlan && perms["configuracoes.security"] !== false && <SecuritySettings />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
