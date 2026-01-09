import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const missingTables: string[] = []

    // Check contracts table
    const { error: contractsError } = await supabase.from("contracts").select("id").limit(1)
    if (contractsError && contractsError.code === '42P01') {
        missingTables.push('contracts')
    }

    // Check events table
    const { error: eventsError } = await supabase.from("events").select("id").limit(1)
    if (eventsError && eventsError.code === '42P01') {
        missingTables.push('events')
    }

    if (missingTables.length > 0) {
        return NextResponse.json({ exists: false, missingTables })
    }

    return NextResponse.json({ exists: true, missingTables: [] })
  } catch (error) {
    return NextResponse.json({ exists: false, error: String(error) })
  }
}
