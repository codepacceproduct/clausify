"use client"

import { Search, Plus } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { NotificationsPopover } from "@/components/notifications-popover"

export function AppHeader() {
  const router = useRouter()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

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
        <Button 
          className="bg-emerald-500 hover:bg-emerald-600 text-white mr-1 shadow-sm transition-all hover:shadow-md h-9 sm:h-10"
          size="sm"
          onClick={() => router.push('/contratos')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Análise
        </Button>

        <NotificationsPopover />
      </div>
    </header>
  )
}
