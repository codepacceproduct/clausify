"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function requireAdmin() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error("Failed to get auth user in requireAdmin", error)
    return null
  }

  const user = data.user
  if (!user) {
    console.warn("requireAdmin: no authenticated user found")
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError) {
    console.error("requireAdmin: failed to load profile", profileError)
    return null
  }

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    console.warn("requireAdmin: user is not admin")
    return null
  }

  return user
}

export type OrganizationMember = {
  id: string
  email: string
  name: string
  surname: string
  avatar_url: string | null
  role: "owner" | "member"
}

export async function getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
  const admin = await requireAdmin()
  if (!admin) return []
  
  const supabase = createAdminClient()
  
  // Get organization owner_id first
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("owner_id")
    .eq("id", organizationId)
    .single()
    
  if (orgError) {
    console.error("Failed to fetch organization", orgError)
    return []
  }

  // Get profiles in this organization
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, name, surname, avatar_url")
    .eq("organization_id", organizationId)
  
  if (profilesError) {
    console.error("Failed to fetch members", profilesError)
    return []
  }

  return profiles.map(p => ({
    ...p,
    role: p.id === org.owner_id ? "owner" : "member"
  }))
}

export async function addMemberToOrganization(organizationId: string, email: string) {
  const admin = await requireAdmin()
  if (!admin) return { ok: false, message: "Unauthorized" }
  
  const supabase = createAdminClient()
  
  // Find user by email
  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single()
    
  if (userError || !user) {
    return { ok: false, message: "Usuário não encontrado com este e-mail" }
  }
  
  // Update user's organization
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ organization_id: organizationId })
    .eq("id", user.id)
    
  if (updateError) {
    return { ok: false, message: updateError.message }
  }
  
  revalidatePath("/admin/usuarios")
  return { ok: true }
}

export async function removeMemberFromOrganization(userId: string) {
  const admin = await requireAdmin()
  if (!admin) return { ok: false, message: "Unauthorized" }
  
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from("profiles")
    .update({ organization_id: null })
    .eq("id", userId)
    
  if (error) {
    return { ok: false, message: error.message }
  }
  
  revalidatePath("/admin/usuarios")
  return { ok: true }
}

export async function transferOwnership(organizationId: string, newOwnerId: string) {
  const admin = await requireAdmin()
  if (!admin) return { ok: false, message: "Unauthorized" }
  
  const supabase = createAdminClient()
  
  // Verify new owner is in the organization (optional, but good practice)
  // Actually prompt says "transferir liderança... para qualquer membro". 
  // Let's ensure they are a member first, or implicitly make them one?
  // Let's just update the owner_id.
  
  const { error } = await supabase
    .from("organizations")
    .update({ owner_id: newOwnerId })
    .eq("id", organizationId)
    
  if (error) {
    return { ok: false, message: error.message }
  }
  
  revalidatePath("/admin/usuarios")
  return { ok: true }
}
