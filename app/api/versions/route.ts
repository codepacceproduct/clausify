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
  const { client, token } = getClientFromAuth(req)
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: userData } = await client.auth.getUser()
  const userName = userData.user?.user_metadata?.name || userData.user?.email || "Usuário"

  const { data, error } = await client
    .from("contract_versions")
    .select("id,contract_name,version,status,created_by,created_at,changes,notes,previous_version")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const mapped = (data ?? []).map((row: any) => ({
    id: row.id,
    contractName: row.contract_name,
    version: row.version,
    status: row.status,
    createdBy: { name: userName, avatar: "" },
    createdAt: new Date(row.created_at).toLocaleString("pt-BR"),
    changes: row.changes ?? 0,
    notes: row.notes ?? "",
    previousVersion: row.previous_version ? String(row.previous_version) : undefined,
  }))

  return NextResponse.json({ versions: mapped })
}

export async function POST(req: NextRequest) {
  const { client, token } = getClientFromAuth(req)
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { data: userData } = await client.auth.getUser()
  const userId = userData.user?.id
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = {
    contract_name: body?.contractName,
    version: body?.version,
    status: body?.status ?? "draft",
    created_by: userId,
    changes: body?.changes ?? 0,
    notes: body?.notes ?? null,
    previous_version: body?.previousVersion ?? null,
  }

  const { data, error } = await client.from("contract_versions").insert(payload).select("*").single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ version: data }, { status: 201 })
}
