import { HorasExtrasForm } from "@/components/calculos/horas-extras-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function HorasExtrasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <HorasExtrasForm />
}
