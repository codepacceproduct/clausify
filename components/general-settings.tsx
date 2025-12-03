"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, Globe, Building2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { toast } from "sonner"

export function GeneralSettings() {
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingOrg, setSavingOrg] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")

  const [language, setLanguage] = useState("pt-br")
  const [timezone, setTimezone] = useState("america-saopaulo")
  const [dateFormat, setDateFormat] = useState("dd-mm-yyyy")

  const [orgName, setOrgName] = useState("")
  const [industry, setIndustry] = useState("legal")
  const [size, setSize] = useState("medium")
  const [allowedDomainsText, setAllowedDomainsText] = useState("")

  const initialProfile = useMemo(
    () => ({ firstName, lastName, email, phone, bio, language, timezone, dateFormat }),
    [firstName, lastName, email, phone, bio, language, timezone, dateFormat]
  )
  const [profileSnapshot, setProfileSnapshot] = useState(initialProfile)
  const initialOrg = useMemo(() => ({ orgName, industry, size }), [orgName, industry, size])
  const [orgSnapshot, setOrgSnapshot] = useState(initialOrg)

  useEffect(() => {
    setProfileSnapshot(initialProfile)
  }, [initialProfile])
  useEffect(() => {
    setOrgSnapshot(initialOrg)
  }, [initialOrg])

  const fetchData = useCallback(async () => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user
      const meta = (user?.user_metadata as any) || {}
      setFirstName((meta.name as string) || "")
      setLastName((meta.surname as string) || "")
      setEmail((user?.email as string) || "")
      setPhone((meta.phone as string) || "")
      setBio((meta.bio as string) || "")
      setLanguage("pt-br")
      setTimezone("america-saopaulo")
      setDateFormat("dd-mm-yyyy")
      setFormKey((k) => k + 1)
      setLoading(false)
      return
    }
    const [profRes, orgRes] = await Promise.all([
      fetch("/api/settings/profile", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/settings/organization", { headers: { Authorization: `Bearer ${token}` } }),
    ])
    const profJson = await profRes.json()
    const orgJson = await orgRes.json()
    const p = profJson?.profile
    if (p) {
      setFirstName(p.name || "")
      setLastName(p.surname || "")
      setEmail(p.email || "")
      setPhone(p.phone || "")
      setBio(p.bio || "")
      const prefs = p.regional_preferences || {}
      setLanguage(prefs.language || "pt-br")
      setTimezone(prefs.timezone || "america-saopaulo")
      setDateFormat(prefs.dateFormat || "dd-mm-yyyy")
    } else {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user
      const meta = (user?.user_metadata as any) || {}
      setFirstName((meta.name as string) || "")
      setLastName((meta.surname as string) || "")
      setEmail((user?.email as string) || "")
      setPhone((meta.phone as string) || "")
      setBio((meta.bio as string) || "")
      setLanguage("pt-br")
      setTimezone("america-saopaulo")
      setDateFormat("dd-mm-yyyy")
    }
    setFormKey((k) => k + 1)
    const o = orgJson?.organization
    if (o) {
      setOrgName(o.name || "")
      setIndustry(o.industry || "legal")
      setSize(o.size || "medium")
      setAllowedDomainsText(Array.isArray(o.allowed_domains) ? o.allowed_domains.join(", ") : "")
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.access_token) {
        await fetchData()
      }
    })
    return () => {
      sub.subscription?.unsubscribe()
    }
  }, [fetchData])

  const saveProfile = async () => {
    setSavingProfile(true)
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) {
      setSavingProfile(false)
      return
    }
    const res = await fetch("/api/settings/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: firstName,
        surname: lastName,
        email,
        phone,
        bio,
        regional_preferences: { language, timezone, dateFormat },
      }),
    })
    if (res.ok) {
      setProfileSnapshot({ firstName, lastName, email, phone, bio, language, timezone, dateFormat })
      toast.success("Perfil atualizado com sucesso")
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err?.error || "Não foi possível salvar o perfil")
    }
    setSavingProfile(false)
  }

  const resetProfile = () => {
    setFirstName(profileSnapshot.firstName)
    setLastName(profileSnapshot.lastName)
    setEmail(profileSnapshot.email)
    setPhone(profileSnapshot.phone)
    setBio(profileSnapshot.bio)
    setLanguage(profileSnapshot.language)
    setTimezone(profileSnapshot.timezone)
    setDateFormat(profileSnapshot.dateFormat)
  }

  const saveOrg = async () => {
    setSavingOrg(true)
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) {
      setSavingOrg(false)
      return
    }
    const res = await fetch("/api/settings/organization", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: orgName, industry, size, allowed_domains: allowedDomainsText }),
    })
    if (res.ok) {
      setOrgSnapshot({ orgName, industry, size })
      toast.success("Organização atualizada com sucesso")
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err?.error || "Não foi possível salvar a organização")
    }
    setSavingOrg(false)
  }

  const resetOrg = () => {
    setOrgName(orgSnapshot.orgName)
    setIndustry(orgSnapshot.industry)
    setSize(orgSnapshot.size)
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
          <form key={`profile-${formKey}`} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input key={`firstName-${formKey}`} id="firstName" placeholder="João" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                {!firstName && <p className="text-xs text-muted-foreground">Preencha seu nome</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input key={`lastName-${formKey}`} id="lastName" placeholder="Silva" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                {!lastName && <p className="text-xs text-muted-foreground">Preencha seu sobrenome</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input key={`email-${formKey}`} id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              {!email && <p className="text-xs text-muted-foreground">Preencha seu e-mail</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input key={`phone-${formKey}`} id="phone" placeholder="(11) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} />
              {!phone && <p className="text-xs text-muted-foreground">Preencha seu telefone</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea key={`bio-${formKey}`} id="bio" placeholder="Conte um pouco sobre você" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
              {!bio && <p className="text-xs text-muted-foreground">Preencha sua bio</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowedDomains">Domínios permitidos para convites</Label>
              <Input
                key={`allowed-${formKey}`}
                id="allowedDomains"
                placeholder="ex: empresa.com, parceiro.com.br"
                value={allowedDomainsText}
                onChange={(e) => setAllowedDomainsText(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={resetProfile} disabled={savingProfile || loading}>Cancelar</Button>
              <Button type="button" onClick={saveProfile} disabled={savingProfile || loading}>{savingProfile ? "Salvando..." : "Salvar Alterações"}</Button>
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
          <form key={`org-${formKey}`} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Nome da Organização</Label>
              <Input id="orgName" placeholder="Nome da Empresa" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Setor</Label>
                <Select key={`industry-${formKey}`} value={industry} onValueChange={setIndustry}>
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
                <Select key={`size-${formKey}`} value={size} onValueChange={setSize}>
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
              <Button variant="outline" type="button" onClick={resetOrg} disabled={savingOrg || loading}>Cancelar</Button>
              <Button type="button" onClick={saveOrg} disabled={savingOrg || loading}>{savingOrg ? "Salvando..." : "Salvar Alterações"}</Button>
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
          <form key={`prefs-${formKey}`} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select key={`language-${formKey}`} value={language} onValueChange={setLanguage}>
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
                <Select key={`tz-${formKey}`} value={timezone} onValueChange={setTimezone}>
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
              <Select key={`date-${formKey}`} value={dateFormat} onValueChange={setDateFormat}>
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
              <Button variant="outline" type="button" onClick={resetProfile} disabled={savingProfile || loading}>Cancelar</Button>
              <Button type="button" onClick={saveProfile} disabled={savingProfile || loading}>{savingProfile ? "Salvando..." : "Salvar Alterações"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
