"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { getUserEmail, getAuthToken } from "@/lib/auth"
import { User, Camera, Loader2, Shield, Smartphone, LogOut } from "lucide-react"

export function ProfileSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Profile Form states
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")

  // Password State
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordSaving, setPasswordSaving] = useState(false)

  // 2FA State
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  
  // Sessions State
  const [sessions, setSessions] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    await Promise.all([loadProfile(), load2FAStatus(), loadSessions()])
    setLoading(false)
  }

  async function loadProfile() {
    try {
      const token = getAuthToken()
      const res = await fetch("/api/settings/profile", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) throw new Error("Failed to load profile")
      const data = await res.json()
      if (data.profile) {
        setProfile(data.profile)
        setFirstName(data.profile.name || "")
        setLastName(data.profile.surname || "")
        setEmail(data.profile.email || "")
        setPhone(data.profile.phone || "")
        setAvatarUrl(data.profile.avatar_url || "")
      }
    } catch (error) {
      console.error(error)
      // toast.error("Erro ao carregar perfil")
    }
  }

  async function load2FAStatus() {
    try {
      const token = getAuthToken()
      const res = await fetch("/api/settings/2fa/status", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (res.ok) {
        const data = await res.json()
        setTwoFAEnabled(data.enabled)
      }
    } catch (e) { console.error(e) }
  }

  async function loadSessions() {
    try {
      const token = getAuthToken()
      const res = await fetch("/api/sessions/list", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (res.ok) {
        const data = await res.json()
        setSessions(data.sessions || [])
      }
    } catch (e) { console.error(e) }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    setUploading(true)
    try {
      const token = getAuthToken()
      const res = await fetch("/api/settings/avatar", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      })
      
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Falha no upload")
      }
      
      const data = await res.json()
      setAvatarUrl(data.url)
      
      // Update header avatar immediately
      window.dispatchEvent(new CustomEvent('profile:avatar-updated', { detail: { url: data.url } }))
      
      toast.success("Foto atualizada com sucesso")
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar foto")
    } finally {
      setUploading(false)
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleSaveProfile() {
    setSaving(true)
    try {
      const token = getAuthToken()
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: firstName,
          surname: lastName,
          phone,
          avatar_url: avatarUrl,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to update")
      }
      
      toast.success("Perfil atualizado com sucesso")
      
      // Dispatch event for header avatar update in case it was changed manually (though unlikely via text input)
      if (avatarUrl) {
         window.dispatchEvent(new CustomEvent('profile:avatar-updated', { detail: { url: avatarUrl } }))
      }
      
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Erro ao atualizar perfil")
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordChange() {
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem")
      return
    }
    if (newPassword.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres")
      return
    }
    
    setPasswordSaving(true)
    try {
      const token = getAuthToken()
      const res = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to update password")
      }
      
      toast.success("Senha alterada com sucesso")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      toast.error(error.message || "Erro ao alterar senha")
    } finally {
      setPasswordSaving(false)
    }
  }

  async function handleEndSession(id: string) {
    try {
      const token = getAuthToken()
      await fetch("/api/sessions/end", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ sessionId: id })
      })
      toast.success("Sessão encerrada")
      loadSessions()
    } catch {
      toast.error("Erro ao encerrar sessão")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Meu Perfil</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie suas informações pessoais e segurança da conta.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            Atualize sua foto e detalhes pessoais.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-muted text-2xl">
                {firstName?.[0]}{lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarUpload}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="w-fit" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="mr-2 h-4 w-4" />
                )}
                {uploading ? "Enviando..." : "Alterar foto"}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Seu sobrenome"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                value={email}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 (11) 99999-9999"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Senha</CardTitle>
          <CardDescription>
            Altere sua senha de acesso.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="current">Senha Atual</Label>
            <Input 
              id="current" 
              type="password" 
              value={currentPassword} 
              onChange={e => setCurrentPassword(e.target.value)} 
            />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new">Nova Senha</Label>
              <Input 
                id="new" 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar Nova Senha</Label>
              <Input 
                id="confirm" 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handlePasswordChange} disabled={passwordSaving}>
              {passwordSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Atualizar Senha
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Autenticação de Dois Fatores (2FA)</CardTitle>
          <CardDescription>
            Adicione uma camada extra de segurança à sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">Autenticador</p>
              <p className="text-sm text-muted-foreground">
                {twoFAEnabled ? "Ativado" : "Desativado"}
              </p>
            </div>
          </div>
          <Button variant={twoFAEnabled ? "destructive" : "default"}>
            {twoFAEnabled ? "Desativar" : "Configurar"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessões Ativas</CardTitle>
          <CardDescription>
            Dispositivos conectados à sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-full">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {session.browser || "Unknown Browser"} no {session.os || "Unknown OS"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session.active ? "Sessão Atual" : `Último acesso: ${new Date(session.last_active).toLocaleDateString()}`}
                    </p>
                    <p className="text-xs text-muted-foreground">{session.ip}</p>
                  </div>
                </div>
                {!session.active && (
                  <Button variant="ghost" size="sm" onClick={() => handleEndSession(session.id)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
