import { supabaseServer } from "@/lib/supabase-server"
import { supabase } from "@/lib/supabase"
import { getAuthedEmail } from "@/lib/api-auth"

export async function POST(req: Request) {
  const body = await req.json()
  const { currentPassword, newPassword, targetEmail } = body
  const requester = await getAuthedEmail(req)
  if (!requester || !newPassword) return new Response(JSON.stringify({ error: "unauthorized or missing newPassword" }), { status: 400 })

  let userId: string | null = null
  if (targetEmail) {
    const { data: requesterRows } = await supabaseServer
      .from("profiles")
      .select("role, organization_id")
      .eq("email", requester)
      .limit(1)
    const requesterRole = String(requesterRows?.[0]?.role || "").toLowerCase()
    const requesterOrgId = requesterRows?.[0]?.organization_id as string | undefined
    const isAdmin = requesterRole === "admin" || requesterRole === "owner"
    if (!isAdmin || !requesterOrgId) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })

    const { data: targetProfile } = await supabaseServer
      .from("profiles")
      .select("organization_id")
      .eq("email", targetEmail)
      .limit(1)
    const targetOrgId = targetProfile?.[0]?.organization_id as string | undefined
    if (!targetOrgId || targetOrgId !== requesterOrgId) return new Response(JSON.stringify({ error: "not_same_org" }), { status: 403 })

    const { data: users } = await supabaseServer
      .from("auth.users")
      .select("id, email")
      .eq("email", targetEmail)
      .limit(1)
    const user = users?.[0]
    if (!user) return new Response(JSON.stringify({ error: "user_not_found" }), { status: 404 })
    userId = user.id
  } else {
    if (currentPassword) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: requester, password: currentPassword })
      if (error || !data?.user) return new Response(JSON.stringify({ error: "invalid_current_password" }), { status: 401 })
      userId = data.user.id
    } else {
      const { data: users } = await supabaseServer
        .from("auth.users")
        .select("id, email")
        .eq("email", requester)
        .limit(1)
      const user = users?.[0]
      if (!user) return new Response(JSON.stringify({ error: "user_not_found" }), { status: 404 })
      userId = user.id
    }
  }

  const { error: updErr } = await supabaseServer.auth.admin.updateUserById(userId!, { password: newPassword })
  if (updErr) return new Response(JSON.stringify({ error: updErr.message }), { status: 500 })
  return Response.json({ ok: true })
}
