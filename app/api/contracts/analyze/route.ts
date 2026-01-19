import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { analyzeContractWithRAG } from "@/lib/rag"

export async function POST(request: Request) {
  try {
    const { contractId, content, analysisType } = await request.json()

    // In a real scenario, we would fetch content from DB using contractId
    // For this flow, we might pass content directly if it's a fresh upload, 
    // OR fetch it if we persisted it in the previous step.
    
    let contractText = content
    const supabase = await createClient()

    if (!contractText && contractId) {
        const { data } = await supabase
            .from("contracts")
            .select("content")
            .eq("id", contractId)
            .single()
        
        contractText = data?.content
    }

    if (!contractText) {
        throw new Error("No contract content found for analysis. Please ensure the file was uploaded correctly.")
    }

    // Perform RAG Analysis
    const analysisResult = await analyzeContractWithRAG(contractText, analysisType || "detailed")

    // Update DB with results and create new version
    if (contractId && !contractId.startsWith("mock-")) {
        // Get user for created_by field
        const { data: { user } } = await supabase.auth.getUser()

        // 1. Get current version number
        const { data: currentContract } = await supabase
            .from("contracts")
            .select("current_version")
            .eq("id", contractId)
            .single()

        const nextVersion = (currentContract?.current_version || 0) + 1

        // 2. Insert new version
        const { error: versionError } = await supabase.from("contract_versions").insert({
            contract_id: contractId,
            version_number: nextVersion,
            content: contractText,
            analysis: analysisResult,
            status: "analyzed",
            created_by: user?.id
        })

        if (versionError) {
            console.error("Error creating contract version:", versionError)
        }

        // 3. Update main contract
        await supabase
            .from("contracts")
            .update({ 
                analysis: analysisResult, 
                status: "analyzed",
                risk_level: analysisResult.riskLevel,
                score: analysisResult.score,
                current_version: nextVersion
            })
            .eq("id", contractId)
    }

    return NextResponse.json(analysisResult)

  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
