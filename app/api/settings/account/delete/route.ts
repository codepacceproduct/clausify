import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

export async function POST(req: Request) {
  const body = await req.json()
  const { confirmPhrase, reason, details, switchingTo, satisfaction } = body
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  const phrase = (confirmPhrase || "").trim().toLowerCase()
  if (phrase !== "desejo excluir minha conta") {
    return new Response(JSON.stringify({ error: "frase_incorreta" }), { status: 400 })
  }

  let profile: any = null
  {
    const { data } = await supabaseServer
      .from("profiles")
      .select("id, email, avatar_url, organization_id")
      .eq("email", email)
      .limit(1)
    profile = data?.[0] ?? null
  }

  if (profile?.avatar_url) {
    try {
      const url = profile.avatar_url as string
      const m = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.*)$/)
      if (m) {
        const bucket = m[1]
        const path = m[2]
        await supabaseServer.storage.from(bucket).remove([path])
      }
    } catch {}
  }

  await supabaseServer.from("sessions").delete().eq("email", email)
  await supabaseServer.from("organization_members").delete().eq("email", email)

  if (profile?.id) {
    await supabaseServer.from("profiles").delete().eq("id", profile.id)
  } else {
    await supabaseServer.from("profiles").delete().eq("email", email)
  }

  let authUserId: string | null = null
  {
    const { data } = await supabaseServer
      .from("auth.users")
      .select("id")
      .eq("email", email)
      .limit(1)
    authUserId = data?.[0]?.id ?? null
  }
  if (authUserId) {
    const { error } = await supabaseServer.auth.admin.deleteUser(authUserId)
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  try {
    await supabaseServer
      .from("audit_logs")
      .insert({ email, action: "account_delete", ip: null, status: "success", resource: "Conta", organization_id: profile?.organization_id ?? null })
  } catch {}

  return Response.json({ ok: true })
}
