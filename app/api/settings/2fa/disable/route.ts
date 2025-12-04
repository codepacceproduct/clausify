import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

export async function POST(req: Request) {
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  await supabaseServer.from("profiles").update({ totp_enabled: false, totp_secret: null }).eq("email", email)
  return Response.json({ ok: true })
}
