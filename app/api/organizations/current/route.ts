import { supabaseServer } from "@/lib/supabase-server"
import { hasPermission, normalizeRole } from "@/lib/permissions"
import { getAuthedEmail } from "@/lib/api-auth"

export async function GET(req: Request) {
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("organization_id")
    .eq("email", email)
    .limit(1)
  const orgId = profiles?.[0]?.organization_id
  if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })
  const { data: orgs } = await supabaseServer
    .from("organizations")
    .select("id,name,legal_name,tax_id,industry,size,timezone,locale,currency,phone,email,website,address_line1,address_line2,city,region,country,postal_code,created_at,updated_at")
    .eq("id", orgId)
    .limit(1)
  const organization = orgs?.[0] || null
  const { count } = await supabaseServer
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", orgId)
  const member_count = count || 0
  return Response.json({ organization, member_count })
}

export async function POST(req: Request) {
  const body = await req.json()
  const email = await getAuthedEmail(req)
  const { organization } = body
  
  if (!email || !organization) return new Response(JSON.stringify({ error: "missing_data" }), { status: 400 })
  
  // Verify if user already has an organization
  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("organization_id")
    .eq("email", email)
    .limit(1)
    
  if (profiles?.[0]?.organization_id) {
    return new Response(JSON.stringify({ error: "already_has_organization" }), { status: 409 })
  }

  // Create organization
  const { data: newOrg, error: createError } = await supabaseServer
    .from("organizations")
    .insert({
      name: organization.name,
      legal_name: organization.legal_name,
      tax_id: organization.tax_id,
      industry: organization.industry,
      size: organization.size,
      website: organization.website,
      email: organization.email,
      address_line1: organization.address_line1,
      city: organization.city,
      region: organization.region,
      postal_code: organization.postal_code,
      country: organization.country,
      // Default fields
      timezone: "America/Sao_Paulo",
      locale: "pt-BR",
      currency: "BRL"
    })
    .select()
    .single()

  if (createError) return new Response(JSON.stringify({ error: createError.message }), { status: 500 })

  // Link user to organization as admin/owner
  const { error: linkError } = await supabaseServer
    .from("profiles")
    .update({ 
      organization_id: newOrg.id,
      role: "admin" // or 'owner' depending on your role system
    })
    .eq("email", email)

  if (linkError) {
    // Rollback organization creation if link fails (optional but recommended)
    await supabaseServer.from("organizations").delete().eq("id", newOrg.id)
    return new Response(JSON.stringify({ error: "failed_to_link_profile" }), { status: 500 })
  }

  return Response.json({ organization: newOrg })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const email = await getAuthedEmail(req)
  const { organization } = body
  if (!email || !organization) return new Response(JSON.stringify({ error: "missing" }), { status: 400 })
  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("organization_id, role")
    .eq("email", email)
    .limit(1)
  const orgId = profiles?.[0]?.organization_id
  const callerRole = normalizeRole(profiles?.[0]?.role as string | undefined)
  if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })
  if (!hasPermission(callerRole, "edit_organization")) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })
  const upd: any = {}
  ;["name","legal_name","tax_id","industry","size","timezone","locale","currency","phone","email","website","address_line1","address_line2","city","region","country","postal_code"].forEach((k) => {
    if (k in organization) upd[k] = organization[k]
  })
  const { error } = await supabaseServer
    .from("organizations")
    .update(upd)
    .eq("id", orgId)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ ok: true })
}

export async function DELETE(req: Request) {
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("organization_id, role")
    .eq("email", email)
    .limit(1)
  const orgId = profiles?.[0]?.organization_id
  const callerRole = normalizeRole(profiles?.[0]?.role as string | undefined)
  if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })
  if (!hasPermission(callerRole, "delete_organization")) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })
  await supabaseServer.from("audit_logs").delete().eq("organization_id", orgId)
  // No explicit organization_members table, profiles are linked directly
  await supabaseServer.from("profiles").update({ organization_id: null }).eq("organization_id", orgId)
  const { error } = await supabaseServer.from("organizations").delete().eq("id", orgId)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ ok: true })
}
