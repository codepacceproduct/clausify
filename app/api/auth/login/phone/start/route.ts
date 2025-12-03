import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const phone = body?.phone as string

  const { error } = await supabase.auth.signInWithOtp({ phone })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ status: "otp_sent" })
}

