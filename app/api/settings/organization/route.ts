import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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

export async function GET(req: NextRequest) {
  const { client } = getClientFromAuth(req)
  const { data: userRes, error: userErr } = await client.auth.getUser()
  if (userErr || !userRes?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const { data: prof, error: profErr } = await client
    .from("profiles")
    .select("organization_id")
    .eq("id", userRes.user.id)
    .single()
  if (profErr) return NextResponse.json({ error: profErr.message }, { status: 500 })
  if (!prof?.organization_id) return NextResponse.json({ organization: null })

  const { data, error } = await client
    .from("organizations")
    .select("*")
    .eq("id", prof.organization_id)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ organization: data })
}

export async function PUT(req: NextRequest) {
  const { client } = getClientFromAuth(req)
  const body = await req.json()
  const { data: userRes, error: userErr } = await client.auth.getUser()
  if (userErr || !userRes?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const { data: prof, error: profErr } = await client
    .from("profiles")
    .select("organization_id")
    .eq("id", userRes.user.id)
    .single()
  if (profErr) return NextResponse.json({ error: profErr.message }, { status: 500 })

  const payload: Record<string, unknown> = {}
  if (body?.name !== undefined) payload.name = body.name
  if (body?.legal_name !== undefined) payload.legal_name = body.legal_name
  if (body?.tax_id !== undefined) payload.tax_id = body.tax_id
  if (body?.locale !== undefined) payload.locale = body.locale
  if (body?.timezone !== undefined) payload.timezone = body.timezone
  if (body?.currency !== undefined) payload.currency = body.currency
  if (body?.phone !== undefined) payload.phone = body.phone
  if (body?.email !== undefined) payload.email = body.email
  if (body?.website !== undefined) payload.website = body.website
  if (body?.address_line1 !== undefined) payload.address_line1 = body.address_line1
  if (body?.address_line2 !== undefined) payload.address_line2 = body.address_line2
  if (body?.city !== undefined) payload.city = body.city
  if (body?.region !== undefined) payload.region = body.region
  if (body?.country !== undefined) payload.country = body.country
  if (body?.postal_code !== undefined) payload.postal_code = body.postal_code
  if (body?.industry !== undefined) payload.industry = body.industry
  if (body?.size !== undefined) payload.size = body.size
  if (body?.allowed_domains !== undefined) payload.allowed_domains = Array.isArray(body.allowed_domains)
    ? body.allowed_domains
    : typeof body.allowed_domains === "string"
      ? body.allowed_domains.split(",").map((s: string) => s.trim().toLowerCase()).filter(Boolean)
      : null

  if (prof?.organization_id) {
    const { data, error } = await client
      .from("organizations")
      .update(payload)
      .eq("id", prof.organization_id)
      .select("*")
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ organization: data })
  }

  const { data: created, error: createErr } = await client
    .from("organizations")
    .insert(payload)
    .select("*")
    .single()
  if (createErr) return NextResponse.json({ error: createErr.message }, { status: 500 })

  const { error: linkErr } = await client
    .from("profiles")
    .update({ organization_id: created.id })
    .eq("id", userRes.user.id)
  if (linkErr) return NextResponse.json({ error: linkErr.message }, { status: 500 })

  return NextResponse.json({ organization: created })
}
