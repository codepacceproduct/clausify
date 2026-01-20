import { CalendarioContent } from "@/components/calendario/calendario-content"
import { getEvents } from "@/app/actions/calendar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function CalendarioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Calculate current month range for initial fetch
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  
  // Start of month
  const startDate = new Date(year, month, 1)
  // End of month
  const endDate = new Date(year, month + 1, 0)
  
  const start = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`
  const end = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`
  
  const initialEvents = await getEvents(start, end)

  return (
    <CalendarioContent initialEvents={initialEvents || []} />
  )
}
