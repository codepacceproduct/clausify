"use client"

import { Bell, Search, LogOut, User, Settings } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { logout, getUserEmail } from "@/lib/auth"

export function AppHeader() {
  const router = useRouter()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [userEmail] = useState<string | null>(() => getUserEmail())
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!userEmail) return
      try {
        const res = await fetch(`/api/settings/profile?email=${encodeURIComponent(userEmail)}`)
        if (!res.ok) return
        const { profile } = await res.json()
        if (profile?.avatar_url) setAvatarSrc(profile.avatar_url)
      } catch {}
    }
    load()
  }, [userEmail])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getUserInitials = () => {
    if (!userEmail) return "U"
    const parts = userEmail.split("@")[0].split(".")
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return userEmail.substring(0, 2).toUpperCase()
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b bg-background/95 px-3 sm:px-6 md:px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      
      <div className="flex flex-1 items-center gap-2 sm:gap-4">
        {mobileSearchOpen ? (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="w-full pl-10 pr-3 h-9 text-sm bg-background border-input"
              autoFocus
              onBlur={() => setMobileSearchOpen(false)}
            />
          </div>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden shrink-0 h-9 w-9"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <div className="relative flex-1 max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar contratos, clientes, cláusulas..." 
                className="w-full pl-10 bg-background border-input" 
              />
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" className="relative shrink-0 h-9 w-9 sm:h-10 sm:w-10">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 shrink-0">
                <AvatarImage src={avatarSrc ?? "/placeholder.svg?height=36&width=36"} alt="User" />
                <AvatarFallback className="bg-emerald-600 text-white font-semibold text-xs sm:text-sm">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Minha Conta</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/configuracoes")}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/configuracoes")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
