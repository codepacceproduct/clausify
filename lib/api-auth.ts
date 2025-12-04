export async function getAuthedEmail(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization") || ""
  let token = ""
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    token = authHeader.slice(7).trim()
  }
  const cookieHeader = req.headers.get("cookie") || ""
  if (!token) {
    const m = cookieHeader.match(/(?:^|; )auth_token=([^;]+)/)
    if (m && m[1]) token = decodeURIComponent(m[1])
  }
  const emailCookieMatch = cookieHeader.match(/(?:^|; )user_email=([^;]+)/)
  const emailCookie = emailCookieMatch && emailCookieMatch[1] ? decodeURIComponent(emailCookieMatch[1]) : null
  if (!token) return emailCookie
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return emailCookie
    const j = await res.json().catch(() => null)
    const email = (j?.email || "") as string
    return email || emailCookie || null
  } catch {
    return emailCookie
  }
}
