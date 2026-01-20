import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")

  let user = null
  try {
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()
    user = supabaseUser
  } catch (error) {
    // Se o token for inválido, apenas ignoramos e tratamos como usuário não logado
    // Isso evita o erro "AuthApiError: Invalid Refresh Token: Refresh Token Not Found" no terminal
  }

  if (isAdminRoute && !request.nextUrl.pathname.startsWith("/admin/login")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
  }

  const publicPaths = [
    "/",
    "/login",
    "/criar-conta",
    "/esqueci-senha",
    "/redefinir-senha",
    "/funcionalidades",
    "/precos",
    "/integracoes",
    "/changelog",
    "/sobre",
    "/blog",
    "/carreiras",
    "/contato",
    "/documentacao",
    "/guias",
    "/api-docs",
    "/suporte",
    "/privacidade",
    "/termos",
    "/lgpd",
    "/cookies",
    "/listadeespera",
    "/admin/login",
    "/preview",
  ]

  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + "/"),
  )

  const isStaticAsset =
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/images") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname === "/favicon.ico" ||
    request.nextUrl.pathname === "/favicon.svg"

  if (!user && !isPublicPath && !isStaticAsset) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
