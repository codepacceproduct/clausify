import { supabaseServer } from "@/lib/supabase-server"
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

  const { data: members } = await supabaseServer
    .from("organization_members")
    .select("email, role, status, invited_at, joined_at")
    .eq("organization_id", orgId)
    .order("joined_at", { ascending: false })

  const emails = (members || []).map((m: any) => m.email).filter(Boolean)
  let names: Record<string, { name: string | null; surname: string | null; role: string | null; avatar_url: string | null; phone: string | null }> = {}
  if (emails.length) {
    const { data: profs } = await supabaseServer
      .from("profiles")
      .select("email,name,surname,role,avatar_url,phone")
      .in("email", emails)
    for (const p of profs || []) {
      names[p.email as string] = { name: (p.name as string) || null, surname: (p.surname as string) || null, role: ((p.role as string) || null), avatar_url: ((p.avatar_url as string) || null), phone: ((p.phone as string) || null) }
    }
  }
  const mapRole = (r?: string | null) => {
    const v = (r || "").toLowerCase()
    if (v === "owner" || v === "admin") return "admin"
    if (v === "moderator") return "moderator"
    if (v === "member" || v === "user") return "member"
    return "member"
  }
  let latestLogsByEmail: Record<string, { valid_to: string | null }> = {}
  if ((members || []).length) {
    const { data: logs } = await supabaseServer
      .from("team_invite_logs")
      .select("email, valid_to, created_at, organization_id")
      .eq("organization_id", orgId)
    const sorted = (logs || []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    for (const l of sorted) {
      const em = l.email as string
      if (!latestLogsByEmail[em]) {
        latestLogsByEmail[em] = { valid_to: (l.valid_to as string) || null }
      }
    }
  }
  const now = Date.now()
  const rows = [] as Array<{ email: string; name: string | null; surname: string | null; phone: string | null; role: string; status: string; invited_at: string | null; joined_at: string | null; avatar_url: string | null }>
  for (const m of members || []) {
    const emailKey = m.email as string
    const latest = latestLogsByEmail[emailKey]
    let status = (m.status as string) || "active"
    const vto = latest?.valid_to ? new Date(latest.valid_to).getTime() : null
    const isExpired = vto ? now > vto : false
    if (status === "invited" && isExpired && !m.joined_at) {
      await supabaseServer
        .from("organization_members")
        .update({ status: "inactive" })
        .eq("organization_id", orgId)
        .eq("email", emailKey)
      status = "inactive"
    }
    rows.push({
      email: emailKey,
      name: names[emailKey]?.name || null,
      surname: names[emailKey]?.surname || null,
      phone: names[emailKey]?.phone || null,
      role: mapRole(m.role as string) || mapRole(names[emailKey]?.role || null),
      status,
      invited_at: m.invited_at as string | null,
      joined_at: m.joined_at as string | null,
      avatar_url: names[emailKey]?.avatar_url || null,
    })
  }
  return Response.json({ members: rows })
}

export async function POST(req: Request) {
  const body = await req.json()
  const requester = await getAuthedEmail(req)
  const email = String(body?.email || "")
  const name = String(body?.name || "")
  const surname = String(body?.surname || "")
  const password = String(body?.password || "")
  const role = String(body?.role || "member").toLowerCase()
  if (!requester || !email || !password) return new Response(JSON.stringify({ error: "missing_fields" }), { status: 400 })
  if (!["admin", "moderator", "member"].includes(role)) return new Response(JSON.stringify({ error: "invalid_role" }), { status: 400 })

  const { data: requesterRows } = await supabaseServer
    .from("profiles")
    .select("role, organization_id")
    .eq("email", requester)
    .limit(1)
  const requesterOrgId = requesterRows?.[0]?.organization_id as string | undefined
  const requesterRole = String(requesterRows?.[0]?.role || "").toLowerCase()
  const isAdmin = requesterRole === "admin" || requesterRole === "owner"
  if (!isAdmin || !requesterOrgId) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })

  const { data: created, error: createErr } = await supabaseServer.auth.admin.createUser({ email, password, email_confirm: true })
  if (createErr) return new Response(JSON.stringify({ error: createErr.message }), { status: 500 })
  const userId = created?.user?.id
  if (!userId) return new Response(JSON.stringify({ error: "user_creation_failed" }), { status: 500 })

  const profileRole = role === "admin" ? "admin" : "user"
  const { error: profErr } = await supabaseServer
    .from("profiles")
    .insert({ id: userId, email, name: name || null, surname: surname || null, role: profileRole, organization_id: requesterOrgId })
  if (profErr) return new Response(JSON.stringify({ error: profErr.message }), { status: 500 })

  const { error: memErr } = await supabaseServer
    .from("organization_members")
    .insert({ organization_id: requesterOrgId, user_id: userId, email, role, status: "active", joined_at: new Date().toISOString() })
  if (memErr) return new Response(JSON.stringify({ error: memErr.message }), { status: 500 })

  return Response.json({ ok: true })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const requester = await getAuthedEmail(req)
  const member_email = String(body?.member_email || "")
  const role = body?.role
  const status = String(body?.status || "")
  if (!requester || !member_email) return new Response(JSON.stringify({ error: "missing" }), { status: 400 })
  const nextStatus = status ? status.toLowerCase() : undefined
  if (nextStatus && !["active", "inactive"].includes(nextStatus)) return new Response(JSON.stringify({ error: "invalid_status" }), { status: 400 })

  const { data: requesterRows } = await supabaseServer
    .from("profiles")
    .select("role, organization_id")
    .eq("email", requester)
    .limit(1)
  const requesterOrgId = requesterRows?.[0]?.organization_id as string | undefined
  const requesterRole = String(requesterRows?.[0]?.role || "").toLowerCase()
  const isAdmin = requesterRole === "admin" || requesterRole === "owner"
  if (!isAdmin || !requesterOrgId) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })

  const { data: targetRows } = await supabaseServer
    .from("organization_members")
    .select("organization_id")
    .eq("email", member_email)
    .limit(1)
  const targetOrgId = targetRows?.[0]?.organization_id as string | undefined
  if (!targetOrgId || targetOrgId !== requesterOrgId) return new Response(JSON.stringify({ error: "not_same_org" }), { status: 403 })

  const updatePayload: any = {}
  if (nextStatus) updatePayload.status = nextStatus
  if (role !== undefined) {
    const nextRole = String(role || "").toLowerCase()
    if (!["admin", "moderator", "member"].includes(nextRole)) {
      return new Response(JSON.stringify({ error: "invalid_role" }), { status: 400 })
    }
    updatePayload.role = nextRole
  }
  if (Object.keys(updatePayload).length === 0) return new Response(JSON.stringify({ error: "nothing_to_update" }), { status: 400 })
  const { error } = await supabaseServer
    .from("organization_members")
    .update(updatePayload)
    .eq("organization_id", requesterOrgId)
    .eq("email", member_email)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ ok: true })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const requester = await getAuthedEmail(req)
  const member_email = String(body?.member_email || "")
  if (!requester || !member_email) return new Response(JSON.stringify({ error: "missing" }), { status: 400 })

  const { data: requesterRows } = await supabaseServer
    .from("profiles")
    .select("role, organization_id")
    .eq("email", requester)
    .limit(1)
  const requesterOrgId = requesterRows?.[0]?.organization_id as string | undefined
  const requesterRole = String(requesterRows?.[0]?.role || "").toLowerCase()
  const isAdmin = requesterRole === "admin" || requesterRole === "owner"
  if (!isAdmin || !requesterOrgId) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })

  const { data: targetRows } = await supabaseServer
    .from("organization_members")
    .select("organization_id")
    .eq("email", member_email)
    .limit(1)
  const targetOrgId = targetRows?.[0]?.organization_id as string | undefined
  if (!targetOrgId || targetOrgId !== requesterOrgId) return new Response(JSON.stringify({ error: "not_same_org" }), { status: 403 })

  const { error } = await supabaseServer
    .from("organization_members")
    .delete()
    .eq("organization_id", requesterOrgId)
    .eq("email", member_email)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ ok: true })
}
