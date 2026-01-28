import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail, getAuthedUser } from "@/lib/api-auth"

export const runtime = "nodejs";

export async function GET(req: Request) {
  const user = await getAuthedUser(req)
  let email = user?.email || await getAuthedEmail(req)
  
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })

  email = email.toLowerCase()

  let profile = null as any
  {
    const { data: profiles } = await supabaseServer
      .from("profiles")
      .select("id, email, phone, name, surname, regional_preferences, organization_id, avatar_url, role, cpf, cnpj")
      .eq("email", email)
      .limit(1)
    profile = profiles?.[0] ?? null
  }

  if (!profile && user) {
    // Auto-create profile from auth user data if missing
    const meta = user.user_metadata || {}
    const fullName = meta.full_name || meta.name || ""
    const parts = fullName.split(" ")
    const name = parts[0] || ""
    const surname = parts.slice(1).join(" ") || ""
    const avatar_url = meta.avatar_url || meta.picture || ""
    
    const payload: any = {
        id: user.id,
        email: user.email,
        phone: user.phone || null,
        name,
        surname,
        avatar_url,
        role: "member" // default role
    }
    
    const { data: created } = await supabaseServer
        .from("profiles")
        .upsert(payload, { onConflict: "id" })
        .select()
        .single()
        
    if (created) profile = created
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

export async function PUT(req: Request) {
  return POST(req)
}

export async function POST(req: Request) {
  const body = await req.json()
  const authed = await getAuthedEmail(req)
  if (!authed) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  const { name, surname, phone, regional_preferences, organization, avatar_url, cpf, cnpj } = body
  const email = authed

  let userId: string | undefined
  
  // fallback: keep existing profile id if found
  const { data: existing } = await supabaseServer
    .from("profiles")
    .select("id")
    .eq("email", email)
    .limit(1)
  userId = existing?.[0]?.id

  const upsertPayload: any = { email, name, surname, phone }
  if (regional_preferences) {
    upsertPayload.regional_preferences = regional_preferences
  }
  if (avatar_url) upsertPayload.avatar_url = avatar_url
  if (cpf) upsertPayload.cpf = cpf
  if (cnpj) upsertPayload.cnpj = cnpj
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
        
        // Ensure role is set
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
      }
    }
  } else {
    // If no organization provided and user has no org, create one default
    // Check if user already has org
    const { data: existingProf } = await supabaseServer.from("profiles").select("organization_id").eq("email", email).single()
    
    if (!existingProf?.organization_id) {
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
        }
    }
  }

  return Response.json({ ok: true })
}
