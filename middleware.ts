import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
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
  } catch {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Exclude API routes from middleware; they handle auth within route handlers
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}
