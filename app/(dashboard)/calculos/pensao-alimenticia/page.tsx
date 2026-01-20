import { PensaoAlimenticiaForm } from "@/components/calculos/pensao-alimenticia-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function PensaoAlimenticiaPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  return <PensaoAlimenticiaForm />
}
