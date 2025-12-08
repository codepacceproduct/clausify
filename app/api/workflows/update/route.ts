import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

function sanitizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-_.]/g, "-").replace(/-+/g, "-")
}

export async function PUT(req: Request) {
  const body = await req.json()
  const id = String(body?.id || "").trim()
  const name = body?.name as string | undefined
  const description = body?.description as string | undefined
  const contractTypes = body?.contractTypes as string[] | undefined
  const levels = body?.levels as any[] | undefined
  const isActive = body?.isActive as boolean | undefined
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
    .select("id, organization_id, name, storage_bucket, storage_path")
    .eq("id", id)
    .limit(1)
  const wf = rows?.[0]
  if (!wf || wf.organization_id !== orgId) return new Response(JSON.stringify({ error: "not_found" }), { status: 404 })

  const bucket = wf.storage_bucket || "workflows"
  const { data: bucketInfo } = await supabaseServer.storage.getBucket(bucket)
  if (!bucketInfo) {
    const { error: bucketErr } = await supabaseServer.storage.createBucket(bucket, { public: false })
    if (bucketErr) return new Response(JSON.stringify({ error: bucketErr.message }), { status: 500 })
  }

  const { data: orgs } = await supabaseServer
    .from("organizations")
    .select("id, name")
    .eq("id", orgId)
    .limit(1)
  const org = orgs?.[0]
  const safeOrg = sanitizeName(String(org?.name || orgId))

  let nextPath = wf.storage_path as string
  if (name && name.trim() && name.trim() !== wf.name) {
    const newFileName = `${sanitizeName(name.trim())}.json`
    const target = `${safeOrg}/${newFileName}`
    const { error: mvErr } = await supabaseServer.storage.from(bucket).move(wf.storage_path, target)
    if (mvErr) return new Response(JSON.stringify({ error: mvErr.message }), { status: 500 })
    nextPath = target
  }

  const content = JSON.stringify({
    name: name ?? wf.name,
    description: description ?? undefined,
    contract_types: contractTypes ?? undefined,
    levels: levels ?? undefined,
    is_active: isActive ?? undefined,
    organization_id: orgId,
  })
  const { error: upErr } = await supabaseServer.storage.from(bucket).upload(nextPath, content, { contentType: "application/json", upsert: true })
  if (upErr) return new Response(JSON.stringify({ error: upErr.message }), { status: 500 })

  const upd: any = {}
  if (name !== undefined) upd.name = name
  if (description !== undefined) upd.description = description
  if (contractTypes !== undefined) upd.contract_types = contractTypes
  if (levels !== undefined) upd.levels = levels
  if (isActive !== undefined) upd.is_active = isActive
  upd.storage_bucket = bucket
  upd.storage_path = nextPath

  const { data: updated, error } = await supabaseServer
    .from("workflows")
    .update(upd)
    .eq("id", id)
    .select("*")
    .limit(1)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ workflow: updated?.[0] || null })
}

