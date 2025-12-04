import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

export async function GET(req: Request) {
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })

  const { data: profileRows } = await supabaseServer
    .from("profiles")
    .select("role, organization_id")
    .eq("email", email)
    .limit(1)
  const profile = profileRows?.[0]
  const isAdmin = profile?.role === "admin"
  const orgId = profile?.organization_id || null

  if (!isAdmin || !orgId) {
    const { data: sessions } = await supabaseServer
      .from("sessions")
      .select("id, created_at, last_active, ip")
      .eq("email", email)
      .order("last_active", { ascending: false })
    const mapped = (sessions || []).map((s) => ({
      id: s.id,
      action: "login",
      resource: "Sistema",
      email,
      ip: s.ip || null,
      status: "success",
      timestamp: new Date(s.last_active || s.created_at).toISOString(),
    }))
    return Response.json({ logs: mapped })
  }

  const { data: orgMembers } = await supabaseServer
    .from("organization_members")
    .select("email")
    .eq("organization_id", orgId)

  const memberEmails = (orgMembers || []).map((m) => m.email).filter(Boolean)

  const { data: audit } = await supabaseServer
    .from("audit_logs")
    .select("id, created_at, action, resource, email, ip, status")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })

  const { data: sessions } = await supabaseServer
    .from("sessions")
    .select("id, created_at, last_active, ip, email")
    .in("email", memberEmails.length ? memberEmails : [email])
    .order("last_active", { ascending: false })

  const mappedAudit = (audit || []).map((a) => ({
    id: a.id,
    action: a.action,
    resource: a.resource,
    email: a.email,
    ip: a.ip || null,
    status: a.status || "success",
    timestamp: new Date(a.created_at).toISOString(),
  }))
  const mappedSessions = (sessions || []).map((s) => ({
    id: s.id,
    action: "login",
    resource: "Sistema",
    email: s.email,
    ip: s.ip || null,
    status: "success",
    timestamp: new Date(s.last_active || s.created_at).toISOString(),
  }))
  const logs = [...mappedAudit, ...mappedSessions].sort((x, y) => (x.timestamp < y.timestamp ? 1 : -1))
  return Response.json({ logs })
}
