import { PartilhaBensForm } from "@/components/calculos/partilha-bens-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function PartilhaBensPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  return <PartilhaBensForm />
}
