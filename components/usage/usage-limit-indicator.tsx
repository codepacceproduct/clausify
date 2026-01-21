"use client"

import { useEffect, useState, useRef } from "react"
import { UsageQuota, getUsageQuota } from "@/actions/usage"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface UsageLimitIndicatorProps {
  onUsageChange?: (usage: UsageQuota | null) => void
  action?: "consultation_query" | "chat_message" | "monitoring_process" | "datalake_query"
  title?: string
  reloadTrigger?: number
}

export function UsageLimitIndicator({ 
  onUsageChange, 
  action = "consultation_query",
  title = "Limite de Consultas Diárias",
  reloadTrigger = 0
}: UsageLimitIndicatorProps) {
  const [usage, setUsage] = useState<UsageQuota | null>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState<string>("")
  const isReloadingRef = useRef(false)

  useEffect(() => {
    loadUsage()
  }, [action, reloadTrigger]) // Reload if action or trigger changes

  useEffect(() => {
    if (onUsageChange) {
      onUsageChange(usage)
    }
  }, [usage]) // Removed onUsageChange from dependency array to prevent loop

  useEffect(() => {
    // Only run countdown if resetIn is present
    if (!usage?.resetIn) {
      setCountdown("")
      return
    }

    const updateCountdown = () => {
      const now = new Date()
      const resetTime = new Date(usage.resetIn)
      const diff = resetTime.getTime() - now.getTime()

      if (diff <= 0) {
        setCountdown("00:00:00")
        // Reload usage if we crossed midnight
        if (usage.used > 0) loadUsage()
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      )
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [usage])

  const loadUsage = async () => {
    if (isReloadingRef.current) return
    isReloadingRef.current = true
    
    try {
      const data = await getUsageQuota(action)
      setUsage(data)
    } catch (error) {
      console.error("Failed to load usage:", error)
    } finally {
      setLoading(false)
      isReloadingRef.current = false
    }
  }

  if (loading || !usage) return null

  const isUnlimited = usage.limit === Infinity
  const isLow = !isUnlimited && usage.remaining <= 2
  const isEmpty = !isUnlimited && usage.remaining === 0

  return (
    <Card className={`border-l-4 ${isEmpty ? "border-l-red-500" : isLow ? "border-l-amber-500" : "border-l-emerald-500"}`}>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isUnlimited ? (
                <Crown className="h-5 w-5 text-purple-500" />
              ) : isEmpty ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              )}
              <h3 className="font-semibold">{title}</h3>
            </div>
            <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              Plano {usage.plan}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Utilizado:</span>
              <span className="font-medium">
                {usage.used} / {isUnlimited ? "Ilimitado" : usage.limit}
              </span>
            </div>
            <Progress value={usage.percentage} className={`h-2 ${isEmpty ? "bg-red-100 dark:bg-red-950" : ""}`} />
            
            {isEmpty && (
              <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/30 p-2 rounded-md border border-red-200 dark:border-red-900 mt-2">
                <span className="text-xs text-red-600 font-medium flex items-center gap-2">
                  {usage.resetIn 
                    ? `Limite atingido. Reinicia em ${countdown}` 
                    : `Limite total atingido (${usage.limit}).`}
                </span>
                <Link href="/settings/billing">
                  <Button variant="link" className="text-red-600 h-auto p-0 text-xs font-semibold">
                    Fazer Upgrade
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
