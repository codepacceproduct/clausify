import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const phone = body?.phone as string
  const token = body?.token as string

  const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const userId = data.user?.id
  const email = data.user?.email || null
  const meta = (data.user?.user_metadata as any) || {}
  const name = meta?.name || null
  const surname = meta?.surname || null
  const bio = meta?.bio || null

  if (userId) {
    await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          email,
          phone,
          name,
          surname,
          bio,
          role: "user",
          regional_preferences: {},
        },
        { onConflict: "id" }
      )
  }

  const tokenOut = data.session?.access_token || null
  return NextResponse.json({ token: tokenOut, user: { id: userId, phone, email } })
}
