"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Activity, AlertTriangle, CheckCircle2 } from "lucide-react"
import { getUserEmail } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export function SecurityOverview() {
  const [twoFAEnabled, setTwoFAEnabled] = useState<boolean>(false)
  const [accessAttempts24h, setAccessAttempts24h] = useState<number>(0)
  const [failedAttempts24h, setFailedAttempts24h] = useState<number>(0)
  const [alertsPending, setAlertsPending] = useState<number>(0)

  useEffect(() => {
    const email = getUserEmail() ?? ""
    if (!email) return
    ;(async () => {
      try {
        const r = await fetch(`/api/settings/2fa/status`)
        const j = await r.json()
        setTwoFAEnabled(!!j.enabled)
      } catch {}
      try {
        const r = await fetch(`/api/sessions/list`)
        const j = await r.json()
        const rows: any[] = j.sessions || []
        const now = Date.now()
        const cutoff = now - 24 * 3600 * 1000
        const recent = rows.filter((s) => {
          const t = new Date(s.last_active || s.created_at).getTime()
          return t >= cutoff
        })
        setAccessAttempts24h(recent.length)
        setFailedAttempts24h(recent.filter((s) => s.active === false).length)
      } catch {}
      try {
        const { data } = await supabase
          .from("approvals")
          .select("priority,status")
          .eq("priority", "high")
          .eq("status", "pending")
        setAlertsPending(data?.length || 0)
      } catch {
        setAlertsPending(0)
      }
    })()
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status de Segurança</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{twoFAEnabled ? "Protegido" : "Atenção"}</div>
            <CheckCircle2 className={`h-5 w-5 ${twoFAEnabled ? "text-success" : "text-muted-foreground"}`} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {twoFAEnabled ? "2FA ativado" : "Ative 2FA para maior segurança"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tentativas de Acesso</CardTitle>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{accessAttempts24h}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-destructive font-medium">{failedAttempts24h} falhas</span> nas últimas 24h
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Atividades Hoje</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{accessAttempts24h}</div>
          <p className="text-xs text-muted-foreground mt-1">Acessos registrados nas últimas 24h</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alertas Pendentes</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{alertsPending}</div>
          <p className="text-xs text-muted-foreground mt-1">Requerem atenção imediata</p>
        </CardContent>
      </Card>
    </div>
  )
}
