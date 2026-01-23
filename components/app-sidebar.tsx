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
  Calculator,
  Search,
  Bot,
  MessageSquare,
  Info,
  User,
  Sparkles,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { logout, getUserEmail } from "@/lib/auth"
import Image from "next/image"
import { usePermissions } from "@/contexts/permissions-context"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Contratos", href: "/contratos", icon: FileText },
  { name: "Consultas", href: "/consultas", icon: Search },
  { name: "ClausiChat", href: "/clausichat", icon: MessageSquare },
  { name: "Calendário", href: "/calendario", icon: Calendar },
  { name: "Versionamento", href: "/versionamento", icon: GitBranch },
  { name: "Playbook", href: "/playbook", icon: BookOpen },
  { name: "Cálculos", href: "/calculos", icon: Calculator }, // Added Cálculos navigation item
  { name: "Sobre", href: "/sobre", icon: Info },
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
  const { allowedModules, plan } = usePermissions()

  // User Profile State
  const [userEmail] = useState<string | null>(() => getUserEmail())
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [avatarFit, setAvatarFit] = useState<'cover' | 'contain' | 'fill'>('cover')
  const [avatarPosition, setAvatarPosition] = useState<'center' | 'top' | 'bottom' | 'left' | 'right'>('top')
  const [avatarZoom, setAvatarZoom] = useState<number>(1)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) return

      try {
        const res = await fetch(`/api/settings/profile`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        })
        if (!res.ok) return
        const { profile } = await res.json()
        if (profile?.avatar_url) setAvatarSrc(profile.avatar_url)
        if (profile?.first_name) setUserName(`${profile.first_name} ${profile.last_name || ''}`.trim())
        
        if (profile?.role) setUserRole(profile.role)

        const prefs = profile?.regional_preferences?.avatar
        if (prefs) {
          if (prefs.fit) setAvatarFit(prefs.fit)
          if (prefs.position) setAvatarPosition(prefs.position)
          if (prefs.zoom) setAvatarZoom(Number(prefs.zoom))
        }
      } catch {}
    }
    load()
  }, [])

  useEffect(() => {
    const handler = (e: any) => {
      const d = e?.detail || {}
      if (d.url) setAvatarSrc(d.url)
      const p = d.prefs || {}
      if (p.fit) setAvatarFit(p.fit)
      if (p.position) setAvatarPosition(p.position)
      if (p.zoom) setAvatarZoom(Number(p.zoom))
    }
    window.addEventListener('profile:avatar-updated', handler as EventListener)
    return () => {
      window.removeEventListener('profile:avatar-updated', handler as EventListener)
    }
  }, [])

  const getUserInitials = () => {
    if (userName) {
        const parts = userName.split(" ")
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
        return userName.substring(0, 2).toUpperCase()
    }
    if (!userEmail) return "U"
    const parts = userEmail.split("@")[0].split(".")
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return userEmail.substring(0, 2).toUpperCase()
  }

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

  const moduleKeyForHref = (href: string): string => {
    if (href.startsWith("/dashboard")) return "dashboard"
    if (href.startsWith("/contratos")) return "contratos"
    if (href.startsWith("/consultas")) return "consultas"
    if (href.startsWith("/clausichat")) return "clausichat"
    if (href.startsWith("/calendario")) return "calendario"
    if (href.startsWith("/versionamento")) return "versionamento"
    if (href.startsWith("/playbook")) return "playbook"
    if (href.startsWith("/calculos")) return "calculos" // Added Cálculos module key
    if (href.startsWith("/sobre")) return "sobre"
    if (href.startsWith("/configuracoes")) return "configuracoes"
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

  const planDisplayMap: Record<string, string> = {
    free: "Free",
    basic: "Starter",
    starter: "Starter",
    pro: "Pro",
    professional: "Pro",
    enterprise: "Office",
    office: "Office"
  }
  
  const displayPlan = plan ? (planDisplayMap[plan.toLowerCase()] || plan.charAt(0).toUpperCase() + plan.slice(1)) : ""

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

        <div className="border-t border-sidebar-border/50 p-2 sm:p-2 space-y-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-2 transition-all hover:bg-sidebar-accent group text-left outline-none",
                  isCollapsed ? "justify-center" : ""
                )}
              >
                <div className="relative">
                  <Avatar className="h-9 w-9 shrink-0 border border-sidebar-border/50">
                    {avatarSrc ? (
                      <AvatarImage
                        src={avatarSrc}
                        alt="User"
                        fit={avatarFit}
                        position={avatarPosition}
                        zoom={avatarZoom}
                      />
                    ) : null}
                    <AvatarFallback className="bg-emerald-600 text-white font-semibold text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-sidebar"></span>
                </div>
                
                {!isCollapsed && (
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium text-sidebar-foreground">
                      {userName || "Usuário"}
                    </span>
                    <span className="truncate text-xs text-sidebar-foreground/60">
                      {userEmail}
                    </span>
                  </div>
                )}

                {!isCollapsed && (
                  <MoreHorizontal className="h-4 w-4 text-sidebar-foreground/50 group-hover:text-sidebar-foreground" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56" 
              align="start" 
              side="right" 
              sideOffset={8}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName || "Minha Conta"}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Plano {displayPlan}</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <DropdownMenuSeparator />
              {(userRole === 'admin' || userRole === 'owner') && (
                <DropdownMenuItem onClick={() => router.push("/configuracoes?tab=subscription&subtab=plans")}>
                  <Sparkles className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Gerenciar plano</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => router.push("/configuracoes")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="flex items-center justify-between px-2 py-1.5 select-none">
                <div className="flex items-center text-sm">
                  {isDarkMode ? (
                    <Moon className="mr-2 h-4 w-4" />
                  ) : (
                    <Sun className="mr-2 h-4 w-4" />
                  )}
                  <span>Tema</span>
                </div>
                <Switch 
                  checked={isDarkMode} 
                  onCheckedChange={toggleTheme} 
                  className="scale-75 data-[state=checked]:bg-emerald-500"
                />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  )
}
