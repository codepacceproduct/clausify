import { TrabalhistaCompletoForm } from "@/components/calculos/trabalhista-completo-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function TrabalhistaCompletoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <TrabalhistaCompletoForm />
}