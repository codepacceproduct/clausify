"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from "@/lib/supabase-client"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      const isAuth = !!data.session
      const isPublicRoute = publicRoutes.includes(pathname)
      if (!isAuth && !isPublicRoute) {
        router.push("/login")
      } else if (isAuth && isPublicRoute) {
        router.push("/")
      } else {
        setIsChecking(false)
      }
    }
    check()
    const { data: sub } = supabase.auth.onAuthStateChange(() => check())
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [pathname, router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
