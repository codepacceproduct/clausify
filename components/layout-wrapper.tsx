"use client"

import type { ReactNode } from "react"

import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Menu, Loader2 } from 'lucide-react'
import { usePermissions } from "@/contexts/permissions-context"

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isLoading } = usePermissions()
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

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
          "flex-1 transition-all duration-300 min-h-screen min-w-0",
          isMobile ? "ml-0" : isCollapsed ? "ml-20" : "ml-72"
        )}
      >
        <AppHeader />
        <main className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">{children}</main>
      </div>
    </div>
  )
}
