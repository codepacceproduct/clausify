import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

function toCsv(rows: Array<{ timestamp: string; action: string; resource: string; email: string; ip: string | null; status: string }>) {
  const header = ["timestamp", "action", "resource", "email", "ip", "status"].join(",")
  const lines = rows.map((r) => [r.timestamp, r.action, r.resource, r.email, r.ip ?? "", r.status].map((v) => {
    const s = String(v)
    return s.includes(",") || s.includes("\n") ? `"${s.replace(/"/g, '""')}` + '"' : s
  }).join(","))
  return [header, ...lines].join("\n")
}

export async function GET(req: Request) {
  const requester = await getAuthedEmail(req)
  if (!requester) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })

  const { data: profileRows } = await supabaseServer
    .from("profiles")
    .select("role, organization_id")
    .eq("email", requester)
    .limit(1)
  const profile = profileRows?.[0]
  const isAdmin = profile?.role === "admin"
  const orgId = profile?.organization_id || null
  if (!isAdmin || !orgId) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })

  const { data: orgMembers } = await supabaseServer
    .from("organization_members")
    .select("email")
    .eq("organization_id", orgId)

  const memberEmails = (orgMembers || []).map((m: any) => m.email).filter(Boolean)

  const { data: sessions } = await supabaseServer
    .from("sessions")
    .select("created_at,last_active,ip,email")
    .in("email", memberEmails.length ? memberEmails : [requester])
    .order("last_active", { ascending: false })

  const { data: audit } = await supabaseServer
    .from("audit_logs")
    .select("created_at,action,resource,email,ip,status")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })

  const mappedSessions = (sessions || []).map((s: any) => ({
    timestamp: new Date(s.last_active || s.created_at).toISOString(),
    action: "login",
    resource: "Sistema",
    email: s.email as string,
    ip: s.ip || null,
    status: "success",
  }))

  const mappedAudit = (audit || []).map((a: any) => ({
    timestamp: new Date(a.created_at).toISOString(),
    action: a.action as string,
    resource: (a.resource as string) || "",
    email: a.email as string,
    ip: (a.ip as string) || null,
    status: (a.status as string) || "success",
  }))

  const rows = [...mappedAudit, ...mappedSessions].sort((x, y) => (x.timestamp < y.timestamp ? 1 : -1))
  const csv = toCsv(rows)
  const filename = `audit-logs-org-${orgId}-${new Date().toISOString().slice(0,10)}.csv`
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=${filename}`,
      "Cache-Control": "no-store",
    },
  })
}
