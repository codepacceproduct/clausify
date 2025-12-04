import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

export async function POST(req: Request) {
  const body = await req.json()
  const email = await getAuthedEmail(req)
  const ip = ((body?.ip || "").trim() || null) as string | null
  const resource = (body?.resource || "Sistema").trim()
  const action = (body?.action || "ip_change").trim()
  const status = (body?.status || "success").trim()
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })

  let organization_id: string | null = null
  {
    const { data: profiles } = await supabaseServer
      .from("profiles")
      .select("organization_id")
      .eq("email", email)
      .limit(1)
    organization_id = profiles?.[0]?.organization_id ?? null
  }

  if (action === "ip_change") {
    if (!ip) return new Response(JSON.stringify({ error: "missing ip" }), { status: 400 })
    const { data: existing } = await supabaseServer
      .from("audit_logs")
      .select("id")
      .eq("email", email)
      .eq("action", "ip_change")
      .eq("ip", ip)
      .limit(1)
    if (existing && existing.length > 0) {
      return Response.json({ ok: true, already: true })
    }
  }

  const { error } = await supabaseServer
    .from("audit_logs")
    .insert({ email, action, ip, status, resource, organization_id })
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ ok: true })
}
