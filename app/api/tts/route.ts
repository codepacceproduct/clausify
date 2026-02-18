import { NextResponse } from "next/server"
import { openai } from "@/lib/openai"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Limit text length to avoid high costs/timeouts
    const truncatedText = text.slice(0, 4096)

    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: truncatedText,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    })
  } catch (error: any) {
    console.error("TTS Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
