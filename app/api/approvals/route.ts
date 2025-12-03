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
    .from("approvals")
    .select(
      "id,contract_name,client,value,type,current_level,total_levels,submitted_by,submitted_at,deadline,priority,comments,previous_approvals,status",
    )
    .order("submitted_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const mapped = (data ?? []).map((row: any) => ({
    id: row.id,
    contractName: row.contract_name,
    client: row.client ?? "",
    value: row.value ?? "",
    type: row.type ?? "",
    currentLevel: row.current_level,
    totalLevels: row.total_levels,
    submittedBy: { name: userName, avatar: "", role: "" },
    submittedAt: new Date(row.submitted_at).toLocaleString("pt-BR"),
    deadline: row.deadline ? new Date(row.deadline).toLocaleDateString("pt-BR") : "",
    priority: row.priority ?? "low",
    comments: Array.isArray(row.comments) ? row.comments : [],
    previousApprovals: Array.isArray(row.previous_approvals) ? row.previous_approvals : [],
  }))

  return NextResponse.json({ approvals: mapped })
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
    client: body?.client ?? null,
    value: body?.value ?? null,
    type: body?.type ?? null,
    current_level: body?.currentLevel ?? 1,
    total_levels: body?.totalLevels ?? 1,
    submitted_by: userId,
    deadline: body?.deadline ?? null,
    priority: body?.priority ?? "low",
    comments: body?.comments ?? [],
    previous_approvals: body?.previousApprovals ?? [],
    status: body?.status ?? "pending",
  }

  const { data, error } = await client.from("approvals").insert(payload).select("*").single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ approval: data }, { status: 201 })
}

