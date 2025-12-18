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
