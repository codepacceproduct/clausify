export type Intent = "schedule_meeting" | "unknown"

export type ScheduleMeetingPayload = {
  title?: string
  date: string
  time: string
}

export type ParsedIntent = {
  intent: Intent
  payload?: ScheduleMeetingPayload
}

