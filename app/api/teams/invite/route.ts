import { supabaseServer } from "@/lib/supabase-server"

export async function POST(req: Request) {
  const body = await req.json()
  const { email, name, surname } = body
  if (!email || typeof email !== "string") return new Response(JSON.stringify({ error: "missing email" }), { status: 400 })
  const okEmail = /.+@.+\..+/.test(email)
  if (!okEmail) return new Response(JSON.stringify({ error: "invalid email" }), { status: 400 })
  try {
    const { data, error } = await supabaseServer.auth.admin.generateLink({ type: "magiclink", email, options: { data: { name: name || "", surname: surname || "" } } })
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    const link = (data as any)?.properties?.action_link || (data as any)?.properties?.email_otp_link || null
    if (!link) return new Response(JSON.stringify({ error: "no_link" }), { status: 500 })
    await supabaseServer.from("team_invite_logs").insert({ email, name: name || null, surname: surname || null, link })
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
