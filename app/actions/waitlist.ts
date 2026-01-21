"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

export async function updateWaitlistStatus(id: string, status: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("waitlist")
    .update({ status })
    .eq("id", id)

  if (error) {
    throw new Error("Failed to update status")
  }

  revalidatePath("/admin/listadeespera")
  revalidatePath("/admin")
}

export async function deleteWaitlistLead(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("waitlist")
    .delete()
    .eq("id", id)

  if (error) {
    throw new Error("Failed to delete lead")
  }

  revalidatePath("/admin/listadeespera")
  revalidatePath("/admin")
}

export async function getWaitlistCount() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { count, error } = await supabase.from("waitlist").select("*", { count: "exact", head: true })
  
  if (error) {
    console.error("Error fetching waitlist count:", error)
    return 0
  }
  
  return count || 0
}

export async function getWaitlistStats() {
  // Use Service Role client to bypass RLS and avoid recursion issues
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  // Fetch all leads to calculate stats
  // For larger datasets, it would be better to use separate count queries
  const { data: leads, error } = await supabase
    .from("waitlist")
    .select("status, created_at")

  if (error) {
    console.error("Error fetching waitlist stats:", error)
    return {
      total: 0,
      pending: 0,
      contacted: 0,
      converted: 0,
      todaySignups: 0,
      conversionRate: 0,
    }
  }

  const total = leads.length
  const pending = leads.filter((l) => l.status === "pending").length
  const contacted = leads.filter((l) => l.status === "contacted").length
  const converted = leads.filter((l) => l.status === "converted").length
  
  // Calculate today's signups (considering UTC dates)
  const today = new Date().toISOString().split('T')[0]
  const todaySignups = leads.filter((l) => l.created_at.startsWith(today)).length
  
  // Calculate last 7 days growth
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const last7Days = leads.filter((l) => new Date(l.created_at) >= sevenDaysAgo).length

  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0

  return {
    total,
    pending,
    contacted,
    converted,
    todaySignups,
    last7Days,
    conversionRate,
  }
}
