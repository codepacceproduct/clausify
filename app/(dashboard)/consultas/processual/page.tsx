import { ProcessualContent } from "@/components/consultas/processual-content"
import { getPublicProcessPreviewHistory, getProcessConsultHistory } from "@/actions/datajud-consult"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ProcessualPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch initial history data server-side to prevent loading spinners and flicker
  const [previewHistory, consultHistory] = await Promise.all([
    getPublicProcessPreviewHistory(),
    getProcessConsultHistory()
  ])

  return (
    <ProcessualContent 
      initialPreviewHistory={previewHistory || []}
      initialConsultHistory={consultHistory || []}
    />
  )
}
