import { supabaseServer } from "@/lib/supabase-server"

export async function POST(req: Request) {
  const body = await req.json()
  const { email, sessionId, endOthers } = body
  if (!email) return new Response(JSON.stringify({ error: "missing email" }), { status: 400 })
  if (endOthers) {
    const { error } = await supabaseServer.from("sessions").update({ active: false, last_active: new Date().toISOString() }).eq("email", email)
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return Response.json({ ok: true })
  }
  if (!sessionId) return new Response(JSON.stringify({ error: "missing sessionId" }), { status: 400 })
  const { error } = await supabaseServer.from("sessions").update({ active: false, last_active: new Date().toISOString() }).eq("id", sessionId).eq("email", email)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ ok: true })
}
