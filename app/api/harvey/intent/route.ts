import { openai } from "@/lib/openai"

type Intent =
  | "schedule_meeting"
  | "reschedule_meeting"
  | "cancel_meeting"
  | "query_calendar"
  | "general_question"
  | "unknown"

export async function POST(req: Request) {
  try {
    const { text, now } = await req.json()
    if (!text || typeof text !== "string") {
      return Response.json({ error: "text inválido" }, { status: 400 })
    }
    const lower = text.toLowerCase()
    const res = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "Você é um parser de intenções. Responda estritamente em JSON que siga o schema fornecido.",
        },
        {
          role: "user",
          content: `Agora: ${now || new Date().toISOString()}. Texto: ${text}`,
        },
      ] as any,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "harvey_intent",
          schema: {
            type: "object",
            properties: {
              intent: {
                type: "string",
                enum: [
                  "schedule_meeting",
                  "reschedule_meeting",
                  "cancel_meeting",
                  "query_calendar",
                  "general_question",
                  "unknown",
                ],
              },
              payload: {
                type: "object",
                nullable: true,
                properties: {
                  title: { type: "string" },
                  date: { type: "string" },
                  time: { type: "string" },
                  participants: {
                    type: "array",
                    items: { type: "string" },
                  },
                  limit: { type: "number" },
                },
                additionalProperties: true,
              },
            },
            required: ["intent"],
            additionalProperties: false,
          },
          strict: true,
        },
      },
    } as any)
    const output = (res as any).output_text || ""
    let parsed: { intent: Intent; payload?: any } = { intent: "unknown" }
    try {
      parsed = JSON.parse(output)
    } catch {
      parsed = { intent: "unknown" }
    }
    if (!parsed.payload) {
      parsed.payload = {}
    }

    const isCalendarQuestion =
      lower.includes("agenda") ||
      lower.includes("compromisso") ||
      lower.includes("compromissos") ||
      lower.includes("reunião") ||
      lower.includes("reuniao") ||
      lower.includes("reuniões") ||
      lower.includes("reunioes")

    if (
      isCalendarQuestion &&
      (parsed.intent === "general_question" || parsed.intent === "unknown")
    ) {
      parsed.intent = "query_calendar"

      const today = new Date(now || new Date().toISOString())
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      const toIso = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
          d.getDate(),
        ).padStart(2, "0")}`

      if (lower.includes("hoje")) {
        parsed.payload.date = toIso(today)
      } else if (lower.includes("amanhã") || lower.includes("amanha")) {
        parsed.payload.date = toIso(tomorrow)
      }
    }

    return Response.json(parsed)
  } catch (err: any) {
    return Response.json({ error: err?.message || "erro" }, { status: 500 })
  }
}
