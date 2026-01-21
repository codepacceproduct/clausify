"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath, revalidateTag } from "next/cache"

export type Plan = {
  id: string
  name: string
  slug: string
  config: PlanConfig
  active: boolean
  created_at: string
  updated_at: string
}

export type PlanConfig = {
  max_users: number | null
  max_contracts: number | null
  max_analyses: number | null
  max_queries: number | null
  max_chat_messages: number | null
  max_monitoring_processes: number | null
  max_datalake_queries: number | null
  support_level: string
  features: string[]
  allowed_modules: string[]
  allowed_calculators: string[] | "all"
}

export async function getPlans() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("name")
  
  if (error) throw error
  return data as Plan[]
}

export async function createPlan(data: Partial<Plan>) {
  const supabase = await createClient()
  
  // Validar se já existe slug
  if (data.slug) {
    const { data: existing } = await supabase
      .from("plans")
      .select("id")
      .eq("slug", data.slug)
      .single()
    
    if (existing) throw new Error("Já existe um plano com este identificador (slug).")
  }

  const { error } = await supabase.from("plans").insert(data)
  if (error) throw error
  revalidatePath("/admin/permissoes")
  revalidateTag("plans")
}

export async function updatePlan(id: string, data: Partial<Plan>) {
  const supabase = await createClient()
  const { error } = await supabase.from("plans").update(data).eq("id", id)
  if (error) throw error
  revalidatePath("/admin/permissoes")
  revalidateTag("plans")
}

export async function deletePlan(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("plans").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/admin/permissoes")
  revalidateTag("plans")
}
