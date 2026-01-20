import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ConsultasList } from "@/components/consultas/consultas-list"
import { consultasTools } from "@/lib/constants/consultas"

export const metadata = {
  title: "Consultas & Monitoramento | Clausify",
  description: "Painel unificado para acesso a dados processuais e inteligência jurídica.",
}

export default async function ConsultasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <ConsultasList tools={consultasTools} />
  )
}
