"use client"

import { supabase } from "@/lib/supabase"

export function isAuthenticated(): boolean {
  if (typeof document === "undefined") return false
  return document.cookie.includes("auth_token=")
}

export async function login(email: string, password: string): Promise<boolean> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.session) return false
  try {
    localStorage.setItem("user_email", email)
    const token = data.session.access_token
    const expiresAt = data.session.expires_at ? new Date(data.session.expires_at * 1000) : new Date(Date.now() + 60 * 60 * 1000)
    const expires = expiresAt.toUTCString()
    document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; expires=${expires}`
    document.cookie = `user_email=${encodeURIComponent(email)}; path=/; expires=${expires}`
  } catch {}
  return true
}

export async function logout(): Promise<void> {
  try {
    await supabase.auth.signOut()
  } catch {}
  try {
    document.cookie = `auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    document.cookie = `user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  } catch {}
  try {
    localStorage.removeItem("user_email")
  } catch {}
}

export function getUserEmail(): string | null {
  if (typeof document === "undefined") return null
  const m = document.cookie.match(/(?:^|; )user_email=([^;]+)/)
  if (m && m[1]) return decodeURIComponent(m[1])
  try {
    return localStorage.getItem("user_email")
  } catch {
    return null
  }
}
