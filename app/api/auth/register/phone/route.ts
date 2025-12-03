import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const phone = body?.phone as string
  const name = body?.name as string | undefined
  const surname = body?.surname as string | undefined
  const bio = body?.bio as string | undefined
  const password = body?.password as string | undefined

  const { data, error } = await supabase.auth.signUp({
    phone,
    password,
    options: { data: { ...(name ? { name } : {}), ...(surname ? { surname } : {}), ...(bio ? { bio } : {}), phone } },
  })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ status: "otp_sent", userId: data.user?.id ?? null })
}
