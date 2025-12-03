import { supabaseServer } from "@/lib/supabase-server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const email = url.searchParams.get("email")
  if (!email) return new Response(JSON.stringify({ error: "missing email" }), { status: 400 })
  const { data, error } = await supabaseServer
    .from("sessions")
    .select("id, user_agent, ip, device, os, browser, client_host, hostname, created_at, last_active, active")
    .eq("email", email)
    .order("last_active", { ascending: false })
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ sessions: data })
}
