"use client"

import {
  LayoutDashboard,
  FileText,
  BookOpen,
  FolderOpen,
  Shield,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  X,
  CheckSquare,
  Calendar,
  GitBranch,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { logout } from "@/lib/auth"
import Image from "next/image"
import { getUserEmail, getAuthToken } from "@/lib/auth"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Contratos", href: "/contratos", icon: FileText },
  { name: "Portfólio", href: "/portfolio", icon: FolderOpen },
  { name: "Aprovações", href: "/aprovacoes", icon: CheckSquare },
  { name: "Calendário", href: "/calendario", icon: Calendar },
  { name: "Versionamento", href: "/versionamento", icon: GitBranch },
  { name: "Playbook", href: "/playbook", icon: BookOpen },
  { name: "Segurança", href: "/seguranca", icon: Shield },
  { name: "Assinaturas", href: "/assinaturas", icon: CreditCard },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
]

export function AppSidebar({
  isMobileOpen,
  setIsMobileOpen,
}: {
  isMobileOpen?: boolean
  setIsMobileOpen?: (_open: boolean) => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [allowedModules, setAllowedModules] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 1280) {
        setIsCollapsed(true)
      } else {
        setIsCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const load = async () => {
      const email = getUserEmail()
      if (!email) return
      try {
        const token = getAuthToken()
        const profRes = await fetch(`/api/settings/profile`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const { profile } = await profRes.json()
        const role = String(profile?.role || "member").toLowerCase()
        const permRes = await fetch(`/api/permissions/role`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const j = await permRes.json()
        const perms = j?.permissions || {}
        const modules = perms[role] || {}
        setAllowedModules(modules)
      } catch {}
    }
    load()
  }, [])

  const moduleKeyForHref = (href: string): string => {
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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const closeMobileMenu = () => {
    if (setIsMobileOpen) {
      setIsMobileOpen(false)
    }
  }

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden" onClick={closeMobileMenu} />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col",
          "md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "md:w-20" : "md:w-72",
          "w-80",
        )}
      >
        <div className="relative flex items-center justify-between px-6 py-6 sm:px-5 sm:py-5 border-b border-sidebar-border/50">
          <div className={cn("flex items-center gap-3", isCollapsed && "md:justify-center md:w-full")}>
            <div className={cn("relative transition-all duration-300", isCollapsed ? "w-10 h-10" : "w-32 h-10")}>
              <Image src="/images/clausify-logo.png" alt="Clausify" fill className="object-contain" />
            </div>
          </div>

          <button
            onClick={closeMobileMenu}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors active:bg-sidebar-accent/70"
            aria-label="Fechar menu"
          >
            <X className="h-6 w-6 text-sidebar-foreground" />
          </button>

          <button
            onClick={toggleSidebar}
            className={cn(
              "hidden md:flex absolute -right-3 top-7 h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-all hover:scale-110",
              isCollapsed && "rotate-180",
            )}
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 sm:px-3 overflow-y-auto pt-4 sm:pt-3">
          {navigation
            .filter((item) => {
              const key = moduleKeyForHref(item.href)
              return allowedModules[key] !== false
            })
            .map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    "flex items-center gap-4 rounded-lg px-4 py-4 sm:gap-3 sm:px-3 sm:py-2.5 text-base sm:text-sm font-medium transition-all active:scale-95",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    isCollapsed && "md:justify-center",
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-6 w-6 sm:h-5 sm:w-5 shrink-0" />
                  <span className={cn(isCollapsed && "md:hidden")}>{item.name}</span>
                </Link>
              )
            })}
        </nav>

        <div className="border-t border-sidebar-border/50 p-4 sm:p-3 space-y-2">
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-4 sm:gap-3 rounded-lg px-4 py-4 sm:px-3 sm:py-2.5 text-base sm:text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all active:scale-95",
              isCollapsed && "md:justify-center",
            )}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="h-6 w-6 sm:h-5 sm:w-5 shrink-0" />
            <span className={cn(isCollapsed && "md:hidden")}>Logout</span>
          </button>

          <div
            className={cn(
              "flex items-center gap-4 sm:gap-3 rounded-lg bg-sidebar-accent/30 px-4 py-4 sm:px-3 sm:py-2.5",
              isCollapsed && "md:justify-center md:px-2",
            )}
          >
            {isCollapsed ? (
              <button onClick={toggleTheme} className="hidden md:flex items-center justify-center" title="Toggle theme">
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-sidebar-foreground" />
                ) : (
                  <Moon className="h-5 w-5 text-sidebar-foreground" />
                )}
              </button>
            ) : null}

            <div className={cn("flex items-center gap-4 sm:gap-3 w-full", isCollapsed && "md:hidden")}>
              {isDarkMode ? (
                <Sun className="h-5 w-5 sm:h-4 sm:w-4 text-sidebar-foreground/60" />
              ) : (
                <Moon className="h-5 w-5 sm:h-4 sm:w-4 text-sidebar-foreground/60" />
              )}
              <span className="text-base sm:text-sm text-sidebar-foreground/70 flex-1">
                {isDarkMode ? "Light mode" : "Dark mode"}
              </span>
              <Switch checked={isDarkMode} onCheckedChange={toggleTheme} className="scale-110 sm:scale-100" />
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
