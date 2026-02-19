import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

let client: SupabaseClient | null = null

if (url && key) {
  client = createClient(url, key)
}

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    throw new Error(
      "Supabase não configurado: defina SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY",
    )
  }
  return client
}
