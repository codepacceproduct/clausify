"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase-client"

export function WelcomeOwnerToast() {
  useEffect(() => {
    const run = async () => {
      try {
        if (typeof window === "undefined") return
        if (localStorage.getItem("welcomeOwnerToastShown")) return
        const { data: sessionRes } = await supabase.auth.getSession()
        const token = sessionRes.session?.access_token
        if (!token) return
        const { data: userRes } = await supabase.auth.getUser()
        const email = userRes.user?.email || ""

        const res = await fetch(`/api/settings/organization/members?limit=2`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        const total = json?.total || 0
        const members = Array.isArray(json?.members) ? json.members : []
        const me = members.find((m: any) => m.email === email)
        if (total === 1 && me?.role === "owner") {
          toast.success("Bem-vindo! Convide sua equipe e configure domínios permitidos.")
          localStorage.setItem("welcomeOwnerToastShown", "1")
        }
      } catch { void 0 }
    }
    run()
  }, [])

  return null
}
