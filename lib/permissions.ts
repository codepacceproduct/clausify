export type AppRole = "admin" | "moderator" | "member"
export type Plan = "free" | "basic" | "professional" | "enterprise"

export type Capability =
  | "manage_members"
  | "change_roles"
  | "edit_organization"
  | "delete_organization"
  | "view_analytics"
  | "view_audit_logs"
  | "generate_invites"
  | "configure_approvals"

export type PlanLimits = {
  max_users: number
  max_contracts: number
  max_analyses: number
  max_queries: number
  max_chat_messages: number
  max_monitoring_processes: number
  max_datalake_queries: number
  support_level: "email" | "priority" | "dedicated" | "none"
  features: string[]
  allowed_modules: string[]
  allowed_calculators: string[] | "all"
}

export const planLimits: Record<Plan, PlanLimits> = {
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
    max_analyses: 10, // Daily limit
    max_queries: 10, // Daily limit
    max_chat_messages: 50,
    max_monitoring_processes: 5,
    max_datalake_queries: 5,
    support_level: "email",
    features: [],
    allowed_modules: ["dashboard", "contratos", "consultas", "calendario", "versionamento", "calculos", "configuracoes"],
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
    allowed_modules: ["dashboard", "contratos", "consultas", "clausichat", "calendario", "versionamento", "playbook", "calculos", "configuracoes", "assinaturas", "portfolio", "aprovacoes"],
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
    allowed_modules: ["dashboard", "contratos", "consultas", "clausichat", "calendario", "versionamento", "playbook", "calculos", "configuracoes", "assinaturas", "auditoria", "equipes", "analises", "portfolio", "aprovacoes"],
    allowed_calculators: "all"
  }
}

const roleCapabilities: Record<AppRole, Capability[]> = {
  admin: [
    "manage_members",
    "change_roles",
    "edit_organization",
    "delete_organization",
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
  if (v === "owner" || v === "admin") return "admin"
  if (v === "moderator") return "moderator"
  return "member"
}

export const capabilities = roleCapabilities

export function getPlanLimits(plan: string | null | undefined): PlanLimits {
  const p = (plan || "free").toLowerCase() as Plan
  return planLimits[p] || planLimits.free
}

export function canOrganization(plan: string | null | undefined, feature: string): boolean {
  const limits = getPlanLimits(plan)
  return limits.features.includes(feature)
}
