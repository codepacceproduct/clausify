"use client"

import { supabase } from "@/lib/supabase-client"

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return Boolean(localStorage.getItem("sb-${process.env.NEXT_PUBLIC_SUPABASE_URL}-auth-token"))
}

export async function login(email: string, password: string): Promise<boolean> {
  if (!email || !password) return false
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return !error && Boolean(data.session)
}

export async function logout(): Promise<void> {
  try {
    await supabase.auth.signOut()
  } finally {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_email")
  }
}

export async function getUserEmail(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data.user?.email ?? null
}
