"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { getPlanLimits, Plan } from "@/lib/permissions"

export type UsageQuota = {
  plan: Plan
  limit: number
  used: number
  remaining: number
  percentage: number
  resetIn: string
}

export async function getUsageQuota(action: "consultation_query" | "chat_message" | "monitoring_process" | "datalake_query" = "consultation_query"): Promise<UsageQuota | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get Organization ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single()

  const organizationId = profile?.organization_id

  if (!organizationId) return null

  // Get Plan
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("organization_id", organizationId)
    .single()

  const plan = (subs?.plan || "free") as Plan
  const limits = getPlanLimits(plan)
  
  let limit = 0
  let isDaily = true

  if (action === "consultation_query") {
    limit = limits.max_queries
  } else if (action === "chat_message") {
    limit = limits.max_chat_messages
  } else if (action === "monitoring_process") {
    limit = limits.max_monitoring_processes
    isDaily = false
  } else if (action === "datalake_query") {
    limit = limits.max_datalake_queries
  }

  // Use Service Role client to bypass RLS
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let used = 0

  if (isDaily) {
    const today = new Date().toISOString().split('T')[0]
    
    const { data: usage } = await supabaseAdmin
      .from("usage_logs")
      .select("count")
      .eq("organization_id", organizationId)
      .eq("action", action)
      .eq("date", today)
      .single()

    used = usage?.count || 0
  } else {
    // Total Limit Logic (e.g. Monitoring)
    if (action === "monitoring_process") {
       // Get all users in the organization
       const { data: profiles } = await supabaseAdmin
         .from("profiles")
         .select("id")
         .eq("organization_id", organizationId)
       
       const userIds = profiles?.map(p => p.id) || []
       
       if (userIds.length > 0) {
         const { count } = await supabaseAdmin
            .from("monitored_processes")
            .select("*", { count: 'exact', head: true })
            .in("user_id", userIds)
            // .eq("status", "active") // Optional: depending if we count all or just active
         
         used = count || 0
       }
    }
  }

  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - used)
  const percentage = limit === Infinity ? 0 : Math.min(100, (used / limit) * 100)

  // Calculate time until reset (midnight)
  let resetIn = ""
  if (isDaily) {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    resetIn = tomorrow.toISOString()
  }
  
  return {
    plan,
    limit,
    used,
    remaining,
    percentage,
    resetIn
  }
}

// Keep this for backward compatibility if needed, or refactor usages
export async function getConsultationUsage(): Promise<UsageQuota | null> {
  return getUsageQuota("consultation_query")
}
