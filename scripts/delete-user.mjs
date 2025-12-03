import { createClient } from "@supabase/supabase-js"

async function main() {
  const email = (process.argv[2] || "").trim().toLowerCase()
  if (!email) {
    console.error("Usage: node scripts/delete-user.mjs <email>")
    process.exit(1)
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  if (!url || !serviceRole) {
    console.error("Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  const admin = createClient(url, serviceRole, { auth: { persistSession: false, autoRefreshToken: false } })

  const { data: userRow } = await admin.from("auth.users").select("id,email").eq("email", email).maybeSingle()
  const userId = userRow?.id || null

  const orgIds = new Set()
  if (userId) {
    const { data: mems } = await admin
      .from("organization_members")
      .select("id,organization_id")
      .or(`user_id.eq.${userId},email.eq.${email}`)
    for (const m of mems || []) orgIds.add(m.organization_id)
  }

  await admin.from("organization_members").delete().or(userId ? `user_id.eq.${userId},email.eq.${email}` : `email.eq.${email}`)
  await admin.from("profiles").delete().or(userId ? `id.eq.${userId},email.eq.${email}` : `email.eq.${email}`)

  if (userId) {
    const { error: delErr } = await admin.auth.admin.deleteUser(userId)
    if (delErr) {
      console.error("Auth delete error:", delErr.message)
    } else {
      const { data: still } = await admin.from("auth.users").select("id").eq("id", userId)
      if (Array.isArray(still) && still.length === 0) {
        console.log("Auth user deleted:", userId)
      } else {
        console.warn("Auth user still present after delete attempt:", userId)
      }
    }
  }

  if (orgIds.size > 0) {
    for (const orgId of orgIds) {
      const { data: cnt } = await admin
        .from("organization_members")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", orgId)
      const count = (cnt && cnt.length) ? cnt.length : 0
      if (count === 0) {
        await admin.from("organizations").delete().eq("id", orgId)
      }
    }
  }

  console.log("Deleted account and associated records for:", email)
}

main().catch((e) => {
  console.error("Failed:", e?.message || e)
  process.exit(1)
})
