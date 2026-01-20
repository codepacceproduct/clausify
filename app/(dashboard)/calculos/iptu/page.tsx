import { IPTUForm } from "@/components/calculos/iptu-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function IPTUPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  return <IPTUForm />
}
