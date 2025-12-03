import { supabaseServer } from "@/lib/supabase-server"
import { verifyTOTP } from "@/lib/totp"

export async function POST(req: Request) {
  const body = await req.json()
  const { email, token } = body
  if (!email || !token) return new Response(JSON.stringify({ error: "missing email or token" }), { status: 400 })
  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("totp_secret, totp_enabled")
    .eq("email", email)
    .limit(1)
  const profile = profiles?.[0]
  if (!profile?.totp_enabled || !profile?.totp_secret) return new Response(JSON.stringify({ error: "2fa_not_enabled" }), { status: 400 })
  const ok = await verifyTOTP(profile.totp_secret, token)
  if (!ok) return new Response(JSON.stringify({ error: "invalid_token" }), { status: 401 })
  return Response.json({ ok: true })
}
