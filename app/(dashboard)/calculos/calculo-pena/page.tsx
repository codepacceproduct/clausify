import { CalculoPenaForm } from "@/components/calculos/calculo-pena-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function CalculoPenaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <CalculoPenaForm />
}
