import { IRPFForm } from "@/components/calculos/irpf-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function IRPFPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  return <IRPFForm />
}
