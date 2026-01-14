import { createClient } from "@/lib/supabase/server"
import { DataJudClient, DataJudProcess } from "./client"

export class ProcessService {
  static async saveProcess(data: DataJudProcess) {
    const supabase = await createClient()
    
    // 1. Upsert Process
    const lastMovement = data.movimentos && data.movimentos.length > 0 
      ? data.movimentos.sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())[0]
      : null

    const lastHash = lastMovement 
      ? DataJudClient.generateMovementHash(
          lastMovement.dataHora, 
          lastMovement.nome, 
          lastMovement.complementosTabelados?.map(c => c.descricao).join(", ")
        )
      : null

    const processData = {
      cnj_number: data.numeroProcesso,
      court_alias: data.tribunal || "Unknown",
      justice_branch: "N/A", // Can be derived from J
      class_name: data.classe?.nome,
      subject: "N/A", // API returns subjects array, can be mapped
      last_movement_date: lastMovement ? lastMovement.dataHora : null,
      last_movement_hash: lastHash,
      updated_at: new Date().toISOString()
    }

    const { data: savedProcess, error: processError } = await supabase
      .from('judicial_processes')
      .upsert(processData, { onConflict: 'cnj_number' })
      .select()
      .single()

    if (processError) {
      console.error("Error saving process:", processError)
      return null
    }

    // 2. Save Movements (Ignore duplicates via hash or just insert if new)
    // Ideally we check existence, but for MVP we can use a unique constraint on hash? 
    // The schema has index on hash but not unique constraint. Let's check manually or use upsert if we had ID.
    // We'll iterate and check.
    
    if (data.movimentos) {
      const movementsToInsert = []
      
      for (const mov of data.movimentos) {
        const details = mov.complementosTabelados?.map(c => c.descricao).join(", ") || ""
        const hash = DataJudClient.generateMovementHash(mov.dataHora, mov.nome, details)
        
        // Check if exists (optimization: fetch all hashes for process first)
        const { data: existing } = await supabase
          .from('judicial_movements')
          .select('id')
          .eq('hash', hash)
          .eq('process_id', savedProcess.id)
          .single()

        if (!existing) {
          movementsToInsert.push({
            process_id: savedProcess.id,
            movement_date: mov.dataHora,
            description: mov.nome,
            code: mov.codigo,
            hash: hash,
            details: details
          })
        }
      }

      if (movementsToInsert.length > 0) {
        const { error: movError } = await supabase
          .from('judicial_movements')
          .insert(movementsToInsert)
        
        if (movError) console.error("Error saving movements:", movError)
      }
    }

    return savedProcess
  }

  static async getProcess(cnjNumber: string) {
    const supabase = await createClient()
    const cleanTerm = cnjNumber.replace(/\D/g, "")
    
    const { data, error } = await supabase
      .from('judicial_processes')
      .select(`
        *,
        judicial_movements (
          *
        )
      `)
      .eq('cnj_number', cleanTerm)
      .single()

    if (error) return null
    return data
  }
}
