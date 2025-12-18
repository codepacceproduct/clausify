import { createClient } from "@/lib/supabase/server"

export type WaitlistLead = {
  id: string
  email: string
  name: string
  company?: string
  whatsapp?: string
  status: "pending" | "contacted" | "converted"
  source: string
  createdAt: string
  position: number
}

export async function getWaitlistLeads(): Promise<WaitlistLead[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching leads:", error)
    return []
  }

  return data.map((item, index) => ({
    id: item.id,
    email: item.email,
    name: item.name,
    company: item.company,
    whatsapp: item.whatsapp,
    status: item.status || "pending",
    source: "Site",
    createdAt: item.created_at,
    position: data.length - index
  }))
}
