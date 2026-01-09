
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
    try {
        const { contractId, issueId, resolution } = await request.json()
        
        if (!contractId || !issueId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const supabase = await createClient()

        // Fetch current analysis
        const { data: contract, error: fetchError } = await supabase
            .from("contracts")
            .select("analysis")
            .eq("id", contractId)
            .single()

        if (fetchError || !contract) {
            throw new Error("Contract not found")
        }

        const analysis = contract.analysis || {}
        const issues = analysis.issues || []

        // Update the specific issue
        let issueFound = false
        const updatedIssues = issues.map((issue: any) => {
            if (issue.id === issueId) {
                issueFound = true
                return {
                    ...issue,
                    resolved: true,
                    finalText: resolution, // Store the text that was accepted (original, suggestion, or manual edit)
                    status: "resolved"
                }
            }
            return issue
        })

        if (!issueFound) {
             return NextResponse.json({ error: "Issue not found" }, { status: 404 })
        }

        // Update the database
        const { error: updateError } = await supabase
            .from("contracts")
            .update({
                analysis: { ...analysis, issues: updatedIssues }
            })
            .eq("id", contractId)

        if (updateError) {
            throw updateError
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error("Error resolving issue:", error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }
}
