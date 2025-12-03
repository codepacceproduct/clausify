import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { welcomeOwnerTemplate } from "@/lib/email-templates"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const email = body?.email as string
  const password = body?.password as string
  const name = body?.name as string | undefined
  const surname = body?.surname as string | undefined
  const phone = body?.phone as string | undefined
  const bio = body?.bio as string | undefined

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      ...(name ? { name } : {}),
      ...(surname ? { surname } : {}),
      ...(phone ? { phone } : {}),
      ...(bio ? { bio } : {}),
    },
  })
  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 })
  }

  const createdUserId = created.user?.id
  if (createdUserId) {
    const domain = (email.split("@")[1] || "").toLowerCase()
    const orgPayload: Record<string, unknown> = {
      name: domain || "Minha Organização",
      industry: "legal",
      size: "small",
      allowed_domains: domain ? [domain] : null,
    }
    const { data: createdOrg } = await supabaseAdmin.from("organizations").insert(orgPayload).select("id").single()
    if (createdOrg?.id) {
      await supabaseAdmin
        .from("organization_members")
        .insert({
          organization_id: createdOrg.id,
          user_id: createdUserId,
          email,
          role: "owner",
          status: "active",
          joined_at: new Date().toISOString(),
        })
      const key = process.env.RESEND_API_KEY || ""
      const from = process.env.RESEND_FROM || "no-reply@clausify.com"
      if (key) {
        const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
          body: JSON.stringify({ from, to: email, subject: "Bem-vindo ao Clausify", html: welcomeOwnerTemplate(orgPayload.name as string, dashboardUrl) }),
        })
      }
    }
    await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: createdUserId,
          email,
          phone: phone ?? null,
          name: name ?? null,
          surname: surname ?? null,
          bio: bio ?? null,
          organization_id: createdOrg?.id ?? null,
          role: "user",
          regional_preferences: {},
        },
        { onConflict: "id" }
      )
  }

  const { data: login, error: loginError } = await supabase.auth.signInWithPassword({ email, password })
  if (loginError) {
    return NextResponse.json({ error: loginError.message }, { status: 200, statusText: "created_no_login" })
  }
  const userId = login.user?.id
  if (userId) {
    await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          email,
          phone: phone ?? null,
          name: name ?? null,
          surname: surname ?? null,
          bio: bio ?? null,
          // Mantém organization_id se já criado no passo anterior
          role: "user",
          regional_preferences: {},
        },
        { onConflict: "id" }
      )
  }
  return NextResponse.json({ token: login.session?.access_token, user: { id: userId, email } }, { status: 201 })
}
