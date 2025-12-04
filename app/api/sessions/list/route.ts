import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

export async function GET(req: Request) {
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  const { data, error } = await supabaseServer
    .from("sessions")
    .select("id, user_agent, ip, device, os, browser, client_host, hostname, created_at, last_active, active")
    .eq("email", email)
    .order("last_active", { ascending: false })
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ sessions: data })
}
