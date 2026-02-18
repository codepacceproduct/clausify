import { openai } from "../integrations/openai.client"
import type { ParsedIntent } from "../types/intents"

export async function parseIntent(text: string): Promise<ParsedIntent> {
  const res = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `
Classifique a intenção do usuário e extraia data e hora.
Retorne um JSON com o formato:
{"intent":"schedule_meeting"|"unknown","payload":{"title"?:string,"date"?:string,"time"?:string}}

Texto: "${text}"
    `,
  } as any)

  const output = (res as any).output_text ?? "{}"

  try {
    const parsed = JSON.parse(output)
    if (!parsed.intent) {
      return { intent: "unknown" }
    }
    return parsed
  } catch {
    return { intent: "unknown" }
  }
}

