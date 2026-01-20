import { PlaybookContent } from "@/components/playbook/playbook-content"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function PlaybookPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [rulesRes, clausesRes, templatesRes, fallbacksRes] = await Promise.all([
    supabase.from("playbook_rules").select("*").eq("active", true).order("id"),
    supabase.from("playbook_clauses").select("*").order("id"),
    supabase.from("playbook_templates").select("*").order("id"),
    supabase.from("playbook_fallbacks").select("*").order("id")
  ])

  const initialRules = (rulesRes.data || []).map(item => ({
    ...item,
    lastUpdated: item.last_updated
  }))

  const initialClauses = (clausesRes.data || []).map(item => ({
    ...item,
    usageCount: item.usage_count,
    lastUpdated: item.last_updated
  }))

  const initialTemplates = (templatesRes.data || []).map(item => ({
    ...item,
    clauses: item.clauses_count,
    lastUpdated: item.last_updated
  }))

  const initialFallbacks = (fallbacksRes.data || []).map(item => ({
    ...item,
    originalClause: item.original_clause,
    fallbackClause: item.fallback_clause,
    usageCount: item.usage_count,
    lastUsed: item.last_used
  }))
  
  return (
    <PlaybookContent 
      initialRules={initialRules}
      initialClauses={initialClauses}
      initialTemplates={initialTemplates}
      initialFallbacks={initialFallbacks}
    />
  )
}
