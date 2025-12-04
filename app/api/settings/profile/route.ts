import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

export async function GET(req: Request) {
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })

  let profile = null as any
  {
    const { data: profiles } = await supabaseServer
      .from("profiles")
      .select("id, email, phone, name, surname, regional_preferences, organization_id, avatar_url, role")
      .eq("email", email)
      .limit(1)
    profile = profiles?.[0] ?? null
  }

  if (!profile) {
    const { data: authUsers } = await supabaseServer
      .from("auth.users")
      .select("id, email")
      .eq("email", email)
      .limit(1)
    const authUser = authUsers?.[0]
    if (authUser) {
      const { data: created } = await supabaseServer
        .from("profiles")
        .upsert({ id: authUser.id, email: authUser.email }, { onConflict: "id" })
        .select()
      profile = created?.[0] ?? null
    }
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
  const authed = await getAuthedEmail(req)
  if (!authed) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  const { name, surname, phone, regional_preferences, organization, avatar_url } = body
  const email = authed

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
  if (avatar_url) upsertPayload.avatar_url = avatar_url
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
      if (id) {
        if (userId) {
          await supabaseServer.from("profiles").update({ organization_id: id }).eq("id", userId)
        } else {
          await supabaseServer.from("profiles").update({ organization_id: id }).eq("email", email)
        }
        const { data: existingMember } = await supabaseServer
          .from("organization_members")
          .select("email")
          .eq("organization_id", id)
          .eq("email", email)
          .limit(1)
        if (existingMember && existingMember.length > 0) {
          await supabaseServer
            .from("organization_members")
            .update({ status: "pending", joined_at: null })
            .eq("organization_id", id)
            .eq("email", email)
        } else {
          await supabaseServer
            .from("organization_members")
            .insert({ organization_id: id, email, role: "member", status: "pending", joined_at: null })
        }
        const { data: profs } = await supabaseServer
          .from("profiles")
          .select("role")
          .eq("email", email)
          .limit(1)
        const currentRole = String(profs?.[0]?.role || "")
        if (!currentRole) {
          await supabaseServer.from("profiles").update({ role: "member" }).eq("email", email)
        }
      }
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
          await supabaseServer.from("profiles").update({ organization_id: newOrgId, role: "admin" }).eq("id", userId)
        } else {
          await supabaseServer.from("profiles").update({ organization_id: newOrgId, role: "admin" }).eq("email", email)
        }
        await supabaseServer
          .from("organization_members")
          .insert({ organization_id: newOrgId, email, role: "admin", status: "active", joined_at: new Date().toISOString() })
      }
    }
  } else {
    const domain = (email.split("@")[1] || "").split(".")[0]
    const fallbackName = domain ? domain : (name ? `${name} Organização` : `Org de ${email}`)
    const { data: createdOrg, error: orgErr } = await supabaseServer
      .from("organizations")
      .insert({ name: fallbackName, industry: null, size: null, timezone: "america-saopaulo", locale: "pt-br" })
      .select("id")
      .limit(1)
    if (orgErr) return new Response(JSON.stringify({ error: orgErr.message }), { status: 500 })
    const newOrgId = createdOrg?.[0]?.id
    if (newOrgId) {
      if (userId) {
        await supabaseServer.from("profiles").update({ organization_id: newOrgId, role: "admin" }).eq("id", userId)
      } else {
        await supabaseServer.from("profiles").update({ organization_id: newOrgId, role: "admin" }).eq("email", email)
      }
      await supabaseServer
        .from("organization_members")
        .insert({ organization_id: newOrgId, email, role: "admin", status: "active", joined_at: new Date().toISOString() })
    }
  }

  return Response.json({ ok: true })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const authed = await getAuthedEmail(req)
  if (!authed) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  const { name, surname, phone, regional_preferences, organization, avatar_url } = body
  const email = authed

  const updatePayload: any = { name, surname, phone }
  if (regional_preferences) updatePayload.regional_preferences = regional_preferences
  if (avatar_url) updatePayload.avatar_url = avatar_url

  const { error: updErr } = await supabaseServer
    .from("profiles")
    .update(updatePayload)
    .eq("email", email)
  if (updErr) return new Response(JSON.stringify({ error: updErr.message }), { status: 500 })

  if (organization && organization.id) {
    const { id, name: orgName, industry, size, timezone, locale } = organization
    const { error: orgUpdateErr } = await supabaseServer
      .from("organizations")
      .update({ name: orgName, industry, size, timezone, locale })
      .eq("id", id)
    if (orgUpdateErr) return new Response(JSON.stringify({ error: orgUpdateErr.message }), { status: 500 })
  }

  return Response.json({ ok: true })
}
