import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { analyzeContractWithRAG } from "@/lib/rag"
import { getPlanLimits } from "@/lib/permissions"

export async function POST(request: Request) {
  try {
    const { contractId, content, analysisType } = await request.json()

    // In a real scenario, we would fetch content from DB using contractId
    // For this flow, we might pass content directly if it's a fresh upload, 
    // OR fetch it if we persisted it in the previous step.
    
    let contractText = content
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Check Plan Limits
    let organizationId: string | undefined
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("organization_id")
            .eq("id", user.id)
            .single()
        
        organizationId = profile?.organization_id

        if (organizationId) {
            const { data: subs } = await supabase
                .from("subscriptions")
                .select("plan")
                .eq("organization_id", organizationId)
                .single()
            
            const plan = subs?.plan || "free"
            const limits = await getPlanLimits(plan)
            
            if (limits.max_analyses !== Infinity) {
                // Check DAILY usage
                const today = new Date().toISOString().split('T')[0]
                const { data: usage } = await supabase
                    .from("usage_logs")
                    .select("count")
                    .eq("organization_id", organizationId)
                    .eq("action", "contract_analysis")
                    .eq("date", today)
                    .single()
                
                if ((usage?.count || 0) >= limits.max_analyses) {
                     return NextResponse.json({ 
                        error: `Limite diário de análises atingido para o plano ${plan} (${limits.max_analyses}). Faça upgrade para continuar.` 
                     }, { status: 403 })
                }
            }
        }
    }

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

    // Increment usage
    if (user && organizationId) {
        const today = new Date().toISOString().split('T')[0]
        await supabase.rpc('increment_usage_log', {
            org_id: organizationId,
            action_name: 'contract_analysis',
            log_date: today
        })
    }

    return NextResponse.json(analysisResult)

  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
