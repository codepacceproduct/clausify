import { CorrecaoMonetariaForm } from "@/components/calculos/correcao-monetaria-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function CorrecaoMonetariaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <CorrecaoMonetariaForm />
}
