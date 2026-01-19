import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const supabase = await createClient()
    const { id } = params

    // Check if user has access to the contract
    const { data: contract, error: contractError } = await supabase
      .from("contracts")
      .select("id, name")
      .eq("id", id)
      .single()

    if (contractError || !contract) {
      return NextResponse.json({ error: "Contract not found or unauthorized" }, { status: 404 })
    }

    // Fetch versions
    const { data: versions, error: versionsError } = await supabase
      .from("contract_versions")
      .select(`
        id,
        version_number,
        created_at,
        changes_summary,
        status,
        created_by,
        content
      `)
      .eq("contract_id", id)
      .order("created_at", { ascending: false })

    if (versionsError) {
        // If table doesn't exist yet, return empty list (or mock for now if we want to be safe, but goal is real data)
        if (versionsError.code === '42P01') {
             return NextResponse.json([])
        }
        throw versionsError
    }

    return NextResponse.json(versions)
  } catch (error: any) {
    console.error("Error fetching versions:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const supabase = await createClient()
    const { id } = params
    const json = await request.json()
    let { content, version_number, changes_summary, analysis } = json

    // Verify contract ownership
    const { data: contract, error: contractError } = await supabase
        .from("contracts")
        .select("id, user_id")
        .eq("id", id)
        .single()
    
    if (contractError || !contract) {
        return NextResponse.json({ error: "Contract not found" }, { status: 404 })
    }

    // Handle auto versioning
    if (version_number === "auto") {
        const { data: latestVersion } = await supabase
            .from("contract_versions")
            .select("version_number")
            .eq("contract_id", id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

        if (latestVersion && latestVersion.version_number) {
            const lastVer = parseInt(String(latestVersion.version_number))
            version_number = isNaN(lastVer) ? 1 : lastVer + 1
        } else {
            version_number = 1
        }
    }

    // Create new version
    const { data, error } = await supabase
      .from("contract_versions")
      .insert({
        contract_id: id,
        version_number,
        content,
        changes_summary,
        analysis,
        created_by: contract.user_id // Assuming the creator is the contract owner for now
      })
      .select()
      .single()

    if (error) throw error

    // Update contract current version reference
    await supabase
        .from("contracts")
        .update({ 
            current_version: version_number,
            updated_at: new Date().toISOString()
        })
        .eq("id", id)

    return NextResponse.json(data)

  } catch (error: any) {
    console.error("Error creating version:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
