import { supabaseServer } from "@/lib/supabase-server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const email = url.searchParams.get("email")
  if (!email) return new Response(JSON.stringify({ error: "missing email" }), { status: 400 })
  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("totp_enabled")
    .eq("email", email)
    .limit(1)
  const enabled = profiles?.[0]?.totp_enabled || false
  return Response.json({ enabled })
}
