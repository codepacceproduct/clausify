import { INSSForm } from "@/components/calculos/inss-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function INSSPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  return <INSSForm />
}
