import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: contracts, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    if (error) {
        // If table doesn't exist, return empty list gracefully
        if (error.code === '42P01') { 
            return NextResponse.json({ contracts: [] })
        }
        console.error("Error fetching contracts:", error)
        throw error
    }

    return NextResponse.json({ contracts: contracts || [] })

  } catch (error: any) {
    console.error("List contracts error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
