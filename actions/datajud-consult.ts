"use server"

import { createClient as createAdminClient } from "@supabase/supabase-js"
import { randomUUID } from "crypto"
import { DataJudClient, DataJudProcess } from "@/lib/datajud/client"
import { ProcessService } from "@/lib/datajud/db"
import { createClient } from "@/lib/supabase/server"
import { getPlanLimits } from "@/lib/permissions"

export async function consultDataJud(term: string, type: "process" | "cpf") {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Check Plan Limits
  let organizationId: string | undefined
  const { data: { user } } = await supabase.auth.getUser()
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

      if (limits.max_queries !== Infinity) {
        // Check DAILY usage
        const today = new Date().toISOString().split('T')[0]
        
        // Use Service Role client to bypass RLS for usage logs
        const { data: usage } = await supabaseAdmin
          .from("usage_logs")
          .select("count")
          .eq("organization_id", organizationId)
          .eq("action", "consultation_query")
          .eq("date", today)
          .single()

        if ((usage?.count || 0) >= limits.max_queries) {
          throw new Error(`Limite diário de consultas atingido para o plano ${plan} (${limits.max_queries}). Faça upgrade para continuar.`)
        }
      }
    }
  }

  if (type === "process") {
    try {
      const processData = await DataJudClient.consultProcess(term)
      
      if (processData) {
        try {
          await ProcessService.saveProcess(processData)
        } catch (dbError) {
          console.error("Warning: Failed to save process to database:", dbError)
        }

        try {
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (user) {
            const cleanNumber = processData.numeroProcesso?.replace(/\D/g, "") || null

            await supabase.from("process_consult_history").insert({
              user_id: user.id,
              term,
              type,
              cnj_number: cleanNumber,
            })
          }
        } catch (historyError) {
          console.error("Warning: Failed to save process consult history:", historyError)
        }

        // Increment usage
        if (organizationId) {
          const today = new Date().toISOString().split('T')[0]
          await supabase.rpc('increment_usage_log', {
            org_id: organizationId,
            action_name: 'consultation_query',
            log_date: today
          })
        }

        return mapDataJudResponse(processData)
      }
      
      return null
    } catch (error) {
      console.error("Error in consultDataJud action:", error)
      return null
    }
  } else {
    try {
      const processes = await DataJudClient.consultByCpf(term, "tjse")
      
      if (processes && processes.length > 0) {
        const mapped = processes.map(mapDataJudResponse)

        try {
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (user) {
            await supabase.from("process_consult_history").insert({
              user_id: user.id,
              term,
              type,
              cnj_number: null,
            })
          }
        } catch (historyError) {
          console.error("Warning: Failed to save cpf consult history:", historyError)
        }
        
        // Increment usage
        if (organizationId) {
          const today = new Date().toISOString().split('T')[0]
          await supabase.rpc('increment_usage_log', {
            org_id: organizationId,
            action_name: 'consultation_query',
            log_date: today
          })
        }

        if (mapped.length === 1) {
          return mapped[0]
        }
        
        return mapped
      }
      
      return null
    } catch (error) {
      console.error("Error in consultDataJud action (CPF):", error)
      return null
    }
  }
}

interface ProcessDocument {
  id: string
  title: string
  date: string
  type: string
}

export interface ProcessPreviewPayload {
  processNumber: string
  title: string
  status: string
  events: any[]
  documents?: ProcessDocument[]
}

export interface PublicProcessPreviewHistoryItem {
  id: string
  token: string
  cnj_number: string
  expires_at: string
  created_at: string
}

export interface ProcessConsultHistoryItem {
  id: string
  term: string
  type: "process" | "cpf"
  cnj_number: string | null
  created_at: string
}

export async function createPublicProcessPreview(payload: ProcessPreviewPayload, expiresInHours: number) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const token = randomUUID().replace(/-/g, "")
  const now = new Date()
  const expiresAt = new Date(now.getTime() + expiresInHours * 60 * 60 * 1000)

  const cleanNumber = payload.processNumber.replace(/\D/g, "")

  console.log("PublicProcessPreview:create:start", {
    token,
    cnj_number: cleanNumber,
    expiresAt: expiresAt.toISOString(),
    expiresInHours,
    user_id: user.id
  })

  const { data, error } = await supabase
    .from("process_public_previews")
    .insert({
      token,
      cnj_number: cleanNumber,
      payload,
      expires_at: expiresAt.toISOString(),
      user_id: user.id
    })
    .select("token, expires_at")
    .single()

  if (error) {
    console.error("PublicProcessPreview:create:error", {
      token,
      cnj_number: cleanNumber,
      expiresAt: expiresAt.toISOString(),
      error,
    })
    return null
  }

  console.log("PublicProcessPreview:create:success", {
    token: data.token,
    expires_at: data.expires_at,
  })

  return {
    token: data.token as string,
    expiresAt: data.expires_at as string,
  }
}

export async function getPublicProcessPreviewHistory(): Promise<PublicProcessPreviewHistoryItem[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("process_public_previews")
    .select("id, token, cnj_number, expires_at, created_at, payload")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100)

  if (error || !data) {
    console.error("Error fetching public process preview history:", error)
    return []
  }

  return data.map((item: any) => ({
    id: item.id,
    token: item.token,
    cnj_number: item.cnj_number,
    expires_at: item.expires_at,
    created_at: item.created_at,
    title: item.payload?.title || "Sem título",
    process_number: item.cnj_number,
    active: new Date(item.expires_at) > new Date()
  }))
}

export async function deletePublicProcessPreview(token: string): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from("process_public_previews")
    .delete()
    .eq("token", token)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error deleting public process preview:", error)
    throw new Error(error.message)
  }
}

export async function getProcessConsultHistory(): Promise<ProcessConsultHistoryItem[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("process_consult_history")
    .select("id, term, type, cnj_number, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100)

  if (error || !data) {
    console.error("Error fetching process consult history:", error)
    return []
  }

  return data as ProcessConsultHistoryItem[]
}

function mapDataJudResponse(process: DataJudProcess) {
  // Sort movements by date (descending)
  const sortedMovements = process.movimentos?.sort((a, b) => 
    new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
  ) || []

  // Extract documents from movements
  const documents: ProcessDocument[] = []
  
  // Keywords that suggest a document exists
  const documentKeywords = [
    "petição", "certidão", "mandado", "ofício", "despacho", 
    "sentença", "decisão", "ato", "documento", "laudo", "termo"
  ]

  sortedMovements.forEach((mov, index) => {
    const lowerName = mov.nome.toLowerCase()
    
    // Check if movement name or its complements indicate a document
    const isDocument = documentKeywords.some(keyword => lowerName.includes(keyword)) ||
                      mov.complementosTabelados?.some(c => 
                        documentKeywords.some(k => (c.nome || "").toLowerCase().includes(k) || (c.descricao || "").toLowerCase().includes(k))
                      )

    if (isDocument) {
      // Use the specific complement name if available (usually more descriptive), otherwise the movement name
      const specificName = mov.complementosTabelados?.find(c => 
        documentKeywords.some(k => c.nome.toLowerCase().includes(k))
      )?.nome

      documents.push({
        id: `doc-${index}`,
        title: specificName || mov.nome,
        date: formatDate(mov.dataHora),
        type: "pdf" // Placeholder type
      })
    }
  })

  // Map to ProcessEvent structure
  const events = sortedMovements.map((mov, index) => ({
    id: `evt-${index}`,
    date: formatDate(mov.dataHora),
    description: mov.nome,
    details: mov.complementosTabelados?.map(c => c.nome).join(", ") || "",
    // Simple translation logic
    translation: "Movimentação oficial registrada.",
  }))

  return {
    processNumber: process.numeroProcesso,
    title: process.classe?.nome || "Processo Judicial",
    status: sortedMovements.length > 0 ? sortedMovements[0].nome : "Aguardando movimentação",
    events: events,
    documents: documents
  }
}

function formatDate(dateString: string) {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR").format(date)
  } catch (e) {
    return dateString
  }
}
