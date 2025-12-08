import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

export async function DELETE(req: Request) {
  const body = await req.json()
  const id = String(body?.id || "").trim()
  const email = await getAuthedEmail(req)
  if (!email || !id) return new Response(JSON.stringify({ error: "missing_fields" }), { status: 400 })

  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("organization_id, id")
    .eq("email", email)
    .limit(1)
  const orgId = profiles?.[0]?.organization_id as string | undefined
  const userId = profiles?.[0]?.id as string | undefined
  if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })

  const { data: membersById } = await supabaseServer
    .from("organization_members")
    .select("role, status")
    .eq("organization_id", orgId)
    .eq("user_id", userId || "00000000-0000-0000-0000-000000000000")
    .limit(1)
  const { data: membersByEmail } = await supabaseServer
    .from("organization_members")
    .select("role, status")
    .eq("organization_id", orgId)
    .eq("email", email)
    .limit(1)
  const m = (membersById && membersById[0]) || (membersByEmail && membersByEmail[0]) || null
  const role = String(m?.role || "").toLowerCase()
  const status = String(m?.status || "inactive").toLowerCase()
  const isAdmin = (role === "admin" || role === "owner") && status === "active"
  if (!isAdmin) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })

  const { data: rows } = await supabaseServer
    .from("workflows")
    .select("id, organization_id, storage_bucket, storage_path")
    .eq("id", id)
    .limit(1)
  const wf = rows?.[0]
  if (!wf || wf.organization_id !== orgId) return new Response(JSON.stringify({ error: "not_found" }), { status: 404 })

  const bucket = wf.storage_bucket || "workflows"
  await supabaseServer.storage.from(bucket).remove([wf.storage_path])

  const { error } = await supabaseServer
    .from("workflows")
    .delete()
    .eq("id", id)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ ok: true })
}

