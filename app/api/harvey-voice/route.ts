import crypto from "crypto"

export async function POST(req: Request) {
  const serviceUrl =
    process.env.HARVEY_VOICE_URL ||
    process.env.HARVEY_SERVICE_URL?.replace(/\/harvey$/, "/harvey/voice") ||
    "http://localhost:8000/harvey/voice"

  const formData = await req.formData()

  const file = formData.get("file")
  const userId = (formData.get("user_id") as string) ?? "1"

  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: "Arquivo de áudio ausente" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const sharedSecret = process.env.HARVEY_SHARED_SECRET || ""
  const timestamp = Date.now().toString()
  const hmac = crypto
    .createHmac("sha256", sharedSecret)
    .update(`${userId}:${timestamp}`)
    .digest("hex")

  const forward = new FormData()
  forward.append("file", file)

  const response = await fetch(serviceUrl, {
    method: "POST",
    body: forward,
    headers: {
      "x-harvey-user-id": userId,
      "x-harvey-timestamp": timestamp,
      "x-harvey-signature": hmac,
    },
  })

  const data = await response.json()

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  })
}
