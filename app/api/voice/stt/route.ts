import { openai } from "@/lib/openai"

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const audio = form.get("audio")
    if (!(audio instanceof File)) {
      return Response.json({ error: "Arquivo de áudio ausente" }, { status: 400 })
    }
    const transcription = await openai.audio.transcriptions.create({
      file: audio as any,
      model: "gpt-4o-transcribe",
      language: "pt",
    })
    return Response.json({ text: (transcription as any).text || "" })
  } catch (err: any) {
    return Response.json(
      { error: err?.message || "Erro ao transcrever" },
      { status: 500 }
    )
  }
}
