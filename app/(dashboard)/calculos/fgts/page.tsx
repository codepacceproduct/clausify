import { FGTSForm } from "@/components/calculos/fgts-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function FGTSPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <FGTSForm />
}
