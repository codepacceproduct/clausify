import { supabaseServer } from "@/lib/supabase-server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = String(url.searchParams.get("q") || "").trim()
  if (!q || q.length < 2) return Response.json({ organizations: [] })
  const { data, error } = await supabaseServer
    .from("organizations")
    .select("id,name,industry,size")
    .ilike("name", `%${q}%`)
    .limit(10)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json({ organizations: data || [] })
}

