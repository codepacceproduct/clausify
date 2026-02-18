import { openai } from "@/lib/openai"
import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")
    const baseUrl = new URL(req.url).origin

    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const fallbackText = "Você precisa estar logado para usar a agenda do Harvey."
      const mp3 = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: fallbackText,
      } as any)
      const buffer = Buffer.from(await mp3.arrayBuffer())
      const audioUrl = `data:audio/mpeg;base64,${buffer.toString("base64")}`

      return new Response(
        JSON.stringify({
          transcription: "",
          response_text: fallbackText,
          intent: null,
          payload: null,
          executed: false,
          audio_url: audioUrl,
          user_id: null,
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const userId = user.id

    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ error: "Arquivo de áudio ausente" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const transcription = await openai.audio.transcriptions.create({
      file: file as any,
      model: "gpt-4o-transcribe",
      language: "pt",
    } as any)
    const text = (transcription as any).text || ""

    const intentRes = await fetch(`${baseUrl}/api/harvey/intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
    let responseText = ""
    let intentPayload: any = null
    let executed = false
    let toolName: string | null = null
    let toolData: any = null
    if (intentRes.ok) {
      const { intent, payload } = await intentRes.json()
      intentPayload = { intent, payload }
      if (intent === "schedule_meeting" && payload?.date && payload?.time) {
        const sb = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        const { data, error } = await sb.functions.invoke("calendar-voice-create", {
          body: {
            user_id: userId,
            payload: {
              title: payload?.title || "Reunião",
              date: payload.date,
              time: payload.time,
            },
          },
        })
        if (!error) {
          executed = true
          toolName = "criar_evento"
          toolData = data
          responseText = `Evento criado com sucesso. Reunião marcada para ${payload.date} às ${payload.time}.`
        } else {
          responseText = `Não foi possível agendar: ${error.message || "erro"}`
        }
      } else if (intent === "query_calendar") {
        const sb = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        const { data, error } = await sb.functions.invoke("calendar-list", {
          body: {
            user_id: userId,
            date: payload?.date || null,
            limit: payload?.limit || 5,
          },
        })
        if (!error && data?.events?.length) {
          toolName = "consultar_agenda"
          toolData = data
          const items = data.events.slice(0, 5).map((e: any) => {
            const d = new Date(e.starts_at)
            const dia = d.toLocaleDateString("pt-BR")
            const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
            return `${e.title || "Reunião"} em ${dia} às ${hora}`
          })
          responseText = `Você tem ${data.events.length} compromisso(s)${payload?.date ? ` em ${payload.date}` : ""}. ${items.join(". ")}.`
        } else if (!error) {
          responseText = payload?.date
            ? `Você não tem compromissos em ${payload.date}.`
            : "Você não tem compromissos futuros."
        } else {
          responseText = `Não foi possível consultar seu calendário: ${error.message || "erro"}`
        }
      } else {
        const chat = await openai.responses.create({
          model: "gpt-4.1-mini",
          input: [
            {
              role: "system",
              content:
                "Você é HARVEY, assistente da Clausify. Você consegue criar e consultar eventos de calendário via APIs internas e nunca deve dizer que não tem acesso à agenda do usuário. Se ocorrer um erro técnico ao acessar o calendário, explique que houve um erro temporário, não falta de acesso.",
            },
            { role: "user", content: text },
          ] as any,
        } as any)
        responseText = (chat as any).output_text || ""
      }
    } else {
      const chat = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "Você é HARVEY, assistente da Clausify. Você consegue criar e consultar eventos de calendário via APIs internas e nunca deve dizer que não tem acesso à agenda do usuário. Se ocorrer um erro técnico ao acessar o calendário, explique que houve um erro temporário, não falta de acesso.",
          },
          { role: "user", content: text },
        ] as any,
      } as any)
      responseText = (chat as any).output_text || ""
    }

    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: responseText || "Ok.",
    } as any)
    const buffer = Buffer.from(await mp3.arrayBuffer())
    const audioUrl = `data:audio/mpeg;base64,${buffer.toString("base64")}`

    return new Response(
      JSON.stringify({
        transcription: text,
        response_text: responseText,
        intent: intentPayload?.intent || null,
        payload: intentPayload?.payload || null,
        executed,
        tool: toolName,
        tool_data: toolData,
        audio_url: audioUrl,
        user_id: userId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Erro ao processar voz" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
