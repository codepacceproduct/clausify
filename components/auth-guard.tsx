"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from 'next/navigation'
import { isAuthenticated } from "@/lib/auth"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const publicRoutes = ["/login", "/register", "/forgot-password"]
    const isPublicRoute = publicRoutes.includes(pathname)

    if (!isAuthenticated() && !isPublicRoute) {
      router.push("/login")
    } else if (isAuthenticated() && isPublicRoute) {
      router.push("/")
    } else {
      setIsChecking(false)
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
