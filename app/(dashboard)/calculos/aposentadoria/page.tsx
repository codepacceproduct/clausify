import { AposentadoriaForm } from "@/components/calculos/aposentadoria-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AposentadoriaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <AposentadoriaForm />
}
