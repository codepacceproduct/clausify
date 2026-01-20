import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CalculosList } from "@/components/calculos/calculos-list"
import { calculatorCategories, calculatorsList } from "@/lib/constants/calculators"

export const metadata = {
  title: "Calculadoras | Clausify",
  description: "Ferramentas precisas para agilizar seus cálculos trabalhistas, cíveis e previdenciários.",
}

export default async function CalculosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <CalculosList 
      calculators={calculatorsList} 
      categories={calculatorCategories} 
    />
  )
}
