"use server"

import { DataJudClient, DataJudProcess } from "@/lib/datajud/client"
import { ProcessService } from "@/lib/datajud/db"

export async function consultDataJud(term: string, type: "process" | "cpf") {
  // Only process search is supported for now in this robust implementation
  if (type === "process") {
    try {
      // 1. Consult DataJud via isolated client
      const processData = await DataJudClient.consultProcess(term)
      
      if (processData) {
        // 2. Save to database (asynchronous, best effort)
        try {
          await ProcessService.saveProcess(processData)
        } catch (dbError) {
          console.error("Warning: Failed to save process to database:", dbError)
          // Continue to return data even if save fails
        }

        // 3. Map response for UI
        return mapDataJudResponse(processData)
      }
      
      return null
    } catch (error) {
      console.error("Error in consultDataJud action:", error)
      return null
    }
  } else {
    // CPF search implementation pending or via different client method
    console.warn("CPF search not fully implemented in new architecture")
    return null
  }
}

interface ProcessDocument {
  id: string
  title: string
  date: string
  type: string
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
                        documentKeywords.some(k => c.nome.toLowerCase().includes(k) || c.descricao?.toLowerCase().includes(k))
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
