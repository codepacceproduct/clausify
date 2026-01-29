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

  if (profile?.role !== "admin") {
    console.warn("requireAdmin: user is not admin")
    return null
  }

  return user
}

export type UserWithDetails = {
  id: string
  email: string
  name: string
  surname: string
  role: "admin" | "user"
  blocked: boolean
  created_at: string
  organization_id: string
  avatar_url: string | null
  organization?: {
    id: string
    name: string
    owner_id?: string
    subscriptions?: {
      plan: string
      status: string
      current_period_end: string
      amount: number
      created_at: string
    }[]
    payments?: {
      id: string
      amount: number
      status: string
      method: string
      created_at: string
      external_id: string
    }[]
  }
}

export async function getUsers() {
  const admin = await requireAdmin()
  if (!admin) {
    console.warn("getUsers called without admin; returning empty list")
    return []
  }
  const supabase = createAdminClient()
  
  const { data: users, error } = await supabase
    .from("profiles")
    .select(`
      *,
      organization:organizations!profiles_organization_id_fkey(
        id,
        name,
        owner_id,
        subscriptions(
          plan,
          status,
          current_period_end,
          amount,
          created_at
        ),
        payments(
          id,
          amount,
          status,
          method,
          created_at,
          external_id
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  // Sort subscriptions and payments for each user
  const processedUsers = users?.map((user: any) => {
    if (user.organization) {
      // Process Subscriptions
      if (user.organization.subscriptions) {
        if (!Array.isArray(user.organization.subscriptions)) {
          user.organization.subscriptions = [user.organization.subscriptions]
        }
        user.organization.subscriptions.sort((a: any, b: any) => {
          const aActive = a.status === 'active' || a.status === 'paid' ? 1 : 0
          const bActive = b.status === 'active' || b.status === 'paid' ? 1 : 0
          if (aActive !== bActive) return bActive - aActive
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
      }

      // Process Payments
      if (user.organization.payments) {
        if (!Array.isArray(user.organization.payments)) {
          user.organization.payments = [user.organization.payments]
        }
        user.organization.payments.sort((a: any, b: any) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
      }
    }
    return user
  }) as UserWithDetails[]

  return processedUsers
}

export async function updateUserRole(userId: string, role: "admin" | "user") {
  const admin = await requireAdmin()
  if (!admin) {
    console.warn("updateUserRole called without admin")
    return { ok: false, message: "Unauthorized" }
  }
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId)

  if (error) {
    console.error("Failed to update user role", error)
    return { ok: false, message: error.message }
  }

  revalidatePath("/admin/usuarios")
  return { ok: true }
}

export async function updateUserPlan(organizationId: string, planSlug: string) {
  const admin = await requireAdmin()
  if (!admin) {
    console.warn("updateUserPlan called without admin")
    return { ok: false, message: "Unauthorized" }
  }
  const supabase = createAdminClient()

  // First check if a subscription exists
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("organization_id", organizationId)
    .single()

  let error
  if (subscription) {
    const result = await supabase
      .from("subscriptions")
      .update({ plan: planSlug })
      .eq("organization_id", organizationId)
    error = result.error
  } else {
    // Create new subscription if none exists
    const result = await supabase
      .from("subscriptions")
      .insert({
        organization_id: organizationId,
        plan: planSlug,
        status: "active",
        interval: "month" // Default to monthly
      })
    error = result.error
  }

  if (error) {
    console.error("Failed to update user plan", error)
    return { ok: false, message: error.message }
  }

  revalidatePath("/admin/usuarios")
  return { ok: true }
}

export async function toggleUserBlock(userId: string, blocked: boolean) {
  const admin = await requireAdmin()
  if (!admin) {
    console.warn("toggleUserBlock called without admin")
    return { ok: false, message: "Unauthorized" }
  }
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("profiles")
    .update({ blocked })
    .eq("id", userId)

  if (error) {
    console.error("Failed to update user block status", error)
    return { ok: false, message: error.message }
  }

  revalidatePath("/admin/usuarios")
  return { ok: true }
}

export async function adminUpdateUserProfile(input: { userId: string; email: string; name: string; surname: string }) {
  const admin = await requireAdmin()
  if (!admin) {
    console.warn("adminUpdateUserProfile called without admin")
    return { ok: false, message: "Unauthorized" }
  }
  const supabase = createAdminClient()

  const { error: authError } = await supabase.auth.admin.updateUserById(input.userId, {
    email: input.email
  })

  if (authError) {
    console.error("Failed to update auth user", authError)
    return { ok: false, message: authError.message }
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      email: input.email,
      name: input.name,
      surname: input.surname
    })
    .eq("id", input.userId)

  if (profileError) {
    console.error("Failed to update profile", profileError)
    return { ok: false, message: profileError.message }
  }

  revalidatePath("/admin/usuarios")
  return { ok: true }
}

export async function adminSendPasswordReset(email: string) {
  const admin = await requireAdmin()
  if (!admin) {
    console.warn("adminSendPasswordReset called without admin")
    return { ok: false, message: "Unauthorized" }
  }
  const supabase = createAdminClient()

  const { error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email
  })

  if (error) {
    console.error("Failed to send password reset email", error)
    return { ok: false, message: error.message }
  }

  return { ok: true }
}

export async function deleteUser(userId: string) {
    // This is a "soft delete" or blocking mechanism could be implemented here
    // For now, we'll just throw because we haven't decided on a blocking strategy
    // Or we could actually delete from profiles, but that might leave auth users dangling
    throw new Error("Delete user not fully implemented yet")
}
