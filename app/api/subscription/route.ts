
import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"
import { createClient as createAdminClient } from "@supabase/supabase-js"

export async function GET(req: Request) {
  const email = await getAuthedEmail(req)
  if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: profiles } = await supabaseServer
    .from("profiles")
    .select("organization_id, role")
    .eq("email", email)
    .limit(1)
  const orgId = profiles?.[0]?.organization_id
  const role = profiles?.[0]?.role
  
  if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })

  // Fetch subscription using admin client to bypass RLS
  const { data: subs } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("organization_id", orgId)
    .limit(1)
  
  const subscription = subs?.[0] || { plan: "free", status: "active" } // Default to free

  // Fetch invoices
  const { data: invoices } = await supabaseServer
    .from("invoices")
    .select("*")
    .eq("organization_id", orgId)
    .order("date", { ascending: false })

  // Fetch organization billing details
  const { data: orgs } = await supabaseServer
    .from("organizations")
    .select("legal_name, tax_id, email, address_line1, city, region, postal_code")
    .eq("id", orgId)
    .limit(1)
  
  const organization: any = orgs?.[0] || {}

  return Response.json({ 
    subscription: {
        ...subscription,
        role // pass role to frontend if needed
    }, 
    invoices: invoices || [],
    billing: {
      legal_name: organization.legal_name,
      tax_id: organization.tax_id,
      email: organization.email,
      address: organization.address_line1,
      city: organization.city,
      state: organization.region,
      zip: organization.postal_code
    }
  })
}

// POST to update plan (simplified, usually involves Stripe)
export async function POST(req: Request) {
    const body = await req.json()
    const email = await getAuthedEmail(req)
    if (!email) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  
    const { data: profiles } = await supabaseServer
      .from("profiles")
      .select("organization_id, role")
      .eq("email", email)
      .limit(1)
    const orgId = profiles?.[0]?.organization_id
    const role = profiles?.[0]?.role
    
    if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })
    if (role !== "admin" && role !== "owner") return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })

    const { plan } = body
    
    // Bloquear upgrades diretos via API sem pagamento
    // Apenas permitir downgrade para free (embora DELETE seja preferível)
    if (plan !== "free") {
        return new Response(JSON.stringify({ 
            error: "payment_required", 
            message: "Upgrades de plano devem ser feitos através do fluxo de checkout (/api/checkout)." 
        }), { status: 402 })
    }

    if (!["free", "basic", "professional", "enterprise"].includes(plan)) {
        console.error("Invalid plan requested:", plan)
        return new Response(JSON.stringify({ error: "invalid_plan" }), { status: 400 })
    }

    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Upsert subscription
    const { error } = await supabaseAdmin
        .from("subscriptions")
        .upsert({ 
            organization_id: orgId, 
            plan, 
            status: "active",
            current_period_start: new Date().toISOString(),
            // Set end date to 1 month from now
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }, { onConflict: "organization_id" })

    if (error) {
        console.error("Subscription update error:", error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
    
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
    const role = profiles?.[0]?.role
    
    if (!orgId) return new Response(JSON.stringify({ error: "no_organization" }), { status: 404 })
    if (role !== "admin" && role !== "owner") return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })

    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Downgrade to free immediately
    const { error } = await supabaseAdmin
        .from("subscriptions")
        .update({ 
            plan: "free", 
            status: "active",
            // Keep current_period_end as is or reset it? 
            // Usually we keep it until end of cycle, but user asked to "transfer directly to Free plan".
            // If we want immediate effect, we might not need to change dates, just the plan.
            // But if we want to reflect "cancelled", maybe status should be canceled?
            // However, "free" plan usually implies active usage of free tier.
            // We'll keep the end date as is for now, assuming the user might have paid for the month.
            // But if the goal is to STOP benefits immediately, we should probably reset it.
            // For now, let's just change the plan.
        })
        .eq("organization_id", orgId)

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    
    return Response.json({ ok: true })
}
