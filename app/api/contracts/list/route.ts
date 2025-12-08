import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

function sanitizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-_.]/g, "-").replace(/-+/g, "-")
}

export async function GET(req: Request) {
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })

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

  const { data: files, error } = await supabaseServer.storage.from(bucket).list(safeOrg, { limit: 100, sortBy: { column: "updated_at", order: "desc" } })
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  const items: { name: string; path: string; signedUrl: string | null; size?: number; updated_at?: string }[] = []
  for (const f of files || []) {
    const fullPath = `${safeOrg}/${f.name}`
    const { data: signed } = await supabaseServer.storage.from(bucket).createSignedUrl(fullPath, 60 * 60)
    items.push({ name: f.name, path: fullPath, signedUrl: signed?.signedUrl || null, size: (f as any).size, updated_at: (f as any).updated_at })
  }

  return Response.json({ items })
}

