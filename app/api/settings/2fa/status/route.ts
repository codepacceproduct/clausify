import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

export async function GET(req: Request) {
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("totp_enabled")
    .eq("email", email)
    .limit(1)
  const enabled = profiles?.[0]?.totp_enabled || false
  return Response.json({ enabled })
}
