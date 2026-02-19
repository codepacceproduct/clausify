import { getSupabaseClient } from "../integrations/supabase.client"
import type { ScheduleMeetingPayload } from "../types/intents"

export async function createEvent(user_id: string, payload: ScheduleMeetingPayload) {
  const supabase = getSupabaseClient()
  const title = payload.title ?? "Reunião"

  const starts_at = new Date(`${payload.date}T${payload.time}:00`)
  const ends_at = new Date(starts_at.getTime() + 60 * 60 * 1000)

  const { data, error } = await supabase
    .from("events")
    .insert({
      user_id,
      title,
      description: "Criado via HARVEY (voz)",
      date: starts_at.toISOString().slice(0, 10),
      start_time: payload.time,
      end_time: null,
      type: "meeting",
    })
    .select()
    .single()

  if (error) throw error
  return data
}
