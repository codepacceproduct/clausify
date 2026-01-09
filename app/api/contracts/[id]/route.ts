import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseServer as adminSupabase } from "@/lib/supabase-server"

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: contract, error } = await supabase
      .from("contracts")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 })
    }

    return NextResponse.json(contract)
  } catch (error: any) {
    console.error("Error fetching contract:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const supabase = await createClient()
    const { id } = params

    // Check if contract exists and verify ownership
    const { data: contract, error: checkError } = await supabase
      .from("contracts")
      .select("id, user_id")
      .eq("id", id)
      .single()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (checkError || !contract) {
      console.error("Contract check failed:", checkError)
      return NextResponse.json({ error: "Contract not found" }, { status: 404 })
    }

    console.log(`Deleting contract ${id}. User: ${user?.id}, Owner: ${contract.user_id}`)

    if (user?.id !== contract.user_id) {
         console.error("Permission denied: User ID mismatch")
         return NextResponse.json({ error: "Permission denied - Not the owner" }, { status: 403 })
     }

     if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
       console.error("Missing SUPABASE_SERVICE_ROLE_KEY")
       throw new Error("Server configuration error")
     }

     // Delete contract using admin client to bypass RLS issues
     // We already verified ownership above
    const { error, data } = await adminSupabase
      .from("contracts")
      .delete()
      .eq("id", id)
      .select()

    if (error) {
      console.error("Supabase delete error:", error)
      throw error
    }

    if (!data || data.length === 0) {
      throw new Error("Deletion failed - Check permissions")
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting contract:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to delete contract",
      details: error
    }, { status: 500 })
  }
}
