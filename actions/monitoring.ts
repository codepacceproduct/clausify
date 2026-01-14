"use server"

import { createClient } from "@/lib/supabase/server"
import { DataJudClient } from "@/lib/datajud/client"
import { ProcessService } from "@/lib/datajud/db"
import { revalidatePath } from "next/cache"

export type MonitoringFrequency = "daily" | "6h" | "1h"

export async function addMonitoredProcess(
  processNumber: string, 
  nickname: string, 
  frequency: MonitoringFrequency
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: "Usuário não autenticado" }
  }

  try {
    // 1. Ensure process exists in DB (fetch from DataJud if needed)
    // Clean number first
    const cleanNumber = processNumber.replace(/\D/g, "")
    
    // Check if process exists
    let process = await ProcessService.getProcess(cleanNumber)
    
    if (!process) {
      // Fetch from DataJud
      const dataJudResult = await DataJudClient.consultProcess(cleanNumber)
      if (!dataJudResult) {
        return { success: false, error: "Processo não encontrado no DataJud" }
      }
      
      // Save to DB
      process = await ProcessService.saveProcess(dataJudResult)
    }

    if (!process) {
      return { success: false, error: "Falha ao salvar dados do processo" }
    }

    // 2. Add to monitored_processes
    // Calculate next check based on frequency (immediate or delayed?)
    // Let's set next_check_at to NOW() so it runs on next cron, or NOW + interval
    // Defaulting to NOW() + interval to avoid immediate redundant check if we just fetched it.
    const intervalHours = frequency === "1h" ? 1 : frequency === "6h" ? 6 : 24
    const nextCheck = new Date()
    nextCheck.setHours(nextCheck.getHours() + intervalHours)

    const { error } = await supabase
      .from("monitored_processes")
      .insert({
        user_id: user.id,
        process_id: process.id,
        nickname: nickname || process.class_name || "Sem nome",
        frequency: frequency,
        status: "active",
        last_check_at: new Date().toISOString(), // We just fetched it effectively
        next_check_at: nextCheck.toISOString()
      })

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { success: false, error: "Este processo já está sendo monitorado por você" }
      }
      console.error("Error adding monitored process:", error)
      return { success: false, error: "Erro ao adicionar monitoramento" }
    }

    revalidatePath("/consultas/monitoramento")
    return { success: true }

  } catch (error) {
    console.error("Error in addMonitoredProcess:", error)
    return { success: false, error: "Erro interno no servidor" }
  }
}

export async function getMonitoredProcesses() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data, error } = await supabase
    .from("monitored_processes")
    .select(`
      *,
      process:judicial_processes (
        cnj_number,
        class_name,
        last_movement_date,
        judicial_movements (count)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching monitored processes:", error)
    return []
  }

  // Map to UI structure
  return data.map(item => ({
    id: item.id,
    processNumber: item.process.cnj_number,
    nickname: item.nickname,
    status: item.status,
    lastUpdate: item.process.last_movement_date || item.last_check_at,
    movements: item.process.judicial_movements[0]?.count || 0, // Approximate
    frequency: item.frequency,
    nextCheck: item.next_check_at
  }))
}

export async function deleteMonitoredProcess(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("monitored_processes")
    .delete()
    .eq("id", id)

  if (error) return { success: false, error: error.message }
  revalidatePath("/consultas/monitoramento")
  return { success: true }
}

export async function updateMonitoringStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("monitored_processes")
    .update({ status })
    .eq("id", id)

  if (error) return { success: false, error: error.message }
  revalidatePath("/consultas/monitoramento")
  return { success: true }
}

// CRON JOB LOGIC
export async function runMonitoringJob() {
  // This should be called by a cron trigger (e.g., Vercel Cron)
  // Since we don't have a user context in cron, we need admin client or service role
  const supabase = await createClient() // Note: This uses cookie-based auth by default, might need service role for cron
  // For now, assuming this is triggered by an authenticated admin or we use a service key client (not available in standard createClient here usually)
  // Let's assume we use standard client but this function is called from an API route that might have a secret key.
  
  // Actually, for this "pair programming" scope, let's assume we can query freely or this runs when a user visits a "dashboard" (polling).
  // But a true cron needs service role. 
  // IMPORTANT: For this demo, I will just select processes that need update.
  
  // Fetch active monitored processes due for check
  const now = new Date().toISOString()
  
  const { data: dueProcesses, error } = await supabase
    .from("monitored_processes")
    .select(`
      id,
      frequency,
      process:judicial_processes (
        id,
        cnj_number,
        last_movement_hash
      )
    `)
    .eq("status", "active")
    .lte("next_check_at", now)
    .limit(10) // Process in batches
  
  if (error) return { success: false, error: error.message }
  if (!dueProcesses || dueProcesses.length === 0) return { success: true, message: "No processes due" }

  let updatedCount = 0
  
  for (const item of dueProcesses) {
    try {
      const cnj = item.process.cnj_number
      
      // Consult DataJud
      const dataJudResult = await DataJudClient.consultProcess(cnj)
      
      if (dataJudResult) {
        // Save/Update Process
        await ProcessService.saveProcess(dataJudResult)
        
        // Calculate new next_check_at
        const intervalHours = item.frequency === "1h" ? 1 : item.frequency === "6h" ? 6 : 24
        const nextCheck = new Date()
        nextCheck.setHours(nextCheck.getHours() + intervalHours)
        
        // Update monitored_process record
        await supabase
          .from("monitored_processes")
          .update({
            last_check_at: new Date().toISOString(),
            next_check_at: nextCheck.toISOString()
          })
          .eq("id", item.id)
          
        updatedCount++
      }
    } catch (e) {
      console.error(`Failed to update process ${item.process.cnj_number}:`, e)
    }
  }

  return { success: true, updated: updatedCount }
}
