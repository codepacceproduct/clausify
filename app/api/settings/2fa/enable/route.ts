import { supabaseServer } from "@/lib/supabase-server"
import { verifyTOTP } from "@/lib/totp"
import { getAuthedEmail } from "@/lib/api-auth"

export async function POST(req: Request) {
  const body = await req.json()
  const { token } = body
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  if (!token) return new Response(JSON.stringify({ error: "missing token" }), { status: 400 })
  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("id, email, totp_secret")
    .eq("email", email)
    .limit(1)
  const profile = profiles?.[0]
  if (!profile?.totp_secret) return new Response(JSON.stringify({ error: "no_secret" }), { status: 400 })
  const ok = await verifyTOTP(profile.totp_secret, token)
  if (!ok) return new Response(JSON.stringify({ error: "invalid_token" }), { status: 401 })
  await supabaseServer.from("profiles").update({ totp_enabled: true }).eq("email", email)
  return Response.json({ ok: true })
}
