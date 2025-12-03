import { supabaseServer } from "@/lib/supabase-server"

export async function POST(req: Request) {
  const body = await req.json()
  const { email, userAgent, device, os, browser, clientHost, hostname } = body
  if (!email) return new Response(JSON.stringify({ error: "missing email" }), { status: 400 })
  // Try to infer IP from common headers
  const hdr = req.headers
  const forwarded = hdr.get("x-forwarded-for") || hdr.get("x-real-ip") || hdr.get("cf-connecting-ip") || null
  const ip = forwarded?.split(",")[0].trim() || null
  const { error } = await supabaseServer
    .from("sessions")
    .insert({ email, user_agent: userAgent, ip, device, os, browser, client_host: clientHost || null, hostname: hostname || null })
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ ok: true })
}
