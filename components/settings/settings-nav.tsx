"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, Building2, Users, Shield, Bell, CreditCard } from "lucide-react"

interface SettingsNavProps extends React.HTMLAttributes<HTMLElement> {
  allowedTabs: string[]
}

const NAV_ITEMS = [
  { title: "Meu Perfil", href: "/configuracoes?tab=profile", icon: User, value: "profile" },
  { title: "Organização", href: "/configuracoes?tab=organization", icon: Building2, value: "organization" },
  { title: "Assinatura", href: "/configuracoes?tab=subscription", icon: CreditCard, value: "subscription" },
  { title: "Equipe", href: "/configuracoes?tab=team", icon: Users, value: "team" },
  { title: "Segurança", href: "/configuracoes?tab=security", icon: Shield, value: "security" },
]

export function SettingsNav({ className, allowedTabs, ...props }: SettingsNavProps) {
  const searchParams = useSearchParams()
  const currentTab = searchParams.get("tab") || "profile"

  const items = NAV_ITEMS.filter(item => allowedTabs.includes(item.value))

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        className={cn(
          "flex h-14 items-center space-x-2 overflow-x-auto scrollbar-hide px-4 lg:px-0 w-full",
          className
        )}
        {...props}
      >
        {items.map((item) => {
          const isActive = currentTab === item.value
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-colors hover:text-primary min-w-[120px]",
                isActive
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
