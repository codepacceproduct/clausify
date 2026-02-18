import crypto from "crypto"

export async function POST(req: Request) {
  const body = await req.json()

  const serviceUrl = process.env.HARVEY_SERVICE_URL || "http://localhost:8000/harvey"
  const sharedSecret = process.env.HARVEY_SHARED_SECRET || ""

  const userId = body.user_id as string | undefined
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Missing user_id in Harvey request body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    )
  }

  const timestamp = Date.now().toString()
  const hmac = crypto
    .createHmac("sha256", sharedSecret)
    .update(`${userId}:${timestamp}`)
    .digest("hex")

  const response = await fetch(serviceUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-harvey-user-id": userId,
      "x-harvey-timestamp": timestamp,
      "x-harvey-signature": hmac,
    },
    body: JSON.stringify({ command: body.command }),
  })

  if (!response.ok) {
    const text = await response.text()
    return new Response(
      JSON.stringify({ error: "Harvey service error", detail: text }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }

  const data = await response.json()
  return Response.json(data)
}
