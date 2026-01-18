import { supabaseServer } from "@/lib/supabase-server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const rawEmail = (url.searchParams.get("email") || "").trim().toLowerCase()

  if (!rawEmail) {
    return Response.json({ exists: false, valid: false })
  }

  const okEmail = /.+@.+\..+/.test(rawEmail)
  if (!okEmail) {
    return Response.json({ exists: false, valid: false })
  }

  const { data, error } = await supabaseServer.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  })

  if (error) {
    return new Response(JSON.stringify({ error: "check_failed" }), { status: 500 })
  }

  const users = data?.users || []
  const exists = users.some((u: any) => (u.email || "").toLowerCase() === rawEmail)
  return Response.json({ exists, valid: true })
}
