import { supabaseServer } from "@/lib/supabase-server"
import { generateBase32Secret } from "@/lib/totp"
import { getAuthedEmail } from "@/lib/api-auth"

export async function GET(req: Request) {
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })

  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("id, email, totp_secret, totp_enabled")
    .eq("email", email)
    .limit(1)
  const profile = profiles?.[0]
  const secret = profile?.totp_secret || generateBase32Secret(20)
  if (!profile) {
    const { data: authUsers } = await supabaseServer
      .from("auth.users")
      .select("id, email")
      .eq("email", email)
      .limit(1)
    const authUser = authUsers?.[0]
    const payload: any = { email, totp_secret: secret, totp_enabled: false }
    if (authUser?.id) payload.id = authUser.id
    const { error: upErr } = await supabaseServer
      .from("profiles")
      .upsert(payload, { onConflict: "id" })
    if (upErr) return new Response(JSON.stringify({ error: upErr.message }), { status: 500 })
  } else if (!profile?.totp_secret) {
    await supabaseServer.from("profiles").update({ totp_secret: secret, totp_enabled: false }).eq("email", email)
  }

  const issuer = "Clausify"
  const label = encodeURIComponent(`${issuer}:${email}`)
  const otpauth = `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&digits=6&period=30`

  return Response.json({ secret, otpauth })
}
