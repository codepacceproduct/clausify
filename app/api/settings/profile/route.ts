import { supabaseServer } from "@/lib/supabase-server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const email = url.searchParams.get("email")
  if (!email) return new Response(JSON.stringify({ error: "missing email" }), { status: 400 })

  const { data: authUsers, error: authErr } = await supabaseServer
    .from("auth.users")
    .select("id, email")
    .eq("email", email)
    .limit(1)
  if (authErr) return new Response(JSON.stringify({ error: authErr.message }), { status: 500 })
  const authUser = authUsers?.[0]

  let profile = null as any
  if (authUser) {
    const { data: profiles } = await supabaseServer
      .from("profiles")
      .select("id, email, phone, name, surname, regional_preferences, organization_id")
      .eq("id", authUser.id)
      .limit(1)
    profile = profiles?.[0] ?? null
    if (!profile) {
      // If profile missing, create a minimal one linked to auth.users
      const { data: created } = await supabaseServer
        .from("profiles")
        .upsert({ id: authUser.id, email: authUser.email }, { onConflict: "id" })
        .select()
      profile = created?.[0] ?? null
    }
  } else {
    // No auth user found; try email match on profiles
    const { data: profiles } = await supabaseServer
      .from("profiles")
      .select("id, email, phone, name, surname, regional_preferences, organization_id")
      .eq("email", email)
      .limit(1)
    profile = profiles?.[0] ?? null
  }

  let organization = null as any
  if (profile?.organization_id) {
    const { data: orgs } = await supabaseServer
      .from("organizations")
      .select("id, name, industry, size, timezone, locale")
      .eq("id", profile.organization_id)
      .limit(1)
    organization = orgs?.[0] ?? null
  }

  return Response.json({ profile, organization })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { email, name, surname, phone, regional_preferences, organization } = body
  if (!email) return new Response(JSON.stringify({ error: "missing email" }), { status: 400 })

  const { data: authUsers } = await supabaseServer
    .from("auth.users")
    .select("id, email")
    .eq("email", email)
    .limit(1)
  const authUser = authUsers?.[0]

  let userId = authUser?.id as string | undefined
  if (!userId) {
    // fallback: keep existing profile id if found
    const { data: existing } = await supabaseServer
      .from("profiles")
      .select("id")
      .eq("email", email)
      .limit(1)
    userId = existing?.[0]?.id
  }

  const upsertPayload: any = { email, name, surname, phone }
  if (regional_preferences) {
    upsertPayload.regional_preferences = regional_preferences
  }
  if (userId) upsertPayload.id = userId

  const { error: upErr } = await supabaseServer
    .from("profiles")
    .upsert(upsertPayload, { onConflict: "id" })
  if (upErr) return new Response(JSON.stringify({ error: upErr.message }), { status: 500 })

  if (organization) {
    const { id, name: orgName, industry, size, timezone, locale } = organization
    if (id) {
      await supabaseServer
        .from("organizations")
        .update({ name: orgName, industry, size, timezone, locale })
        .eq("id", id)
    } else if (orgName) {
      const { data: createdOrg, error: orgErr } = await supabaseServer
        .from("organizations")
        .insert({ name: orgName, industry, size, timezone, locale })
        .select("id")
        .limit(1)
      if (orgErr) return new Response(JSON.stringify({ error: orgErr.message }), { status: 500 })
      const newOrgId = createdOrg?.[0]?.id
      if (newOrgId) {
        if (userId) {
          await supabaseServer.from("profiles").update({ organization_id: newOrgId }).eq("id", userId)
        } else {
          await supabaseServer.from("profiles").update({ organization_id: newOrgId }).eq("email", email)
        }
      }
    }
  }

  return Response.json({ ok: true })
}
