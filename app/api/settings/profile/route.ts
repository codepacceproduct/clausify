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

  const { data } = await client
    .from("profiles")
    .select("id,email,phone,name,surname,bio,regional_preferences,organization_id,role,created_at")
    .eq("id", userRes.user.id)
    .maybeSingle()

  if (data) return NextResponse.json({ profile: data })

  const email = userRes.user.email || null
  const payload = {
    id: userRes.user.id,
    email,
    phone: null,
    name: null,
    surname: null,
    bio: null,
    role: "user",
    regional_preferences: { language: "pt-br", timezone: "america-saopaulo", dateFormat: "dd-mm-yyyy" },
  }

  const { data: created, error: createErr } = await client
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("id,email,phone,name,surname,bio,regional_preferences,organization_id,role,created_at")
    .eq("id", userRes.user.id)
    .single()

  if (createErr) return NextResponse.json({ error: createErr.message }, { status: 500 })
  return NextResponse.json({ profile: created })
}

export async function PUT(req: NextRequest) {
  const { client } = getClientFromAuth(req)
  const body = await req.json()
  const { data: userRes, error: userErr } = await client.auth.getUser()
  if (userErr || !userRes?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const payload: Record<string, unknown> = {}
  if (body?.name !== undefined) payload.name = body.name
  if (body?.surname !== undefined) payload.surname = body.surname
  if (body?.email !== undefined) payload.email = body.email
  if (body?.phone !== undefined) payload.phone = body.phone
  if (body?.bio !== undefined) payload.bio = body.bio
  if (body?.regional_preferences !== undefined) payload.regional_preferences = body.regional_preferences

  const { data, error } = await client
    .from("profiles")
    .update(payload)
    .eq("id", userRes.user.id)
    .select("id,email,phone,name,surname,bio,regional_preferences,organization_id,role,created_at")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ profile: data })
}
