"use client"

// Simple authentication helper for client-side
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("auth_token") !== null
}

export function login(email: string, password: string): boolean {
  // Simulate login - in production, this would call your API
  if (email && password) {
    localStorage.setItem("auth_token", "demo_token_" + Date.now())
    localStorage.setItem("user_email", email)
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem("auth_token")
  localStorage.removeItem("user_email")
}

export function getUserEmail(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("user_email")
}
