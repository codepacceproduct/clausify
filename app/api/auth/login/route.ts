import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const email = body?.email as string
  const password = body?.password as string

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    const { data: authUser } = await supabaseAdmin.from("auth.users").select("id").eq("email", email).maybeSingle()
    if (!authUser) {
      return NextResponse.json({ error: "account_not_found" }, { status: 404 })
    }
    return NextResponse.json({ error: "wrong_password" }, { status: 401 })
  }
  const token = data.session?.access_token || null
  const userEmail = data.user?.email || email
  return NextResponse.json({ token, user: { email: userEmail, id: data.user?.id } })
}
