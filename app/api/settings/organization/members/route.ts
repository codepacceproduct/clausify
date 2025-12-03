import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { inviteTemplate, acceptedTemplate } from "@/lib/email-templates"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

function getClientFromAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || ""
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null
  const client = createClient(url, anonKey, {
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return { client, token }
}

async function getCurrentOrgId(client: ReturnType<typeof createClient>) {
  const { data: userRes } = await client.auth.getUser()
  const uid = userRes?.user?.id
  if (!uid) return null
  const { data: prof } = await client.from("profiles").select("organization_id").eq("id", uid).single()
  return prof?.organization_id || null
}

export async function GET(req: NextRequest) {
  const { client } = getClientFromAuth(req)
  const orgId = await getCurrentOrgId(client)
  if (!orgId) return NextResponse.json({ members: [], total: 0 })
  const { searchParams } = new URL(req.url)
  const search = (searchParams.get("search") || "").trim().toLowerCase()
  const page = Number(searchParams.get("page") || 1)
  const limit = Math.min(Math.max(Number(searchParams.get("limit") || 10), 1), 100)
  const status = (searchParams.get("status") || "all").toLowerCase()
  const role = (searchParams.get("role") || "all").toLowerCase()
  const sortBy = (searchParams.get("sortBy") || "invited_at").toLowerCase()
  const order = (searchParams.get("order") || "desc").toLowerCase()
  const from = (page - 1) * limit
  const to = from + limit - 1
  let query = client
    .from("organization_members")
    .select("id,organization_id,user_id,email,role,status,invited_at,joined_at", { count: "exact" })
    .eq("organization_id", orgId)
    .order(sortBy === "role" ? "role" : sortBy === "joined_at" ? "joined_at" : "invited_at", {
      ascending: order === "asc",
    })
    .range(from, to)
  if (search) query = query.ilike("email", `%${search}%`)
  if (status && status !== "all") query = query.eq("status", status)
  if (role && role !== "all") query = query.eq("role", role)
  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ members: data || [], total: count || 0 })
}

async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY || ""
  const from = process.env.RESEND_FROM || "no-reply@clausify.com"
  if (!key) return
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ from, to, subject, html }),
  })
}

export async function POST(req: NextRequest) {
  const { client } = getClientFromAuth(req)
  const body = await req.json()
  const orgId = await getCurrentOrgId(client)
  if (!orgId) return NextResponse.json({ error: "organization_not_found" }, { status: 400 })

  const email = (body?.email || "").trim().toLowerCase()
  const role = (body?.role || "member").toLowerCase()

  const { data: org } = await client.from("organizations").select("allowed_domains,name").eq("id", orgId).single()
  const domain = email.split("@")[1] || ""
  const allowed = Array.isArray(org?.allowed_domains) ? org?.allowed_domains : []
  if (allowed.length > 0 && !allowed.includes(domain)) {
    return NextResponse.json({ error: "domain_not_allowed" }, { status: 403 })
  }

  const { data: authUser } = await client.auth.admin.listUsers()
  const target = authUser?.users?.find((u) => (u.email || "").toLowerCase() === email)

  const payload = {
    organization_id: orgId,
    user_id: target?.id ?? null,
    email,
    role: role === "owner" || role === "admin" ? role : "member",
    status: target?.id ? "active" : "invited",
    joined_at: target?.id ? new Date().toISOString() : null,
  }

  const { data, error } = await client.from("organization_members").insert(payload).select("*").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const orgName = org?.name || "sua organização"
  if (!target?.id) {
    const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login`
    await sendEmail(email, `Convite para participar de ${orgName}`, inviteTemplate(orgName, acceptUrl))
  }
  return NextResponse.json({ member: data }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const { client } = getClientFromAuth(req)
  const body = await req.json()
  const id = body?.id
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 })
  const { data: existing } = await client.from("organization_members").select("*").eq("id", id).single()
  const updates: Record<string, unknown> = {}
  if (body?.role) updates.role = body.role
  if (body?.status) updates.status = body.status
  const { data, error } = await client
    .from("organization_members")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (existing?.status === "invited" && data?.status === "active") {
    const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`
    let orgName = "sua organização"
    if (existing?.organization_id) {
      const { data: org } = await client
        .from("organizations")
        .select("name")
        .eq("id", existing.organization_id)
        .single()
      orgName = org?.name || orgName
    }
    await sendEmail(data.email, "Acesso concedido", acceptedTemplate(orgName, acceptUrl))
  }
  return NextResponse.json({ member: data })
}

export async function DELETE(req: NextRequest) {
  const { client } = getClientFromAuth(req)
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 })
  const { error } = await client.from("organization_members").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
