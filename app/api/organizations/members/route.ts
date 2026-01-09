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
    .from("profiles")
    .select("email, name, surname, role, avatar_url, created_at")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })

  const rows = (members || []).map((m: any) => ({
    email: m.email,
    name: m.name,
    surname: m.surname,
    role: m.role || "member",
    status: "active",
    invited_at: null, // We don't track invites in profiles yet
    joined_at: m.created_at,
    avatar_url: m.avatar_url,
  }))

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

  // Trigger usually creates profile, but we update it with org info
  const { error: profErr } = await supabaseServer
    .from("profiles")
    .update({ name: name || null, surname: surname || null, role: role, organization_id: requesterOrgId })
    .eq("id", userId)
  
  // If update failed (maybe trigger didn't run yet?), try upsert
  if (profErr) {
      await supabaseServer
    .from("profiles")
    .upsert({ id: userId, email, name: name || null, surname: surname || null, role: role, organization_id: requesterOrgId })
  }

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

  const { data: requesterRows } = await supabaseServer
    .from("profiles")
    .select("role, organization_id")
    .eq("email", requester)
    .limit(1)
  const requesterOrgId = requesterRows?.[0]?.organization_id as string | undefined
  const requesterRole = String(requesterRows?.[0]?.role || "").toLowerCase()
  const isAdmin = requesterRole === "admin" || requesterRole === "owner"
  if (!isAdmin || !requesterOrgId) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })

  // Verify target is in same org
  const { data: targetRows } = await supabaseServer
    .from("profiles")
    .select("organization_id")
    .eq("email", member_email)
    .limit(1)
  const targetOrgId = targetRows?.[0]?.organization_id as string | undefined
  if (!targetOrgId || targetOrgId !== requesterOrgId) return new Response(JSON.stringify({ error: "not_same_org" }), { status: 403 })

  if (nextStatus === "inactive") {
      // Remove from org
      await supabaseServer.from("profiles").update({ organization_id: null }).eq("email", member_email)
      return Response.json({ ok: true })
  }

  const updatePayload: any = {}
  if (role !== undefined) {
    const nextRole = String(role || "").toLowerCase()
    if (!["admin", "moderator", "member"].includes(nextRole)) {
      return new Response(JSON.stringify({ error: "invalid_role" }), { status: 400 })
    }
    updatePayload.role = nextRole
  }
  
  if (Object.keys(updatePayload).length === 0) return new Response(JSON.stringify({ error: "nothing_to_update" }), { status: 400 })
  
  const { error } = await supabaseServer
    .from("profiles")
    .update(updatePayload)
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
    .from("profiles")
    .select("organization_id")
    .eq("email", member_email)
    .limit(1)
  const targetOrgId = targetRows?.[0]?.organization_id as string | undefined
  if (!targetOrgId || targetOrgId !== requesterOrgId) return new Response(JSON.stringify({ error: "not_same_org" }), { status: 403 })

  const { error } = await supabaseServer
    .from("profiles")
    .update({ organization_id: null })
    .eq("email", member_email)

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ ok: true })
}
