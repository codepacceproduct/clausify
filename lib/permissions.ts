import { createClient } from "@supabase/supabase-js"
import { unstable_cache } from "next/cache"

export type AppRole = "super_admin" | "owner" | "org_admin" | "member" | "moderator"
export type Plan = "free" | "basic" | "professional" | "enterprise"

export type Capability =
  | "manage_platform"
  | "manage_organization"
  | "manage_members"
  | "change_roles"
  | "edit_organization"
  | "delete_organization"
  | "view_analytics"
  | "view_audit_logs"
  | "generate_invites"
  | "configure_approvals"

export type PlanLimits = {
  max_users: number | null
  max_contracts: number | null
  max_analyses: number | null
  max_queries: number | null
  max_chat_messages: number | null
  max_monitoring_processes: number | null
  max_datalake_queries: number | null
  support_level: string
  features: string[]
  allowed_modules: string[]
  allowed_calculators: string[] | "all"
}

const DEFAULT_PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    max_users: 1,
    max_contracts: 0,
    max_analyses: 0,
    max_queries: 5,
    max_chat_messages: 5,
    max_monitoring_processes: 1,
    max_datalake_queries: 1,
    support_level: "none",
    features: [],
    allowed_modules: ["dashboard", "sobre", "configuracoes", "consultas", "clausichat"],
    allowed_calculators: []
  },
  basic: {
    max_users: 1,
    max_contracts: 10,
    max_analyses: 10,
    max_queries: 10,
    max_chat_messages: 50,
    max_monitoring_processes: 5,
    max_datalake_queries: 5,
    support_level: "email",
    features: [],
    allowed_modules: ["dashboard", "contratos", "consultas", "calendario", "versionamento", "calculos", "configuracoes", "sobre"],
    allowed_calculators: ["trabalhista-rescisao", "trabalhista-fgts", "imobiliario-aluguel"]
  },
  professional: {
    max_users: 5,
    max_contracts: 100,
    max_analyses: Infinity,
    max_queries: 200,
    max_chat_messages: Infinity,
    max_monitoring_processes: 20,
    max_datalake_queries: 20,
    support_level: "priority",
    features: ["view_analytics"],
    allowed_modules: ["dashboard", "contratos", "consultas", "clausichat", "calendario", "versionamento", "playbook", "calculos", "configuracoes", "assinaturas", "portfolio", "aprovacoes", "sobre"],
    allowed_calculators: "all"
  },
  enterprise: {
    max_users: Infinity,
    max_contracts: Infinity,
    max_analyses: Infinity,
    max_queries: Infinity,
    max_chat_messages: Infinity,
    max_monitoring_processes: Infinity,
    max_datalake_queries: Infinity,
    support_level: "dedicated",
    features: ["view_analytics", "view_audit_logs", "sso"],
    allowed_modules: ["dashboard", "contratos", "consultas", "clausichat", "calendario", "versionamento", "playbook", "calculos", "configuracoes", "assinaturas", "auditoria", "equipes", "analises", "portfolio", "aprovacoes", "sobre"],
    allowed_calculators: "all"
  }
}

// Keep for backward compatibility if needed, but prefer getPlanLimits
export const planLimits = DEFAULT_PLAN_LIMITS

const roleCapabilities: Record<AppRole, Capability[]> = {
  super_admin: [
    "manage_platform",
    "manage_organization",
    "manage_members",
    "change_roles",
    "edit_organization",
    "delete_organization",
    "view_analytics",
    "view_audit_logs",
    "generate_invites",
    "configure_approvals",
  ],
  owner: [
    "manage_organization",
    "manage_members",
    "change_roles",
    "edit_organization",
    "delete_organization",
    "view_analytics",
    "view_audit_logs",
    "generate_invites",
    "configure_approvals",
  ],
  org_admin: [
    "manage_members",
    "change_roles",
    "edit_organization",
    "view_analytics",
    "view_audit_logs",
    "generate_invites",
    "configure_approvals",
  ],
  moderator: [
    "view_analytics",
    "configure_approvals",
  ],
  member: [
    "view_analytics",
  ],
}

export function hasPermission(role: string | null | undefined, capability: Capability): boolean {
  const r = String(role || "member").toLowerCase() as AppRole
  const list = roleCapabilities[r] || []
  return list.includes(capability)
}

export function normalizeRole(r?: string | null): AppRole {
  const v = String(r || "").toLowerCase()
  if (v === "admin") return "super_admin" // Legacy support or explicit super admin
  if (v === "super_admin") return "super_admin"
  if (v === "owner") return "owner"
  if (v === "org_admin") return "org_admin"
  if (v === "moderator") return "moderator"
  return "member"
}

export const capabilities = roleCapabilities

const getCachedPlans = unstable_cache(
  async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase.from("plans").select("*")
    return data
  },
  ["plans-config-v3"],
  { tags: ["plans"], revalidate: 3600 } // Revalidate every hour or when tag is invalidated
)

export async function getPlanLimits(plan: string | null | undefined): Promise<PlanLimits> {
  const p = (plan || "free").toLowerCase()
  
  try {
    const plans = await getCachedPlans()
    const dbPlan = plans?.find((x: any) => x.slug === p)
    if (dbPlan?.config) {
      // Ensure Infinity is handled correctly (JSON stores null for Infinity usually, or big number?)
      // In my seed migration I used null for Infinity in JSONB.
      // So I need to map null to Infinity for numeric fields.
      const config = { ...dbPlan.config }
      const numericFields = [
        "max_users", "max_contracts", "max_analyses", "max_queries", 
        "max_chat_messages", "max_monitoring_processes", "max_datalake_queries"
      ]
      
      for (const field of numericFields) {
        if (config[field] === null) {
          config[field] = Infinity
        }
      }
      
      return config as PlanLimits
    }
  } catch (error) {
    console.error("Error fetching plan limits from DB:", error)
  }

  return DEFAULT_PLAN_LIMITS[p as Plan] || DEFAULT_PLAN_LIMITS.free
}

export async function canOrganization(plan: string | null | undefined, feature: string): Promise<boolean> {
  const limits = await getPlanLimits(plan)
  return limits.features.includes(feature)
}
