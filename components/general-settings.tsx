"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Globe, Building2 } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import { getUserEmail } from "@/lib/auth"
import { toast } from "sonner"

export function GeneralSettings({ initialProfile, initialOrganization }: { initialProfile?: any; initialOrganization?: any }) {
  const initialPrefs = initialProfile?.regional_preferences ?? {}
  const [firstName, setFirstName] = useState(initialProfile?.name ?? "")
  const [lastName, setLastName] = useState(initialProfile?.surname ?? "")
  const [email, setEmail] = useState<string>(() => {
    const local = typeof window !== "undefined" ? getUserEmail() : null
    return initialProfile?.email ?? (local || "")
  })
  const [phone, setPhone] = useState(initialProfile?.phone ?? "")
  const [avatarUrl, setAvatarUrl] = useState<string>(initialProfile?.avatar_url ?? "")
  const [avatarFit, setAvatarFit] = useState<string>(initialPrefs?.avatar?.fit ?? "cover")
  const [avatarPosition, setAvatarPosition] = useState<string>(initialPrefs?.avatar?.position ?? "center")
  const [avatarZoom, setAvatarZoom] = useState<number>(Number(initialPrefs?.avatar?.zoom ?? 1))
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [tempFit, setTempFit] = useState<string>("cover")
  const [tempPosition, setTempPosition] = useState<string>("center")
  const [tempZoom, setTempZoom] = useState<number>(1)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [fileInteracted, setFileInteracted] = useState(false)

  const [orgName, setOrgName] = useState(initialOrganization?.name ?? "")
  const [industry, setIndustry] = useState(initialOrganization?.industry ?? "")
  const [size, setSize] = useState(initialOrganization?.size ?? "")
  const [organizationId, setOrganizationId] = useState<string | null>(initialProfile?.organization_id ?? null)

  const [language, setLanguage] = useState(initialOrganization?.locale ?? initialPrefs.language ?? "")
  const [timezone, setTimezone] = useState(initialOrganization?.timezone ?? initialPrefs.timezone ?? "")
  const [dateFormat, setDateFormat] = useState(initialPrefs.dateFormat ?? "")
  const [saving, setSaving] = useState(false)

  function broadcastPrefs(p?: { language?: string; timezone?: string; dateFormat?: string }) {
    const prefs = {
      language: p?.language ?? language,
      timezone: p?.timezone ?? timezone,
      dateFormat: p?.dateFormat ?? dateFormat,
    }
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("prefs", JSON.stringify(prefs))
        window.dispatchEvent(new CustomEvent("preferences:updated", { detail: prefs }))
      }
    } catch {}
  }

  function originFrom(pos: string) {
    switch (pos) {
      case "top":
        return "top center"
      case "bottom":
        return "bottom center"
      case "left":
        return "center left"
      case "right":
        return "center right"
      default:
        return "center"
    }
  }

  function bgPositionFrom(pos: string) {
    switch (pos) {
      case "top":
        return "center top"
      case "bottom":
        return "center bottom"
      case "left":
        return "left center"
      case "right":
        return "right center"
      default:
        return "center"
    }
  }

  function bgSize(fit: string, zoom: number) {
    if (zoom === 1) {
      if (fit === "cover") return "cover"
      if (fit === "contain") return "contain"
      return "100% 100%"
    }
    return `${Math.round(zoom * 100)}% auto`
  }

  useEffect(() => {
    const userEmail = getUserEmail()
    if (!userEmail) return
    const needsClientFetch = !initialProfile || initialProfile?.email !== userEmail
    if (!needsClientFetch) return
    const load = async () => {
      const res = await fetch(`/api/settings/profile`)
      if (!res.ok) return
      const { profile, organization } = await res.json()
      if (profile) {
        setFirstName(profile.name ?? "")
        setLastName(profile.surname ?? "")
        setEmail(profile.email ?? userEmail)
        setPhone(profile.phone ?? "")
        setOrganizationId(profile.organization_id ?? null)
        setAvatarUrl(profile.avatar_url ?? "")
        const prefs = profile.regional_preferences ?? {}
        setLanguage(prefs.language ?? "pt-br")
        setTimezone(prefs.timezone ?? "america-saopaulo")
        setDateFormat(prefs.dateFormat ?? "dd-mm-yyyy")
        if (prefs.avatar) {
          setAvatarFit(prefs.avatar.fit ?? "cover")
          setAvatarPosition(prefs.avatar.position ?? "center")
          setAvatarZoom(Number(prefs.avatar.zoom ?? 1))
        }
      }
      if (organization) {
        setOrgName(organization.name ?? "")
        setIndustry(organization.industry ?? "")
        setSize(organization.size ?? "")
        setTimezone(organization.timezone ?? "america-saopaulo")
        setLanguage(organization.locale ?? "pt-br")
      }
      broadcastPrefs()
    }
    load()
  }, [initialProfile])

  const handleSave = async () => {
    if (!email) {
      toast.error("Email ausente")
      return
    }
    setSaving(true)
    const payload = {
      name: firstName,
      surname: lastName,
      phone,
      regional_preferences: { language, timezone, dateFormat, avatar: { fit: avatarFit, position: avatarPosition, zoom: avatarZoom } },
      organization: orgName.trim()
        ? { id: organizationId ?? undefined, name: orgName, industry, size, timezone, locale: language }
        : null,
      avatar_url: avatarUrl || undefined,
    }
    try {
      const res = await fetch(`/api/settings/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        if (typeof window !== "undefined") {
          const detail = { url: avatarUrl || undefined, prefs: { fit: avatarFit, position: avatarPosition, zoom: avatarZoom } }
          window.dispatchEvent(new CustomEvent("profile:avatar-updated", { detail }))
        }
        broadcastPrefs({ language, timezone, dateFormat })
        toast.success("Configurações salvas")
      } else {
        toast.error("Falha ao salvar configurações")
      }
    } catch {
      toast.error("Erro ao atualizar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Perfil do Usuário</CardTitle>
          </div>
          <CardDescription>Informações básicas da sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border">
                {avatarUrl ? (
                  <div
                    className="w-full h-full"
                    style={{ backgroundImage: `url(${avatarUrl})`, backgroundRepeat: "no-repeat", backgroundPosition: bgPositionFrom(avatarPosition), backgroundSize: bgSize(avatarFit, avatarZoom) }}
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="avatarInput">Escolha sua imagem</Label>
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0]
                    if (!f) {
                      setSelectedFileName(null)
                      return
                    }
                    setSelectedFileName(f.name)
                    const localUrl = URL.createObjectURL(f)
                    setAvatarUrl(localUrl)
                    if (!email) return
                    const fd = new FormData()
                    fd.append("file", f)
                  try {
                    const r = await fetch("/api/settings/avatar", { method: "POST", body: fd })
                    const data = await r.json().catch(() => null)
                    if (r.ok && data && data.url) {
                      setAvatarUrl((prev) => data.url || prev)
                      if (typeof window !== "undefined") {
                        const detail = { url: data.url || undefined, prefs: { fit: avatarFit, position: avatarPosition, zoom: avatarZoom } }
                        window.dispatchEvent(new CustomEvent("profile:avatar-updated", { detail }))
                      }
                      toast.success("Foto atualizada")
                    } else {
                      toast.error("Falha no upload")
                    }
                  } catch {
                      toast.error("Erro no upload")
                    }
                  }}
                />
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFileInteracted(true)
                      document.getElementById("avatarInput")?.click()
                    }}
                  >
                    Escolher arquivo
                  </Button>
                  {selectedFileName ? (
                    <span className="text-sm text-muted-foreground">{selectedFileName}</span>
                  ) : fileInteracted ? (
                    <span className="text-sm text-muted-foreground">Sem arquivo escolhido</span>
                  ) : null}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => { setTempFit(avatarFit); setTempPosition(avatarPosition); setTempZoom(avatarZoom); setIsEditorOpen(true) }}>Editar encaixe</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input id="firstName" placeholder="Seu nome" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input id="lastName" placeholder="Seu sobrenome" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" placeholder="(11) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar Alterações"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog.Root open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-card text-card-foreground rounded-xl border shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-bold">Editar encaixe</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="sm">Fechar</Button>
              </Dialog.Close>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border">
                {avatarUrl ? (
                  <div
                    className="w-full h-full"
                    style={{ backgroundImage: `url(${avatarUrl})`, backgroundRepeat: "no-repeat", backgroundPosition: bgPositionFrom(tempPosition), backgroundSize: bgSize(tempFit, tempZoom) }}
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="fitSel">Encaixe</Label>
                  <select id="fitSel" className="h-9 px-3 py-2 border rounded-md bg-background" value={tempFit} onChange={(e) => setTempFit(e.target.value)}>
                    <option value="cover">Preencher (cover)</option>
                    <option value="contain">Conter (contain)</option>
                    <option value="fill">Esticar (fill)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="posSel">Posição</Label>
                  <select id="posSel" className="h-9 px-3 py-2 border rounded-md bg-background" value={tempPosition} onChange={(e) => setTempPosition(e.target.value)}>
                    <option value="center">Centro</option>
                    <option value="top">Topo</option>
                    <option value="bottom">Base</option>
                    <option value="left">Esquerda</option>
                    <option value="right">Direita</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="zoomRange">Zoom</Label>
                  <input id="zoomRange" type="range" min="1" max="2" step="0.01" value={tempZoom} onChange={(e) => setTempZoom(Number(e.target.value))} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Dialog.Close asChild>
                <Button variant="outline">Cancelar</Button>
              </Dialog.Close>
              <Button onClick={async () => {
                setAvatarFit(tempFit)
                setAvatarPosition(tempPosition)
                setAvatarZoom(tempZoom)
                setIsEditorOpen(false)
                await handleSave()
              }}>Salvar</Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Informações da Organização</CardTitle>
          </div>
          <CardDescription>Configurações da sua empresa</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Nome da Organização</Label>
              <Input id="orgName" placeholder="Nome da Empresa" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Setor</Label>
                <Select value={industry || undefined} onValueChange={(v) => setIndustry(v)}>
                  <SelectTrigger id="industry">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="legal">Jurídico</SelectItem>
                    <SelectItem value="finance">Financeiro</SelectItem>
                    <SelectItem value="realestate">Imobiliário</SelectItem>
                    <SelectItem value="technology">Tecnologia</SelectItem>
                    <SelectItem value="other">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Tamanho da Empresa</Label>
                <Select value={size || undefined} onValueChange={(v) => setSize(v)}>
                  <SelectTrigger id="size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">1-10 funcionários</SelectItem>
                    <SelectItem value="medium">11-50 funcionários</SelectItem>
                    <SelectItem value="large">51-200 funcionários</SelectItem>
                    <SelectItem value="enterprise">200+ funcionários</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar Alterações"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Preferências Regionais</CardTitle>
          </div>
          <CardDescription>Idioma, fuso horário e formato de data</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select value={language || undefined} onValueChange={(v) => { setLanguage(v); broadcastPrefs({ language: v }) }}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select value={timezone || undefined} onValueChange={(v) => { setTimezone(v); broadcastPrefs({ timezone: v }) }}>
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america-saopaulo">América/São Paulo (BRT)</SelectItem>
                    <SelectItem value="america-newyork">América/Nova York (EST)</SelectItem>
                    <SelectItem value="europe-london">Europa/Londres (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Formato de Data</Label>
              <Select value={dateFormat || undefined} onValueChange={(v) => { setDateFormat(v); broadcastPrefs({ dateFormat: v }) }}>
                <SelectTrigger id="dateFormat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd-mm-yyyy">DD/MM/AAAA</SelectItem>
                  <SelectItem value="mm-dd-yyyy">MM/DD/AAAA</SelectItem>
                  <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar Alterações"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
