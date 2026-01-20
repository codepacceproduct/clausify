import { CapitalSocialForm } from "@/components/calculos/capital-social-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function CapitalSocialPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <CapitalSocialForm />
}
