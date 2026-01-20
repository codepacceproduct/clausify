import { RevisaoFinanciamentoForm } from "@/components/calculos/revisao-financiamento-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function RevisaoFinanciamentoPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  return <RevisaoFinanciamentoForm />
}
