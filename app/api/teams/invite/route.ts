import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

export async function POST(req: Request) {
  const body = await req.json()
  const { email, name, surname } = body
  const overrideOrgId = (body as any)?.org_id as string | undefined
  const logOnly = Boolean((body as any)?.logOnly)
  const valid_from = (body as any)?.valid_from as string | undefined
  const valid_to = (body as any)?.valid_to as string | undefined
  if (!email || typeof email !== "string") return new Response(JSON.stringify({ error: "missing email" }), { status: 400 })
  const okEmail = /.+@.+\..+/.test(email)
  if (!okEmail) return new Response(JSON.stringify({ error: "invalid email" }), { status: 400 })
  try {
    let orgId: string | null = null
    if (overrideOrgId) orgId = overrideOrgId
    if (!orgId) {
      const requester = await getAuthedEmail(req)
      if (!requester) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
      const { data: profs } = await supabaseServer
        .from("profiles")
        .select("organization_id")
        .eq("email", requester)
        .limit(1)
      orgId = profs?.[0]?.organization_id ?? null
    }
    const base = (process.env.NEXT_PUBLIC_SITE_URL || (typeof process !== 'undefined' ? `http://localhost:${process.env.PORT || 3000}` : 'http://localhost:3000')) as string
    const params = new URLSearchParams()
    params.set("email", email)
    if (name) params.set("name", name)
    if (surname) params.set("surname", surname)
    if (orgId) params.set("org_id", orgId)
    const link = `${base.replace(/\/$/, '')}/criar-conta?${params.toString()}`
    await supabaseServer.from("team_invite_logs").insert({ email, name: name || null, surname: surname || null, link, organization_id: orgId, valid_from: valid_from || null, valid_to: valid_to || null })
    if (!logOnly && orgId) {
      const { data: existing } = await supabaseServer
        .from("organization_members")
        .select("email")
        .eq("organization_id", orgId)
        .eq("email", email)
        .limit(1)
      const now = new Date()
      const to = valid_to ? new Date(valid_to) : null
      const isExpired = to ? now.getTime() > to.getTime() : false
      if (existing && existing.length > 0) {
        await supabaseServer
          .from("organization_members")
          .update({ status: isExpired ? "inactive" : "invited", invited_at: new Date().toISOString() })
          .eq("organization_id", orgId)
          .eq("email", email)
      } else {
        await supabaseServer
          .from("organization_members")
          .insert({ organization_id: orgId, email, role: "member", status: isExpired ? "inactive" : "invited", invited_at: new Date().toISOString() })
      }
    }
    return Response.json({ link })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "error" }), { status: 500 })
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"))
  const q = (url.searchParams.get("q") || "").toLowerCase()
  const from = url.searchParams.get("from")
  const to = url.searchParams.get("to")
  let query = supabaseServer
    .from("team_invite_logs")
    .select("email, name, surname, created_at")
  if (from) query = query.gte("created_at", from)
  if (to) query = query.lte("created_at", to)
  const { data, error } = await query.order("created_at", { ascending: false })
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  const agg: Record<string, { email: string; name: string | null; surname: string | null; count: number; last_created: string }> = {}
  for (const r of data || []) {
    const key = r.email as string
    if (!agg[key]) {
      agg[key] = { email: key, name: r.name ?? null, surname: r.surname ?? null, count: 0, last_created: r.created_at as string }
    }
    agg[key].count += 1
    if (new Date(r.created_at as string).getTime() > new Date(agg[key].last_created).getTime()) {
      agg[key].last_created = r.created_at as string
      if (r.name) agg[key].name = r.name
      if (r.surname) agg[key].surname = r.surname
    }
  }
  let list = Object.values(agg)
  if (q) {
    list = list.filter((i) =>
      (i.email || "").toLowerCase().includes(q) ||
      (i.name || "").toLowerCase().includes(q) ||
      (i.surname || "").toLowerCase().includes(q)
    )
  }
  list.sort((a, b) => new Date(b.last_created).getTime() - new Date(a.last_created).getTime())
  const pageSize = 10
  const total = list.length
  const start = (page - 1) * pageSize
  const invites = list.slice(start, start + pageSize)
  return Response.json({ invites, total, page, pageSize })
}
