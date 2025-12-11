"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const publicRoutes = ["/login", "/criar-conta", "/esqueci-senha"]
    const isPublicRoute = publicRoutes.includes(pathname)

    if (!isAuthenticated() && !isPublicRoute) {
      router.push("/login")
    } else if (isAuthenticated() && isPublicRoute) {
      router.push("/dashboard")
    } else {
      Promise.resolve().then(() => setIsChecking(false))
    }
  }, [pathname, router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1419]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
