import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const { user_id, payload } = await req.json()
    if (!user_id || !payload?.date || !payload?.time) {
      return Response.json({ error: "Parâmetros inválidos" }, { status: 400 })
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const start = new Date(`${payload.date}T${payload.time}:00Z`)
    const end = new Date(start.getTime() + 60 * 60 * 1000)
    const { data, error } = await supabase
      .from("calendar_events")
      .insert({
        user_id,
        title: payload.title ?? "Reunião",
        description: payload.description ?? null,
        participants: payload.participants ?? [],
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
      })
      .select()
      .single()
    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    return Response.json({ success: true, event: data })
  } catch (err: any) {
    return Response.json({ error: err?.message || "erro" }, { status: 500 })
  }
}
