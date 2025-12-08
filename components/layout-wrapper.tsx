"use client"

import type { ReactNode } from "react"

import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Menu } from 'lucide-react'
import { getUserEmail, getAuthToken } from "@/lib/auth"
import { usePathname, useRouter } from "next/navigation"

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [allowedModules, setAllowedModules] = useState<Record<string, boolean>>({})
  const [permsLoaded, setPermsLoaded] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [prefs, setPrefs] = useState<{ language?: string; timezone?: string; dateFormat?: string }>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("prefs") : null
      if (raw) return JSON.parse(raw)
    } catch {}
    return {}
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)

      if (width >= 768) {
        setIsMobileMenuOpen(false)
      }

      const sidebar = document.querySelector("aside")
      if (sidebar) {
        const sidebarWidth = sidebar.offsetWidth
        setIsCollapsed(sidebarWidth < 100)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    const interval = setInterval(handleResize, 100)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const handler = (e: any) => {
      const d = e?.detail || {}
      setPrefs(d)
    }
    window.addEventListener("preferences:updated", handler)
    return () => {
      window.removeEventListener("preferences:updated", handler)
    }
  }, [])

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (prefs.language) document.documentElement.setAttribute("lang", prefs.language)
      if ((document.documentElement as any).dataset) {
        ;(document.documentElement as any).dataset.dateFormat = prefs.dateFormat || ""
        ;(document.documentElement as any).dataset.timezone = prefs.timezone || ""
      }
    }
    if (typeof window !== "undefined") {
      ;(window as any).__prefs = prefs
    }
  }, [prefs])

  useEffect(() => {
    const load = async () => {
      const email = getUserEmail()
      if (!email) { setPermsLoaded(true); return }
      try {
        const token = getAuthToken()
        const profRes = await fetch(`/api/settings/profile`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
        const { profile } = await profRes.json()
        const role = String(profile?.role || "member").toLowerCase()
        const permRes = await fetch(`/api/permissions/role`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
        const j = await permRes.json()
        const perms = j?.permissions || {}
        const modules = perms[role] || {}
        setAllowedModules(modules)
      } catch {
        setAllowedModules({})
      }
      setPermsLoaded(true)
    }
    load()
  }, [])

  const moduleKeyForPath = (href: string): string => {
    if (href.startsWith("/dashboard")) return "dashboard"
    if (href.startsWith("/contratos")) return "contratos"
    if (href.startsWith("/portfolio")) return "portfolio"
    if (href.startsWith("/aprovacoes")) return "aprovacoes"
    if (href.startsWith("/calendario")) return "calendario"
    if (href.startsWith("/versionamento")) return "versionamento"
    if (href.startsWith("/playbook")) return "playbook"
    if (href.startsWith("/seguranca")) return "seguranca"
    if (href.startsWith("/assinaturas")) return "assinaturas"
    if (href.startsWith("/configuracoes")) return "configuracoes"
    if (href.startsWith("/integracoes")) return "integracoes"
    if (href.startsWith("/auditoria")) return "auditoria"
    if (href.startsWith("/equipes")) return "equipes"
    if (href.startsWith("/analises")) return "analises"
    return href.replace(/^\//, "")
  }

  const hrefForModule = (m: string): string => {
    if (m === "dashboard") return "/dashboard"
    if (m === "contratos") return "/contratos"
    if (m === "portfolio") return "/portfolio"
    if (m === "aprovacoes") return "/aprovacoes"
    if (m === "calendario") return "/calendario"
    if (m === "versionamento") return "/versionamento"
    if (m === "playbook") return "/playbook"
    if (m === "seguranca") return "/seguranca"
    if (m === "assinaturas") return "/assinaturas"
    if (m === "configuracoes") return "/configuracoes"
    if (m === "integracoes") return "/integracoes"
    if (m === "auditoria") return "/auditoria"
    if (m === "equipes") return "/equipes"
    if (m === "analises") return "/analises"
    return "/dashboard"
  }

  useEffect(() => {
    if (!permsLoaded) return
    const key = moduleKeyForPath(pathname || "/")
    const denied = allowedModules[key] === false
    if (denied) {
      const order = ["dashboard","contratos","portfolio","aprovacoes","calendario","versionamento","playbook","seguranca","assinaturas","configuracoes"]
      const next = order.find((k) => allowedModules[k] !== false) || "dashboard"
      const target = hrefForModule(next)
      if (pathname !== target) router.replace(target)
    }
  }, [permsLoaded, allowedModules, pathname, router])

  return (
    <div className="flex min-h-screen bg-background">
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar text-sidebar-foreground shadow-lg md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <AppSidebar isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />
      
      <div
        className={cn(
          "flex-1 transition-all duration-300 w-full min-h-screen",
          isMobile ? "ml-0" : isCollapsed ? "ml-20" : "ml-72"
        )}
      >
        <AppHeader />
        <main className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">{children}</main>
      </div>
    </div>
  )
}
