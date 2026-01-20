import { RMCRCCForm } from "@/components/calculos/rmc-rcc-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function RMCRCCPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  return <RMCRCCForm />
}
