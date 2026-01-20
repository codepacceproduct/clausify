import { ITBIForm } from "@/components/calculos/itbi-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ITBIPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  return <ITBIForm />
}
