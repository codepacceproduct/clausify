import { DividaAluguelForm } from "@/components/calculos/divida-aluguel-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DividaAluguelPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <DividaAluguelForm />
}
