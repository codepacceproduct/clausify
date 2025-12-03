"use client"

import type React from "react"

import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Menu } from 'lucide-react'
import { supabase } from "@/lib/supabase-client"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    const remember = typeof window !== "undefined" ? localStorage.getItem("rememberMe") : null
    if (remember === "false") {
      const onUnload = () => { try { supabase.auth.signOut() } catch { void 0 } }
      window.addEventListener("beforeunload", onUnload)
      return () => window.removeEventListener("beforeunload", onUnload)
    }
  }, [])

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
