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
        // Fallback mock text if DB failed or no content provided
        contractText = "CONTRATO DE PRESTAÇÃO DE SERVIÇOS... (Texto simulado para análise)"
    }

    // Perform RAG Analysis
    const analysisResult = await analyzeContractWithRAG(contractText, analysisType || "detailed")

    // Update DB with results
    if (contractId && !contractId.startsWith("mock-")) {
        await supabase
            .from("contracts")
            .update({ 
                analysis: analysisResult, 
                status: "analyzed",
                risk_level: analysisResult.riskLevel,
                score: analysisResult.score
            })
            .eq("id", contractId)
    }

    return NextResponse.json(analysisResult)

  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
