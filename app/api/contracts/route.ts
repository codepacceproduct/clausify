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
  const { data, error } = await client
    .from("contracts")
    .select("id,title,client,value,type,status,risk_score,created_at,updated_at")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ contracts: data ?? [] })
}

export async function POST(req: NextRequest) {
  const { client } = getClientFromAuth(req)
  const body = await req.json()
  const payload = {
    title: body?.title,
    client: body?.client ?? null,
    value: body?.value ?? null,
    type: body?.type ?? null,
    status: body?.status ?? "draft",
    risk_score: body?.risk_score ?? null,
  }

  const { data, error } = await client.from("contracts").insert(payload).select("*").single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ contract: data }, { status: 201 })
}
