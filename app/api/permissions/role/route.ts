import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"
import { getPlanLimits } from "@/lib/permissions"
import { createClient as createAdminClient } from "@supabase/supabase-js"

export async function GET(req: Request) {
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  
  // Use admin client for system-level checks
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: profs } = await supabaseServer
    .from("profiles")
    .select("organization_id, role")
    .eq("email", email)
    .limit(1)
  const orgId = profs?.[0]?.organization_id as string | undefined
  if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })
  const { data } = await supabaseServer
    .from("role_permissions")
    .select("role, module, allowed")
    .eq("organization_id", orgId)
  const roles = ["admin", "moderator", "member"] as const
  const modules = [
    "dashboard",
    "sobre",
    "contratos",
    "consultas",
    "clausichat",
    "calculos",
    "portfolio",
    "aprovacoes",
    "calendario",
    "versionamento",
    "playbook",
    "assinaturas",
    "configuracoes",
    "configuracoes.general",
    "configuracoes.security",
    "configuracoes.teams",
    "auditoria",
    "equipes",
    "analises",
  ]
  const byRole: Record<string, Record<string, boolean>> = {}
  for (const r of roles) byRole[r] = {}
  for (const m of modules) {
    byRole.admin[m] = true
    byRole.moderator[m] = !["configuracoes.security"].includes(m)
    byRole.member[m] = !["configuracoes","aprovacoes","auditoria"].includes(m)
  }
  byRole.moderator["configuracoes"] = true
  byRole.moderator["configuracoes.general"] = true
  byRole.moderator["configuracoes.teams"] = true
  byRole.moderator["configuracoes.security"] = false
  for (const k of [
    "configuracoes.general",
    "configuracoes.security",
    "configuracoes.teams",
  ]) {
    byRole.member[k] = false
  }
  for (const row of data || []) {
    const rr = String(row.role || "member").toLowerCase()
    const mm = String(row.module || "")
    const aa = !!row.allowed
    if (!byRole[rr]) byRole[rr] = {}
    if (rr === "admin") {
      byRole[rr][mm] = true
    } else {
      byRole[rr][mm] = aa
    }
  }

  // Enforce plan limits
  // Use Service Role client to bypass RLS for subscription fetching
  const { data: subs } = await supabaseAdmin
    .from("subscriptions")
    .select("plan")
    .eq("organization_id", orgId)
    .limit(1)
  
  const currentPlan = subs?.[0]?.plan || "free"
  const planLimits = await getPlanLimits(currentPlan)
  const allowedPlanModules = planLimits.allowed_modules || []
  const allowedCalculators = planLimits.allowed_calculators
  
  for (const r of roles) {
    for (const m of modules) {
        let isPlanAllowed = allowedPlanModules.includes(m)
        if (!isPlanAllowed && m.includes(".")) {
           const parent = m.split(".")[0]
           isPlanAllowed = allowedPlanModules.includes(parent)
        }
        
        if (!isPlanAllowed) {
            byRole[r][m] = false
        }
    }
  }

  return Response.json({ 
    organization_id: orgId, 
    permissions: byRole, 
    modules,
    plan: currentPlan,
    allowed_calculators: allowedCalculators
  })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const requester = await getAuthedEmail(req)
  const role = String(body?.role || "")
  const changes = body?.changes as Record<string, boolean> | undefined
  if (!requester || !role || !changes || Object.keys(changes).length === 0) return new Response(JSON.stringify({ error: "missing_fields" }), { status: 400 })
  const { data: profs } = await supabaseServer
    .from("profiles")
    .select("organization_id, role")
    .eq("email", requester)
    .limit(1)
  const orgId = profs?.[0]?.organization_id as string | undefined
  const requesterRole = String(profs?.[0]?.role || "").toLowerCase()
  const isAdmin = requesterRole === "admin" || requesterRole === "owner"
  if (!isAdmin || !orgId) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })
  const targetRole = role.toLowerCase()
  if (!["admin", "moderator", "member"].includes(targetRole)) return new Response(JSON.stringify({ error: "invalid_role" }), { status: 400 })
  if (targetRole === "admin") return new Response(JSON.stringify({ error: "cannot_modify_admin" }), { status: 400 })
  for (const [module, allowed] of Object.entries(changes)) {
    await supabaseServer
      .from("role_permissions")
      .upsert({ organization_id: orgId, role: targetRole, module, allowed }, { onConflict: "organization_id,role,module" })
  }
  return Response.json({ ok: true })
}
