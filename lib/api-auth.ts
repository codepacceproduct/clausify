export async function getAuthedEmail(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization") || ""
  let token = ""
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    token = authHeader.slice(7).trim()
  }
  if (!token) {
    const cookie = req.headers.get("cookie") || ""
    const m = cookie.match(/(?:^|; )auth_token=([^;]+)/)
    if (m && m[1]) token = decodeURIComponent(m[1])
  }
  if (!token) return null
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const j = await res.json().catch(() => null)
    const email = (j?.email || "") as string
    return email || null
  } catch {
    return null
  }
}
