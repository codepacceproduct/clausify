"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface PermissionsContextType {
  allowedModules: Record<string, boolean>
  role: string
  plan: string
  allowedCalculators: string[] | "all"
  isLoading: boolean
  refreshPermissions: () => Promise<void>
}

const PermissionsContext = createContext<PermissionsContextType>({
  allowedModules: {},
  role: "",
  plan: "free",
  allowedCalculators: [],
  isLoading: true,
  refreshPermissions: async () => {},
})

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [allowedModules, setAllowedModules] = useState<Record<string, boolean>>({})
  const [role, setRole] = useState("")
  const [plan, setPlan] = useState("free")
  const [allowedCalculators, setAllowedCalculators] = useState<string[] | "all">([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshPermissions = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      setIsLoading(false)
      return
    }

    try {
      const token = session.access_token

      // Fetch profile to get role
      const profRes = await fetch(`/api/settings/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (!profRes.ok) throw new Error("Failed to fetch profile")
      
      const { profile } = await profRes.json()
      const userRole = String(profile?.role || "member").toLowerCase()
      setRole(userRole)

      // Fetch permissions
      const permRes = await fetch(`/api/permissions/role`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (!permRes.ok) throw new Error("Failed to fetch permissions")

      const j = await permRes.json()
      const perms = j?.permissions || {}
      const modules = perms[userRole] || {}
      setAllowedModules(modules)
      setPlan(j?.plan || "free")
      setAllowedCalculators(j?.allowed_calculators || [])
    } catch (error) {
      console.error("Error fetching permissions:", error)
      // Fallback or empty permissions
      setAllowedModules({})
      setAllowedCalculators([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshPermissions()
  }, [])

  return (
    <PermissionsContext.Provider value={{ allowedModules, role, plan, allowedCalculators, isLoading, refreshPermissions }}>
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider")
  }
  return context
}
