import { supabaseServer } from "@/lib/supabase-server"

export async function POST(req: Request) {
  const body = await req.json()
  const { email } = body
  if (!email) return new Response(JSON.stringify({ error: "missing email" }), { status: 400 })
  await supabaseServer.from("profiles").update({ totp_enabled: false, totp_secret: null }).eq("email", email)
  return Response.json({ ok: true })
}
