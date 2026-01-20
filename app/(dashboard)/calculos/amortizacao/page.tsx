import { AmortizacaoForm } from "@/components/calculos/amortizacao-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AmortizacaoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <AmortizacaoForm />
}
