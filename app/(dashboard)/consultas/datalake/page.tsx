import { DataLakeContent } from "@/components/consultas/datalake-content"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DataLakePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DataLakeContent />
  )
}
