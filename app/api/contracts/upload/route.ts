import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

function sanitizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-_.]/g, "-").replace(/-+/g, "-")
}

export async function POST(req: Request) {
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })

  const form = await req.formData()
  const files = form.getAll("files").filter((f) => f instanceof File) as File[]
  const type = (form.get("type") as string | null) || null
  const client = (form.get("client") as string | null) || null
  const value = (form.get("value") as string | null) || null
  const notes = (form.get("notes") as string | null) || null
  if (!files || files.length === 0) return new Response(JSON.stringify({ error: "missing_files" }), { status: 400 })

  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("organization_id")
    .eq("email", email)
    .limit(1)
  const orgId = profiles?.[0]?.organization_id as string | undefined
  if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })

  const { data: orgs } = await supabaseServer
    .from("organizations")
    .select("id, name")
    .eq("id", orgId)
    .limit(1)
  const org = orgs?.[0]
  const safeOrg = sanitizeName(String(org?.name || orgId))

  const bucket = "contracts"
  const { data: bucketInfo } = await supabaseServer.storage.getBucket(bucket)
  if (!bucketInfo) {
    const { error: bucketErr } = await supabaseServer.storage.createBucket(bucket, { public: false })
    if (bucketErr) return new Response(JSON.stringify({ error: bucketErr.message }), { status: 500 })
  }

  const uploaded: { name: string; path: string; url?: string }[] = []
  for (const file of files) {
    const ext = (file.name.split(".").pop() || "pdf").toLowerCase()
    const base = sanitizeName(file.name.replace(/\.[^.]+$/, ""))
    const path = `${safeOrg}/${Date.now()}-${base}.${ext}`
    const { error: uploadErr } = await supabaseServer.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type || "application/octet-stream", upsert: true })
    if (uploadErr) return new Response(JSON.stringify({ error: uploadErr.message }), { status: 500 })
    uploaded.push({ name: file.name, path })
  }

  await supabaseServer
    .from("audit_logs")
    .insert({ email, action: "upload", resource: "Contratos", status: "success", organization_id: orgId, meta: { type, client, value, notes, count: uploaded.length } })

  return Response.json({ ok: true, uploaded })
}

