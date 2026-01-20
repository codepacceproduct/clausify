import { IndenizacaoForm } from "@/components/calculos/indenizacao-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function IndenizacaoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <IndenizacaoForm />
}
