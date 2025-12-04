"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Shield, Key, Smartphone, AlertTriangle, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { logout } from "@/lib/auth"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getUserEmail, getAuthToken, syncAuthCookies } from "@/lib/auth"
import { Progress } from "@/components/ui/progress"
import * as Dialog from "@radix-ui/react-dialog"
import { Card as UICard } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const strength = (() => {
    const pwd = newPassword || ""
    let score = 0
    if (pwd.length >= 8) score += 25
    if (/[A-Z]/.test(pwd)) score += 20
    if (/[a-z]/.test(pwd)) score += 20
    if (/[0-9]/.test(pwd)) score += 20
    if (/[^A-Za-z0-9]/.test(pwd)) score += 15
    if (score > 100) score = 100
    const label = score < 50 ? "Fraca" : score < 80 ? "Média" : "Forte"
    return { score, label }
  })()
  const [twoFAEnabled, setTwoFAEnabled] = useState<boolean>(false)
  const [setupOpen, setSetupOpen] = useState(false)
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null)
  const [setupToken, setSetupToken] = useState("")
  const [sessions, setSessions] = useState<Array<{ id: string, ip: string | null, device: string | null, os: string | null, browser: string | null, client_host: string | null, hostname: string | null, last_active: string, active: boolean }>>([])
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [reason, setReason] = useState<string>("")
  const [details, setDetails] = useState<string>("")
  const [switchingTo, setSwitchingTo] = useState<string>("")
  const [satisfaction, setSatisfaction] = useState<number>(3)
  const [confirmAware, setConfirmAware] = useState<boolean>(false)
  const [confirmPhrase, setConfirmPhrase] = useState<string>("")
  const [deleting, setDeleting] = useState(false)
  const [rolePerms, setRolePerms] = useState<Record<string, Record<string, boolean>>>({})
  const [availableModules, setAvailableModules] = useState<string[]>([])
  const [editRole, setEditRole] = useState<"admin" | "moderator" | "member" | null>(null)
  const [tempPerms, setTempPerms] = useState<Record<string, boolean>>({})
  const [setupError, setSetupError] = useState<string | null>(null)

  function formatRelative(iso: string) {
    const d = new Date(iso)
    const diff = Math.floor((Date.now() - d.getTime()) / 1000)
    if (diff < 60) return "Agora"
    if (diff < 3600) return `Há ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `Há ${Math.floor(diff / 3600)} h`
    return `Há ${Math.floor(diff / 86400)} dias`
  }

  async function loadSessions() {
    const email = getUserEmail()
    if (!email) return
    const token = getAuthToken()
    const r = await fetch(`/api/sessions/list`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
    const j = await r.json().catch(() => ({ sessions: [] }))
    setSessions(j.sessions || [])
  }

  async function endSession(id: string) {
    const token = getAuthToken()
    const headers: any = { "Content-Type": "application/json" }
    if (token) headers.Authorization = `Bearer ${token}`
    const r = await fetch(`/api/sessions/end`, { method: "POST", headers, body: JSON.stringify({ sessionId: id }) })
    if (r.ok) {
      toast.success("Sessão encerrada")
      await loadSessions()
    }
  }

  async function endOthers() {
    const token = getAuthToken()
    const headers: any = { "Content-Type": "application/json" }
    if (token) headers.Authorization = `Bearer ${token}`
    const r = await fetch(`/api/sessions/end`, { method: "POST", headers, body: JSON.stringify({ endOthers: true }) })
    if (r.ok) {
      toast.success("Outras sessões encerradas")
      await loadSessions()
    }
  }

  async function refreshTwoFA() {
    const email = getUserEmail()
    if (!email) return
    const token = getAuthToken()
    const r = await fetch(`/api/settings/2fa/status`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
    const j = await r.json().catch(() => ({ enabled: false }))
    setTwoFAEnabled(!!j.enabled)
  }
  useEffect(() => {
    refreshTwoFA()
    loadSessions()
    loadRolePermissions()
    const i = setInterval(() => { loadSessions() }, 30000)
    return () => { clearInterval(i) }
  }, [])

  async function openSetup() {
    const email = getUserEmail()
    if (!email) { toast.error("Email ausente"); return }
    setSetupOpen(true)
    setOtpauthUrl(null)
    setSetupError(null)
    await syncAuthCookies()
    let token = getAuthToken()
    try {
      const r = await fetch(`/api/settings/2fa/setup`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
      if (!r.ok) {
        if (r.status === 401) {
          await syncAuthCookies()
          token = getAuthToken()
          const rr = await fetch(`/api/settings/2fa/setup`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
          if (!rr.ok) {
            const err = await rr.json().catch(() => ({}))
            const msg = err?.error || "Falha ao iniciar configuração"
            toast.error(msg)
            setSetupError(msg)
            return
          }
          const jj = await rr.json().catch(() => null)
          if (!jj?.otpauth) {
            const msg = "Resposta inválida do servidor"
            toast.error(msg)
            setSetupError(msg)
            return
          }
          setOtpauthUrl(jj.otpauth)
          return
        }
        const err = await r.json().catch(() => ({}))
        const msg = err?.error || "Falha ao iniciar configuração"
        toast.error(msg)
        setSetupError(msg)
        return
      }
      const j = await r.json().catch(() => null)
      if (!j?.otpauth) {
        const msg = "Resposta inválida do servidor"
        toast.error(msg)
        setSetupError(msg)
        return
      }
      setOtpauthUrl(j.otpauth)
    } catch {
      const msg = "Erro ao conectar ao servidor"
      toast.error(msg)
      setSetupError(msg)
    }
  }

  async function confirmEnable() {
    const token = getAuthToken()
    const headers: any = { "Content-Type": "application/json" }
    if (token) headers.Authorization = `Bearer ${token}`
    const r = await fetch(`/api/settings/2fa/enable`, { method: "POST", headers, body: JSON.stringify({ token: setupToken }) })
    if (r.ok) {
      toast.success("2FA ativado")
      setSetupOpen(false)
      setTwoFAEnabled(true)
    } else {
      const err = await r.json().catch(() => ({}))
      toast.error(err?.error || "Código inválido")
    }
  }

  async function disable2FA() {
    const token = getAuthToken()
    const headers: any = {}
    if (token) headers.Authorization = `Bearer ${token}`
    const r = await fetch(`/api/settings/2fa/disable`, { method: "POST", headers })
    if (r.ok) {
      toast.success("2FA desativado")
      setTwoFAEnabled(false)
    } else {
      toast.error("Falha ao desativar 2FA")
    }
  }

  const handlePasswordUpdate = async () => {
    const email = getUserEmail()
    if (!email) {
      toast.error("Email ausente")
      return
    }
    if (!newPassword || newPassword.length < 8) {
      toast.error("Senha deve ter ao menos 8 caracteres")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem")
      return
    }
    setSaving(true)
    try {
      const token = getAuthToken()
      const headers: any = { "Content-Type": "application/json" }
      if (token) headers.Authorization = `Bearer ${token}`
      const res = await fetch("/api/settings/password", { method: "POST", headers, body: JSON.stringify({ currentPassword, newPassword }) })
      if (res.ok) {
        toast.success("Senha atualizada")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        const err = await res.json().catch(() => ({}))
        toast.error(err?.error || "Falha ao atualizar senha")
      }
    } catch {
      toast.error("Erro ao atualizar senha")
    } finally {
      setSaving(false)
    }
  }
  async function loadRolePermissions() {
    const email = getUserEmail()
    if (!email) return
    const token = getAuthToken()
    const fallbackModules = [
      "dashboard",
      "contratos",
      "portfolio",
      "aprovacoes",
      "calendario",
      "versionamento",
      "playbook",
      "seguranca",
      "assinaturas",
      "configuracoes",
      "configuracoes.general",
      "configuracoes.notifications",
      "configuracoes.security",
      "configuracoes.integrations",
      "configuracoes.teams",
      "integracoes",
      "auditoria",
      "equipes",
      "analises",
    ]
    try {
      const r = await fetch(`/api/permissions/role`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
      if (!r.ok) {
        const base: Record<string, Record<string, boolean>> = { admin: {}, moderator: {}, member: {} }
        for (const m of fallbackModules) {
          base.admin[m] = true
          base.moderator[m] = !["seguranca"].includes(m)
          base.member[m] = !["seguranca", "configuracoes", "aprovacoes", "auditoria"].includes(m)
        }
        for (const k of [
          "configuracoes.general",
          "configuracoes.notifications",
          "configuracoes.security",
          "configuracoes.integrations",
          "configuracoes.teams",
        ]) {
          base.member[k] = false
        }
        setRolePerms(base)
        setAvailableModules(fallbackModules)
        return
      }
      const j = await r.json().catch(() => ({ permissions: {}, modules: [] }))
      const mods = Array.isArray(j.modules) ? j.modules : fallbackModules
      setRolePerms(j.permissions || {})
      setAvailableModules(mods)
    } catch {
      const base: Record<string, Record<string, boolean>> = { admin: {}, moderator: {}, member: {} }
      for (const m of fallbackModules) {
        base.admin[m] = true
        base.moderator[m] = !["seguranca"].includes(m)
        base.member[m] = !["seguranca", "configuracoes", "aprovacoes", "auditoria"].includes(m)
      }
      for (const k of [
        "configuracoes.general",
        "configuracoes.notifications",
        "configuracoes.security",
        "configuracoes.integrations",
        "configuracoes.teams",
      ]) {
        base.member[k] = false
      }
      setRolePerms(base)
      setAvailableModules(fallbackModules)
    }
  }

  async function saveRolePermissions() {
    if (!editRole) return
    const token = getAuthToken()
    const headers: any = { "Content-Type": "application/json" }
    if (token) headers.Authorization = `Bearer ${token}`
    const r = await fetch(`/api/permissions/role`, { method: "PUT", headers, body: JSON.stringify({ role: editRole, changes: tempPerms }) })
    if (r.ok) {
      toast.success("Permissões atualizadas")
      setEditRole(null)
      setTempPerms({})
      await loadRolePermissions()
    } else {
      const err = await r.json().catch(() => ({}))
      toast.error(err?.error || "Falha ao salvar")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Permissões por Papel</CardTitle>
          </div>
          <CardDescription>Defina quais módulos cada papel pode acessar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {["admin","moderator","member"].map((role) => (
              <UICard key={role} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium capitalize">{role === "admin" ? "Administrador" : role === "moderator" ? "Moderador" : "Membro"}</div>
                  <Button variant="outline" size="sm" onClick={() => { setEditRole(role as any); const base = rolePerms[role] || {}; const mods = availableModules.length ? availableModules : Object.keys(base || {}); const next: Record<string, boolean> = {}; for (const m of mods) next[m] = base[m] ?? false; setTempPerms(next) }}>Editar</Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(availableModules.length ? availableModules : Object.keys(rolePerms[role] || {})).map((m) => (
                    <Badge key={m} variant={(rolePerms[role]?.[m] ? "default" : "secondary") as any} className={rolePerms[role]?.[m] ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>{m}</Badge>
                  ))}
                </div>
              </UICard>
            ))}
          </div>
          <Dialog.Root open={!!editRole} onOpenChange={(v) => { if (!v) { setEditRole(null); setTempPerms({}) } }}>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-card text-card-foreground rounded-xl border shadow-xl w-full max-w-lg p-6 relative max-h-[80vh] overflow-y-auto">
                <button
                  type="button"
                  onClick={() => { setEditRole(null); setTempPerms({}) }}
                  aria-label="Fechar"
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <Dialog.Title className="text-lg font-bold mb-2">Editar Permissões</Dialog.Title>
                <Dialog.Description className="mb-4">Selecione os módulos permitidos para o papel</Dialog.Description>
                {editRole === "admin" && (
                  <div className="mb-3 p-3 border rounded-lg bg-muted/40 text-sm text-muted-foreground">
                    Administrador possui acesso total e não pode ser restringido.
                  </div>
                )}
                <div className="space-y-3">
                  {(availableModules.length ? availableModules : Object.keys(tempPerms)).map((m) => (
                    <div key={m} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="text-sm font-medium">{m}</div>
                      <Switch disabled={editRole === "admin"} checked={!!tempPerms[m]} onCheckedChange={(v) => setTempPerms((s) => ({ ...s, [m]: v }))} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => { setEditRole(null); setTempPerms({}) }}>Cancelar</Button>
                  <Button type="button" disabled={editRole === "admin"} onClick={saveRolePermissions}>Salvar</Button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Alterar Senha</CardTitle>
          </div>
          <CardDescription>Atualize sua senha regularmente para maior segurança</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input id="currentPassword" type="password" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input id="newPassword" type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <div className="space-y-2">
                <Progress value={strength.score} />
                <div className="text-xs text-muted-foreground">Força: {strength.label}</div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="button" onClick={handlePasswordUpdate} disabled={saving}>{saving ? "Atualizando..." : "Atualizar Senha"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Autenticação de Dois Fatores (2FA)</CardTitle>
          </div>
          <CardDescription>Adicione uma camada extra de segurança à sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div className="space-y-0.5">
              <Label htmlFor="2fa-enabled" className="text-base">
                Ativar 2FA
              </Label>
              <p className="text-sm text-muted-foreground">Requer código adicional ao fazer login</p>
            </div>
            <Switch id="2fa-enabled" checked={twoFAEnabled} onCheckedChange={(v) => (v ? openSetup() : disable2FA())} />
          </div>
          <div className="p-4 border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-3">
              Configure um aplicativo autenticador para gerar códigos de verificação
            </p>
            <Button variant="outline" size="sm" onClick={openSetup}>
              Configurar Autenticador
            </Button>
          </div>
          <Dialog.Root open={setupOpen} onOpenChange={setSetupOpen}>
            <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-card text-card-foreground rounded-xl border shadow-xl w-full max-w-md p-6">
                <Dialog.Title className="text-lg font-bold mb-2">Configurar 2FA</Dialog.Title>
                <p className="text-sm text-muted-foreground mb-4">Escaneie o QR no seu autenticador e digite o código para ativar.</p>
                {otpauthUrl ? (
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`} alt="QR Code" width={200} height={200} className="border rounded" unoptimized />
                    <a href={otpauthUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline">Abrir no autenticador</a>
                  </div>
                ) : (
                  <div className="mb-4">
                    {setupError ? (
                      <div className="text-sm text-red-600 dark:text-red-400 mb-3">{setupError}</div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Gerando QR code...</div>
                    )}
                    <div className="flex justify-end">
                      <Button type="button" variant="outline" size="sm" onClick={openSetup}>Tentar novamente</Button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="setupToken">Código do autenticador</Label>
                  <Input id="setupToken" placeholder="000000" value={setupToken} onChange={(e) => setSetupToken(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setSetupOpen(false)}>Cancelar</Button>
                  <Button type="button" onClick={confirmEnable}>Ativar</Button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Sessões Ativas</CardTitle>
          </div>
          <CardDescription>Gerencie dispositivos conectados à sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-foreground flex items-center gap-2">
                    {s.active ? <div className="h-2 w-2 rounded-full bg-green-500" /> : <div className="h-2 w-2 rounded-full bg-muted" />}
                    {s.browser} em {s.os} ({s.device})
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{formatRelative(s.last_active)} • Host {s.client_host || s.hostname || '—'} • IP {s.ip || '—'}</div>
                </div>
                {s.active && (
                  <Button variant="outline" size="sm" onClick={() => endSession(s.id)}>
                    Encerrar
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent" onClick={() => endOthers()}>
              Encerrar Todas as Outras Sessões
            </Button>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent" onClick={() => loadSessions()}>
              Atualizar Sessões
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600 dark:text-red-400">Zona de Perigo</CardTitle>
          </div>
          <CardDescription>Ações irreversíveis que afetam sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="font-medium text-foreground">Excluir Conta</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Exclui permanentemente sua conta e todos os dados associados
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                Excluir Conta
              </Button>
            </div>
          </div>
          <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
            <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-card text-card-foreground rounded-xl border shadow-xl w-full max-w-lg p-6">
                <Dialog.Title className="text-lg font-bold mb-2">Confirmar Exclusão</Dialog.Title>
                <Dialog.Description className="mb-4">Antes de excluir, responda rapidamente e confirme.</Dialog.Description>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reason">Motivo principal</Label>
                    <select id="reason" className="border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" value={reason} onChange={(e) => setReason(e.target.value)}>
                      <option value="" disabled>Selecione...</option>
                      <option value="nao_preciso">Não preciso mais</option>
                      <option value="performance">Problemas de performance</option>
                      <option value="funcionalidades">Falta de funcionalidades</option>
                      <option value="preco">Preço</option>
                      <option value="privacidade">Privacidade/Segurança</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="details">Explique melhor (opcional)</Label>
                    <Textarea id="details" placeholder="Conte-nos mais..." value={details} onChange={(e) => setDetails(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="switching">Vai migrar para outro produto? Qual?</Label>
                    <Input id="switching" placeholder="Nome do produto" value={switchingTo} onChange={(e) => setSwitchingTo(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Satisfação geral</Label>
                    <div className="flex items-center gap-3">
                      {[1,2,3,4,5].map((n) => (
                        <label key={n} className="flex items-center gap-2">
                          <input type="radio" name="satisfaction" value={n} checked={satisfaction === n} onChange={() => setSatisfaction(n)} />
                          {n}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="aware" type="checkbox" checked={confirmAware} onChange={(e) => setConfirmAware(e.target.checked)} />
                    <Label htmlFor="aware">Entendo que esta ação é permanente e não pode ser desfeita.</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPhrase">Digite: desejo excluir minha conta</Label>
                    <Input id="confirmPhrase" placeholder="desejo excluir minha conta" value={confirmPhrase} onChange={(e) => setConfirmPhrase(e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
                  <Button type="button" variant="destructive" disabled={deleting || !confirmAware || confirmPhrase.trim().toLowerCase() !== "desejo excluir minha conta"} onClick={async () => {
                    const email = getUserEmail()
                    if (!email) return
                    setDeleting(true)
                    try {
                      const token = getAuthToken()
                      const headers: any = { "Content-Type": "application/json" }
                      if (token) headers.Authorization = `Bearer ${token}`
                      const r = await fetch(`/api/settings/account/delete`, { method: "POST", headers, body: JSON.stringify({ confirmPhrase, reason, details, switchingTo, satisfaction }) })
                      if (r.ok) {
                        toast.success("Conta excluída")
                        logout()
                        window.location.href = "/login"
                      } else {
                        const err = await r.json().catch(() => ({}))
                        toast.error(err?.error || "Falha ao excluir")
                      }
                    } finally {
                      setDeleting(false)
                    }
                  }}>{deleting ? "Excluindo..." : "Excluir Conta"}</Button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </CardContent>
      </Card>
    </div>
  )
}
