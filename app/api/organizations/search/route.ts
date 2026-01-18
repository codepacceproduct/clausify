import { supabaseServer } from "@/lib/supabase-server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") || "").trim()

  if (!q || q.length < 2) {
    return Response.json({ organizations: [] })
  }

  const { data, error } = await supabaseServer
    .from("organizations")
    .select("id, name, legal_name, tax_id")
    .ilike("name", `%${q}%`)
    .order("name", { ascending: true })
    .limit(10)

  if (error) {
    return new Response(JSON.stringify({ error: "search_failed" }), { status: 500 })
  }

  const organizations = (data || []).map((org: any) => ({
    id: org.id,
    name: org.name,
    legal_name: org.legal_name,
    tax_id: org.tax_id,
  }))

  return Response.json({ organizations })
}

