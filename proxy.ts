import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone()
  const publicPaths = ["/", "/login", "/register", "/forgot-password", "/criar-conta", "/api-docs", "/privacidade", "/termos"]
  const path = url.pathname
  const isPublic = publicPaths.some((p) => path.startsWith(p)) || path.startsWith("/_next") || path.startsWith("/images") || path === "/favicon.ico"
  if (isPublic) return NextResponse.next()

  const token = req.cookies.get("auth_token")?.value
  const email = req.cookies.get("user_email")?.value
  if (!token || !email) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
    const forwarded = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || req.headers.get("cf-connecting-ip") || null
    const ip = forwarded?.split(",")[0].trim() || null
    const host = req.headers.get("host") || null
    try {
      const myBase = process.env.NEXT_PUBLIC_SITE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`
      const check = await fetch(`${myBase}/api/sessions/list`, { headers: { Cookie: req.headers.get("cookie") || "" } })
      if (check.ok) {
        const j = await check.json().catch(() => ({ sessions: [] }))
        const activeForIp = (j.sessions || []).some((s: any) => s.active && ((ip && s.ip === ip) || (host && s.client_host === host)))
        if (!activeForIp) {
          const resp = NextResponse.redirect(url)
          resp.cookies.set("auth_token", "", { path: "/", maxAge: 0 })
          resp.cookies.set("user_email", "", { path: "/", maxAge: 0 })
          resp.headers.set("Cache-Control", "no-store")
          resp.headers.set("Pragma", "no-cache")
          url.pathname = "/login"
          return resp
        }
      }
    } catch {}
  } catch {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}
