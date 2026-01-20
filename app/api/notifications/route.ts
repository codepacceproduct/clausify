import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    return new NextResponse(error.message, { status: 500 })
  }

  return NextResponse.json({ notifications })
}

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const { id, read, markAll } = body

  if (markAll) {
    const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false)
    
    if (error) return new NextResponse(error.message, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (!id) {
    return new NextResponse("Missing notification ID", { status: 400 })
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return new NextResponse(error.message, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
