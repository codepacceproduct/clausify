import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

export async function POST(req: Request) {
  const body = await req.json()
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })

  const sessionId = (body?.sessionId || "").toString().trim()
  const clearAll = Boolean(body?.clearAll)

  if (clearAll) {
    const { error } = await supabaseServer.from("sessions").delete().eq("email", email)
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return Response.json({ ok: true })
  }

  if (!sessionId) return new Response(JSON.stringify({ error: "missing sessionId" }), { status: 400 })
  const { error } = await supabaseServer.from("sessions").delete().eq("id", sessionId).eq("email", email)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ ok: true })
}

