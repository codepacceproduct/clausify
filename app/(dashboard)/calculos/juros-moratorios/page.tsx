import { JurosMoratoriosForm } from "@/components/calculos/juros-moratorios-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function JurosMoratoriosPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  return <JurosMoratoriosForm />
}
