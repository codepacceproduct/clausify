import { supabaseServer } from "@/lib/supabase-server"
import { supabase } from "@/lib/supabase"
import { getAuthedEmail } from "@/lib/api-auth"

export async function POST(req: Request) {
  const body = await req.json()
  const { currentPassword, newPassword } = body
  const email = await getAuthedEmail(req)
  if (!email || !newPassword) return new Response(JSON.stringify({ error: "unauthorized or missing newPassword" }), { status: 400 })

  let userId: string | null = null
  if (currentPassword) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: currentPassword })
    if (error || !data?.user) return new Response(JSON.stringify({ error: "invalid_current_password" }), { status: 401 })
    userId = data.user.id
  } else {
    const { data: users } = await supabaseServer
      .from("auth.users")
      .select("id, email")
      .eq("email", email)
      .limit(1)
    const user = users?.[0]
    if (!user) return new Response(JSON.stringify({ error: "user_not_found" }), { status: 404 })
    userId = user.id
  }

  const { error: updErr } = await supabaseServer.auth.admin.updateUserById(userId!, { password: newPassword })
  if (updErr) return new Response(JSON.stringify({ error: updErr.message }), { status: 500 })
  return Response.json({ ok: true })
}
