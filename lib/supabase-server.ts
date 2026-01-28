import { createClient } from "@supabase/supabase-js"
import { ENV } from "@/lib/env"

export const supabaseServer = createClient(
  ENV.NEXT_PUBLIC_SUPABASE_URL!,
  ENV.SUPABASE_SERVICE_ROLE_KEY!
)
