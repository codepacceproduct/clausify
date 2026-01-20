import { NextResponse } from "next/server"
import { getOpenAIClient } from "@/lib/openai"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()
    const openai = getOpenAIClient()

    if (!openai) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Limit text length to avoid high costs/timeouts
    const truncatedText = text.slice(0, 4096)

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
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
