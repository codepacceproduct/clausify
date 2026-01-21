"use client"

import { LayoutDashboard, Users, LogOut, ChevronRight, Moon, Sun, Shield } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Lista de Espera", href: "/admin/listadeespera", icon: Users },
  { name: "Permissões", href: "/admin/permissoes", icon: Shield },
]

interface AdminSidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export function AdminSidebar({ isCollapsed, setIsCollapsed }: AdminSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleLogout = async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("admin_authenticated")
      localStorage.removeItem("admin_email")
      router.push("/admin/login")
    }
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      <div className="relative flex items-center justify-between px-6 py-6 border-b border-sidebar-border/50">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center w-full")}>
          <div className={cn("relative transition-all duration-300", isCollapsed ? "w-10 h-10" : "w-32 h-10")}>
            <Image src="/images/clausify-logo.png" alt="Clausify" fill className="object-contain" />
          </div>
        </div>

        <button
          onClick={toggleSidebar}
          className={cn(
            "absolute -right-3 top-7 h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-all hover:scale-110 flex",
            isCollapsed && "rotate-180",
          )}
          aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-3 overflow-y-auto pt-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all active:scale-95",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                isCollapsed && "justify-center",
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className={cn(isCollapsed && "hidden")}>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border/50 p-3 space-y-2">
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all active:scale-95",
            isCollapsed && "justify-center",
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className={cn(isCollapsed && "hidden")}>Logout</span>
        </button>

        <div
          className={cn(
            "flex items-center gap-3 rounded-lg bg-sidebar-accent/30 px-3 py-2.5",
            isCollapsed && "justify-center px-2",
          )}
        >
          {isCollapsed ? (
            <button onClick={toggleTheme} className="flex items-center justify-center" title="Toggle theme">
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-sidebar-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-sidebar-foreground" />
              )}
            </button>
          ) : (
            <>
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-sidebar-foreground/60" />
              ) : (
                <Moon className="h-4 w-4 text-sidebar-foreground/60" />
              )}
              <span className="text-sm text-sidebar-foreground/70 flex-1">
                {isDarkMode ? "Light mode" : "Dark mode"}
              </span>
              <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
