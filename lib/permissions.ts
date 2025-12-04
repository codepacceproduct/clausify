export type AppRole = "admin" | "moderator" | "member"

export type Capability =
  | "manage_members"
  | "change_roles"
  | "edit_organization"
  | "delete_organization"
  | "view_analytics"
  | "view_audit_logs"
  | "generate_invites"
  | "configure_approvals"

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
