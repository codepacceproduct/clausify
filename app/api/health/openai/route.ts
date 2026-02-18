import { openai } from "@/lib/openai"

export async function GET() {
  try {
    const res = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: "Responda apenas: OK",
    })
    return Response.json({
      ok: true,
      response: (res as any).output_text ?? "OK",
    })
  } catch (err: any) {
    return Response.json(
      {
        ok: false,
        error: err?.message || "Erro",
        stack: err?.stack,
      },
      { status: 500 }
    )
  }
}
