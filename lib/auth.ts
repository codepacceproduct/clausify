"use client"

import { createClient } from "@/lib/supabase/client"

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  // Check for Supabase session cookie
  return document.cookie.includes("sb-") && document.cookie.includes("-auth-token")
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function register(
  name: string,
  email: string,
  password: string,
  metadata?: { organization?: string; surname?: string },
): Promise<{ success: boolean; message: string; needsConfirmation?: boolean }> {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        name: name,
        surname: metadata?.surname || "",
        organization: metadata?.organization || "",
      },
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
    },
  })

  if (error) {
    if (error.message.includes("already registered")) {
      return { success: false, message: "Este e-mail já está cadastrado" }
    }
    return { success: false, message: error.message }
  }

  // Check if email confirmation is required
  if (data.user && !data.session) {
    return {
      success: true,
      message: "Verifique seu e-mail para confirmar sua conta",
      needsConfirmation: true,
    }
  }

  return { success: true, message: "Conta criada com sucesso!" }
}

export async function resetPassword(email: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
      ? `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL}/redefinir-senha`
      : `${window.location.origin}/redefinir-senha`,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: "E-mail de recuperação enviado!" }
}

export async function updatePassword(newPassword: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: "Senha atualizada com sucesso!" }
}

export async function logout(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_email")
    localStorage.removeItem("user_name")
  }
}

export async function getUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export function getUserEmail(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem("user_email")
  } catch {
    return null
  }
}

export function getUserName(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem("user_name")
  } catch {
    return null
  }
}

export function getAuthToken(): string | null {
  if (typeof document === "undefined") return null
  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=")
    if (name.includes("-auth-token")) {
      return decodeURIComponent(value)
    }
  }
  return null
}

export async function syncAuthCookies(): Promise<void> {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session?.user) {
    try {
      localStorage.setItem("user_email", session.user.email || "")
      localStorage.setItem("user_name", session.user.user_metadata?.full_name || session.user.email || "")
    } catch {}
  }
}
