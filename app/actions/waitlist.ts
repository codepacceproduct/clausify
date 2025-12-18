"use server"

import { createClient } from "@/lib/supabase/server"
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

export async function getWaitlistCount() {
  const supabase = await createClient()
  const { count, error } = await supabase.from("waitlist").select("*", { count: "exact", head: true })
  
  if (error) {
    console.error("Error fetching waitlist count:", error)
    return 0
  }
  
  return count || 0
}
