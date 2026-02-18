import { createEvent } from "../actions/calendar.voice_create"

export async function executeAction(intent: string, user_id: string, payload: any) {
  if (intent === "schedule_meeting") {
    return await createEvent(user_id, payload)
  }

  throw new Error("Ação não registrada")
}

