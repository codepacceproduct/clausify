"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Globe, Building2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getUserEmail } from "@/lib/auth"
import { toast } from "sonner"

export function GeneralSettings() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const [orgName, setOrgName] = useState("")
  const [industry, setIndustry] = useState("")
  const [size, setSize] = useState("")
  const [organizationId, setOrganizationId] = useState<string | null>(null)

  const [language, setLanguage] = useState("")
  const [timezone, setTimezone] = useState("")
  const [dateFormat, setDateFormat] = useState("")

  useEffect(() => {
    const load = async () => {
      const userEmail = getUserEmail()
      if (!userEmail) return
      const res = await fetch(`/api/settings/profile?email=${encodeURIComponent(userEmail)}`)
      if (!res.ok) return
      const { profile, organization } = await res.json()
      if (profile) {
        setFirstName(profile.name ?? "")
        setLastName(profile.surname ?? "")
        setEmail(profile.email ?? userEmail)
        setPhone(profile.phone ?? "")
        setOrganizationId(profile.organization_id ?? null)
        const prefs = profile.regional_preferences ?? {}
        setLanguage(prefs.language ?? "pt-br")
        setTimezone(prefs.timezone ?? "america-saopaulo")
        setDateFormat(prefs.dateFormat ?? "dd-mm-yyyy")
      }
      if (organization) {
        setOrgName(organization.name ?? "")
        setIndustry(organization.industry ?? "")
        setSize(organization.size ?? "")
        setTimezone(organization.timezone ?? timezone)
        setLanguage(organization.locale ?? language)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    const payload = {
      email,
      name: firstName,
      surname: lastName,
      phone,
      regional_preferences: { language, timezone, dateFormat },
      organization: orgName.trim()
        ? { id: organizationId ?? undefined, name: orgName, industry, size, timezone, locale: language }
        : null,
    }
    const res = await fetch(`/api/settings/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      toast.success("Configurações salvas")
    } else {
      toast.error("Falha ao salvar configurações")
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input id="firstName" placeholder="João" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input id="lastName" placeholder="Silva" value={lastName} onChange={(e) => setLastName(e.target.value)} />
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" placeholder="(11) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline">Cancelar</Button>
              <Button onClick={handleSave}>Salvar Alterações</Button>
            </div>
          </form>
        </CardContent>
      </Card>

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
              <Button variant="outline">Cancelar</Button>
              <Button onClick={handleSave}>Salvar Alterações</Button>
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
                <Select value={language || undefined} onValueChange={(v) => setLanguage(v)}>
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
                <Select value={timezone || undefined} onValueChange={(v) => setTimezone(v)}>
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
              <Select value={dateFormat || undefined} onValueChange={(v) => setDateFormat(v)}>
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
              <Button variant="outline">Cancelar</Button>
              <Button onClick={handleSave}>Salvar Alterações</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
