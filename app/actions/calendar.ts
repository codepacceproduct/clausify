'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type EventStatus = 'pending' | 'completed' | 'cancelled';

export type Event = {
  id: string
  title: string
  description?: string
  date: string
  start_time?: string
  end_time?: string
  type: string
  priority: string
  location?: string
  user_id: string
  status: EventStatus
  created_at?: string
  updated_at?: string
}

export async function getEvents(start: string, end: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return data as Event[]
}

export async function createEvent(formData: Partial<Event>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from('events')
    .insert({
      ...formData,
      user_id: user.id,
      status: formData.status || 'pending'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating event:', error)
    throw new Error(error.message)
  }

  revalidatePath('/calendario')
  return data as Event
}

export async function updateEvent(id: string, formData: Partial<Event>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from('events')
    .update({
      ...formData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating event:', error)
    throw new Error(error.message)
  }

  revalidatePath('/calendario')
  return data as Event
}

export async function deleteEvent(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting event:', error)
    throw new Error(error.message)
  }

  revalidatePath('/calendario')
}
