import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  // 0. EXCEÇÃO CRÍTICA: Webhook do Asaas (sem redirects, sem auth)
  if (request.nextUrl.pathname.startsWith('/api/webhook/asaas')) {
    return NextResponse.next()
  }

  // 1. Executa a lógica de sessão/auth do Supabase (que já trata redirects de rotas protegidas da UI)
  const response = await updateSession(request)

  // Se já for um redirect (302/307), retorna imediatamente
  if (response.status >= 300 && response.status < 400) {
    return response
  }

  // 2. Lógica de Proteção de API (Inadimplência)
  const path = request.nextUrl.pathname

  // Apenas para rotas de API
  if (path.startsWith('/api/')) {
    
    // Lista de rotas públicas ou relacionadas a pagamento (que inadimplentes PRECISAM acessar)
    // Inclui webhooks, checkout, gerenciamento de assinatura e auth
    const allowedPrefixes = [
        '/api/auth',           // Login/Logout
        '/api/webhook',        // Webhooks do Asaas
        '/api/checkout',       // Criar pagamento
        '/api/subscription',   // Gerenciar assinatura (criar/listar)
        '/api/billing',        // Faturamento (faturas dinâmicas)
        '/api/payments',       // Verificar status
        '/api/test-asaas',     // Testes
        '/api/debug-env',      // Debug de Variáveis de Ambiente
        '/api/_next',          // Interno do Next
        '/api/settings',       // Configurações do usuário (perfil)
        '/api/permissions'     // Permissões de acesso
    ]

    // Se for rota permitida, deixa passar
    if (allowedPrefixes.some(prefix => path.startsWith(prefix))) {
        return response
    }

    // Para as demais rotas de API, verificar status do pagamento
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
                setAll() {} // Não precisamos setar cookies aqui, updateSession já fez
            }
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Se não estiver logado, retorna 401 (API não deve redirecionar para login)
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verificar status da assinatura via organization_id
    const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()
    
    if (!profile?.organization_id) {
        // Se não tem organização, não pode acessar rotas pagas
         return NextResponse.json({ 
            error: "Organization Required",
            code: "organization_required"
        }, { status: 403 })
    }

    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('organization_id', profile.organization_id)
        .single()

    // Status considerados "Ativos"
    const activeStatuses = ['active', 'trialing']
    const status = subscription?.status

    // Se não tiver status ou não for ativo, bloqueia (403)
    if (!status || !activeStatuses.includes(status)) {
        return NextResponse.json({ 
            error: "Payment Required - Subscription Inactive",
            code: "subscription_required"
        }, { status: 403 })
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|favicon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
