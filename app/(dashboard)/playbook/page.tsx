import { PlaybookContent } from "@/components/playbook/playbook-content"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function PlaybookPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [rulesRes, clausesRes] = await Promise.all([
    supabase.from("playbook_rules").select("*").eq("active", true).order("id"),
    supabase.from("playbook_clauses").select("*").order("id")
  ])

  const initialRules = (rulesRes.data || []).map(item => ({
    id: item.id,
    trigger: item.trigger || "Sempre que identificar...",
    condition: item.rule, // Mapping old 'rule' to 'condition'
    action: item.action || "Sinalizar risco",
    behavior: item.behavior || "Alerta no relatório",
    observation: item.observation || item.rationale || "",
    severity: item.severity,
    category: item.category,
    active: item.active,
    lastUpdated: item.last_updated
  }))

  const initialClauses = (clausesRes.data || []).map(item => ({
    ...item,
    usageCount: item.usage_count,
    lastUpdated: item.last_updated
  }))

  const initialTemplates: any[] = []
  
  return (
    <PlaybookContent 
      initialRules={initialRules}
      initialClauses={initialClauses}
      initialTemplates={initialTemplates}
    />
  )
}
