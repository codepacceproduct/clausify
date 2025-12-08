import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

function sanitizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-_.]/g, "-").replace(/-+/g, "-")
}

export async function POST(req: Request) {
  const body = await req.json()
  const name = String(body?.name || "").trim()
  const description = String(body?.description || "").trim()
  const contractTypes = Array.isArray(body?.contractTypes) ? body.contractTypes : []
  const levels = Array.isArray(body?.levels) ? body.levels : []
  const email = await getAuthedEmail(req)
  if (!email || !name) return new Response(JSON.stringify({ error: "missing_fields" }), { status: 400 })

  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("organization_id")
    .eq("email", email)
    .limit(1)
  const orgId = profiles?.[0]?.organization_id as string | undefined
  if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })

  // Prefer profiles.id (FK for auth.users) to get user_id
  const { data: prof2 } = await supabaseServer
    .from("profiles")
    .select("id")
    .eq("email", email)
    .limit(1)
  const userId = (prof2 && prof2[0]?.id) as string | undefined

  // Check membership by user_id or email
  let role = ""
  let status = "inactive"
  {
    const { data: byId } = await supabaseServer
      .from("organization_members")
      .select("organization_id, role, status")
      .eq("organization_id", orgId)
      .eq("user_id", userId || "00000000-0000-0000-0000-000000000000")
      .limit(1)
    const { data: byEmail } = await supabaseServer
      .from("organization_members")
      .select("organization_id, role, status")
      .eq("organization_id", orgId)
      .eq("email", email)
      .limit(1)
    const m = (byId && byId[0]) || (byEmail && byEmail[0]) || null
    role = String(m?.role || "").toLowerCase()
    status = String(m?.status || "inactive").toLowerCase()
  }
  const isAdmin = (role === "admin" || role === "owner") && status === "active"
  if (!isAdmin) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })

  const bucket = "workflows"
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
  const fileName = `${sanitizeName(name)}.json`
  const fullPath = `${safeOrg}/${fileName}`
  const fileContent = JSON.stringify({ name, description, contract_types: contractTypes, levels, is_active: true, organization_id: orgId })
  const { error: upErr } = await supabaseServer.storage.from(bucket).upload(fullPath, fileContent, { contentType: "application/json", upsert: true })
  if (upErr) return new Response(JSON.stringify({ error: upErr.message }), { status: 500 })

  const { data: inserted, error } = await supabaseServer
    .from("workflows")
    .insert({ organization_id: orgId, name, description, contract_types: contractTypes, levels, is_active: true, storage_bucket: bucket, storage_path: fullPath, created_by: userId })
    .select("*")
    .limit(1)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  const workflow = inserted?.[0] || null
  return Response.json({ workflow })
}
