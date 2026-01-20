import { PISCOFINSForm } from "@/components/calculos/pis-cofins-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function PISCOFINSPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  return <PISCOFINSForm />
}
