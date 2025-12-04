import { supabaseServer } from "@/lib/supabase-server"
import { hasPermission, normalizeRole } from "@/lib/permissions"
import { getAuthedEmail } from "@/lib/api-auth"

export async function GET(req: Request) {
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("organization_id")
    .eq("email", email)
    .limit(1)
  const orgId = profiles?.[0]?.organization_id
  if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })
  const { data: orgs } = await supabaseServer
    .from("organizations")
    .select("id,name,legal_name,tax_id,industry,size,timezone,locale,currency,phone,email,website,address_line1,address_line2,city,region,country,postal_code,created_at,updated_at")
    .eq("id", orgId)
    .limit(1)
  const organization = orgs?.[0] || null
  const { data: members } = await supabaseServer
    .from("organization_members")
    .select("id")
    .eq("organization_id", orgId)
  const member_count = members?.length || 0
  return Response.json({ organization, member_count })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const email = await getAuthedEmail(req)
  const { organization } = body
  if (!email || !organization) return new Response(JSON.stringify({ error: "missing" }), { status: 400 })
  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("organization_id, role")
    .eq("email", email)
    .limit(1)
  const orgId = profiles?.[0]?.organization_id
  const callerRole = normalizeRole(profiles?.[0]?.role as string | undefined)
  if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })
  if (!hasPermission(callerRole, "edit_organization")) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })
  const upd: any = {}
  ;["name","legal_name","tax_id","industry","size","timezone","locale","currency","phone","email","website","address_line1","address_line2","city","region","country","postal_code"].forEach((k) => {
    if (k in organization) upd[k] = organization[k]
  })
  const { error } = await supabaseServer
    .from("organizations")
    .update(upd)
    .eq("id", orgId)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ ok: true })
}

export async function DELETE(req: Request) {
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("organization_id, role")
    .eq("email", email)
    .limit(1)
  const orgId = profiles?.[0]?.organization_id
  const callerRole = normalizeRole(profiles?.[0]?.role as string | undefined)
  if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })
  if (!hasPermission(callerRole, "delete_organization")) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })
  await supabaseServer.from("audit_logs").delete().eq("organization_id", orgId)
  await supabaseServer.from("organization_members").delete().eq("organization_id", orgId)
  await supabaseServer.from("profiles").update({ organization_id: null }).eq("organization_id", orgId)
  const { error } = await supabaseServer.from("organizations").delete().eq("id", orgId)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ ok: true })
}
