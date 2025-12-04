"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { Users, Link as LinkIcon, Mail, Building2, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { getUserEmail } from "@/lib/auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TeamsSettings() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [inviteFrom, setInviteFrom] = useState("")
  const [inviteTo, setInviteTo] = useState("")
  const [orgLoading, setOrgLoading] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [orgName, setOrgName] = useState("")
  const [legalName, setLegalName] = useState("")
  const [taxId, setTaxId] = useState("")
  const [industry, setIndustry] = useState("")
  const [size, setSize] = useState("")
  const [phone, setPhone] = useState("")
  const [companyEmail, setCompanyEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [address1, setAddress1] = useState("")
  const [address2, setAddress2] = useState("")
  const [city, setCity] = useState("")
  const [region, setRegion] = useState("")
  const [country, setCountry] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [memberCount, setMemberCount] = useState(0)
  const [members, setMembers] = useState<Array<{ email: string; name: string | null; surname: string | null; role: string; status: string; invited_at: string | null; joined_at: string | null }>>([])

  function toIso(d: Date) {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  }

  function fromIso(s: string) {
    if (!s) return undefined
    const [y, m, d] = s.split("-").map((x) => Number(x))
    if (!y || !m || !d) return undefined
    return new Date(y, m - 1, d)
  }

  const validEmail = (v: string) => /.+@.+\..+/.test(v)

  const handleGenerate = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error("Preencha nome, sobrenome e e-mail")
      return
    }
    if (!validEmail(email)) {
      toast.error("E-mail inválido")
      return
    }
    if (!inviteFrom || !inviteTo) {
      toast.error("Defina o período De e Até para o convite")
      return
    }
    if (new Date(inviteTo).getTime() < new Date(inviteFrom).getTime()) {
      toast.error("A data 'Até' deve ser posterior à data 'De'")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: firstName,
          surname: lastName,
          email,
          valid_from: new Date(inviteFrom).toISOString(),
          valid_to: new Date(inviteTo).toISOString(),
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (res.ok && j.link) {
        setGeneratedLink(j.link)
        toast.success("Link gerado")
      } else {
        toast.error(j?.error || "Falha ao gerar link")
      }
    } catch {
      toast.error("Erro ao gerar link")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!generatedLink) return
    try {
      await navigator.clipboard.writeText(generatedLink)
      toast.success("Link copiado")
    } catch {
      toast.error("Não foi possível copiar")
    }
  }

  const handleEmailSend = () => {
    if (!generatedLink || !email) return
    const subject = encodeURIComponent("Convite para acessar a Clausify")
    const body = encodeURIComponent(
      `Olá ${firstName},\n\nVocê foi convidado para acessar a Clausify. Use o link abaixo para entrar com Magic Link:\n\n${generatedLink}\n\nSe tiver qualquer dúvida, responda este e-mail.\n\nAbraços,`
    )
    const href = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`
    window.open(href)
  }

  function fmtDate(iso: string) {
    const d = new Date(iso)
    const raw = typeof window !== "undefined" ? localStorage.getItem("prefs") : null
    let df = "dd-mm-yyyy"
    try { df = raw ? (JSON.parse(raw).dateFormat || df) : df } catch {}
    const dd = String(d.getDate()).padStart(2, "0")
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const yyyy = d.getFullYear()
    if (df === "mm-dd-yyyy") return `${mm}/${dd}/${yyyy}`
    if (df === "yyyy-mm-dd") return `${yyyy}-${mm}-${dd}`
    return `${dd}/${mm}/${yyyy}`
  }


  


  const [pendingStatuses, setPendingStatuses] = useState<Record<string, string>>({})
  const [pendingRoles, setPendingRoles] = useState<Record<string, string>>({})
  const [savingStatuses, setSavingStatuses] = useState(false)
  const normalizeRole = (r: string) => {
    const v = (r || "").toLowerCase()
    if (v === "owner" || v === "admin") return "admin"
    if (v === "moderator") return "moderator"
    if (v === "member" || v === "user") return "member"
    return "member"
  }
  const setMemberStatus = (email: string, status: string) => {
    setMembers((prev) => prev.map((m) => (m.email === email ? { ...m, status } : m)))
    setPendingStatuses((prev) => ({ ...prev, [email]: status }))
  }
  const setMemberRole = (email: string, role: string) => {
    setMembers((prev) => prev.map((m) => (m.email === email ? { ...m, role } : m)))
    setPendingRoles((prev) => ({ ...prev, [email]: role }))
  }
  const saveAllStatusChanges = async () => {
  const requesterEmail = getUserEmail() || ""
    if (!userEmail) return
    const statusChanges = Object.entries(pendingStatuses)
    const roleChanges = Object.entries(pendingRoles)
    const allEmails = Array.from(new Set([...statusChanges.map(([e]) => e), ...roleChanges.map(([e]) => e)]))
    if (allEmails.length === 0) return toast.info("Nada para salvar")
    setSavingStatuses(true)
    try {
      for (const targetEmail of allEmails) {
        const status = pendingStatuses[targetEmail]
        const role = pendingRoles[targetEmail]
        const payload: any = { requester: userEmail, member_email: targetEmail }
        if (status) payload.status = status
        if (role) payload.role = role
        await fetch(`/api/organizations/members`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }
      toast.success("Alterações salvas")
      setPendingStatuses({})
      setPendingRoles({})
      await loadMembers()
    } catch {
      toast.error("Falha ao salvar alterações")
    }
    setSavingStatuses(false)
  }

  

  const loadOrganization = useCallback(async () => {
    const userEmail = getUserEmail() || ""
    if (!userEmail) return
    setOrgLoading(true)
    try {
      const r = await fetch(`/api/organizations/current`)
      const j = await r.json().catch(() => ({}))
      const o = j.organization || null
      if (o) {
        setOrgId(o.id || null)
        setOrgName(o.name || "")
        setLegalName(o.legal_name || "")
        setTaxId(o.tax_id || "")
        setIndustry(o.industry || "")
        setSize(o.size || "")
        setPhone(o.phone || "")
        setCompanyEmail(o.email || "")
        setWebsite(o.website || "")
        setAddress1(o.address_line1 || "")
        setAddress2(o.address_line2 || "")
        setCity(o.city || "")
        setRegion(o.region || "")
        setCountry(o.country || "")
        setPostalCode(o.postal_code || "")
        setMemberCount(Number(j.member_count || 0))
      }
    } catch {}
    setOrgLoading(false)
  }, [])

  const loadMembers = useCallback(async () => {
    const userEmail = getUserEmail() || ""
    if (!userEmail) return
    try {
      const r = await fetch(`/api/organizations/members`)
      const j = await r.json().catch(() => ({ members: [] }))
      setMembers(j.members || [])
    } catch {}
  }, [])

  useEffect(() => {
    loadOrganization()
    loadMembers()
  }, [loadOrganization, loadMembers])

  const handleOrgSave = async () => {
    const userEmail = getUserEmail() || ""
    if (!userEmail) return
    const payload = {
      organization: {
        name: orgName,
        legal_name: legalName,
        tax_id: taxId,
        industry,
        size,
        phone,
        email: companyEmail,
        website,
        address_line1: address1,
        address_line2: address2,
        city,
        region,
        country,
        postal_code: postalCode,
      },
    }
    try {
      const r = await fetch(`/api/organizations/current`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (r.ok) {
        toast.success("Organização atualizada")
        await loadOrganization()
      } else {
        const j = await r.json().catch(() => ({}))
        toast.error(j?.error || "Falha ao atualizar")
      }
    } catch {
      toast.error("Erro ao atualizar")
    }
  }

  const handleOrgDelete = async () => {
    const userEmail = getUserEmail() || ""
    if (!userEmail || !orgId) return
    const ok = window.confirm("Tem certeza que deseja excluir a organização? Esta ação é irreversível.")
    if (!ok) return
    try {
      const r = await fetch(`/api/organizations/current`, { method: "DELETE" })
      if (r.ok) {
        toast.success("Organização excluída")
        setOrgId(null)
        setMemberCount(0)
        setMembers([])
        setOrgName("")
        setLegalName("")
        setTaxId("")
        setIndustry("")
        setSize("")
        setPhone("")
        setCompanyEmail("")
        setWebsite("")
        setAddress1("")
        setAddress2("")
        setCity("")
        setRegion("")
        setCountry("")
        setPostalCode("")
      } else {
        const j = await r.json().catch(() => ({}))
        toast.error(j?.error || "Falha ao excluir")
      }
    } catch {
      toast.error("Erro ao excluir")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Equipes</CardTitle>
          </div>
          <CardDescription>Convide novos usuários com Nome, Sobrenome e E-mail</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input id="firstName" placeholder="Nome" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input id="lastName" placeholder="Sobrenome" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="usuario@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="inviteFrom">De</Label>
              <DatePicker value={fromIso(inviteFrom)} onChange={(d) => setInviteFrom(d ? toIso(d) : "")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteTo">Até</Label>
              <DatePicker value={fromIso(inviteTo)} onChange={(d) => setInviteTo(d ? toIso(d) : "")} />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={handleGenerate} disabled={loading}>{loading ? "Gerando..." : "Gerar Link Magic"}</Button>
          </div>
        </CardContent>
      </Card>

      {generatedLink ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Link Gerado</CardTitle>
            </div>
            <CardDescription>Copie ou envie por e-mail</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input value={generatedLink} readOnly className="flex-1" />
              <Button variant="outline" size="sm" onClick={handleCopy}>Copiar</Button>
              <Button variant="outline" size="sm" onClick={handleEmailSend}>
                <Mail className="mr-2 h-4 w-4" />
                Enviar por e-mail
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Organização</CardTitle>
          </div>
          <CardDescription>Dados completos da empresa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Nome</Label>
              <Input id="orgName" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legalName">Razão Social</Label>
              <Input id="legalName" value={legalName} onChange={(e) => setLegalName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">CNPJ</Label>
              <Input id="taxId" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">E-mail corporativo</Label>
              <Input id="companyEmail" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
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
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="address1">Endereço Linha 1</Label>
              <Input id="address1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="address2">Endereço Linha 2</Label>
              <Input id="address2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Estado/Região</Label>
              <Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">CEP</Label>
              <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">Membros: {memberCount}</div>
            <div className="flex items-center gap-2">
              {(() => {
                const userEmail = getUserEmail() || ""
                const currentUserRole = normalizeRole((members.find((x) => x.email === userEmail)?.role || ""))
                const isLeader = currentUserRole === "admin"
                return (
                  <Button onClick={handleOrgSave} disabled={orgLoading || !isLeader}>Salvar</Button>
                )
              })()}
              <Button variant="outline" onClick={loadOrganization} disabled={orgLoading}>Recarregar</Button>
              {(() => {
                const userEmail = getUserEmail() || ""
                const currentUserRole = normalizeRole((members.find((x) => x.email === userEmail)?.role || ""))
                const isLeader = currentUserRole === "admin"
                return (
                  <Button variant="destructive" onClick={handleOrgDelete} disabled={!orgId || !isLeader}><Trash2 className="mr-2 h-4 w-4" />Excluir</Button>
                )
              })()}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Membros da Organização</CardTitle>
          </div>
          <CardDescription>Pessoas que entraram via Magic Link</CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-sm text-muted-foreground">Nenhum membro encontrado</div>
          ) : (
            <div className="divide-y border rounded-lg">
              <div className="grid grid-cols-6 gap-4 px-4 py-3 text-xs text-muted-foreground">
                <div>Nome</div>
                <div>E-mail</div>
                <div>Função</div>
                <div>Convite</div>
                <div>Entrada</div>
                <div>Status</div>
              </div>
              {members.map((m) => (
                <div key={m.email} className="grid grid-cols-6 gap-4 px-4 py-3 items-center">
                  <div className="truncate">{[m.name, m.surname].filter(Boolean).join(" ") || "—"}</div>
                  <div className="truncate">{m.email}</div>
                  <div className="flex items-center gap-2 min-w-[160px] pr-0">
                    {(() => {
                      const userEmail = getUserEmail() || ""
                      const currentUserRole = normalizeRole((members.find((x) => x.email === userEmail)?.role || ""))
                      const isLeader = currentUserRole === "admin"
                      return (
                        <Select value={normalizeRole(m.role || "")} disabled={!isLeader} onValueChange={(v) => setMemberRole(m.email, v)}>
                          <SelectTrigger id={`role-${m.email}`} className="w-24 h-7 px-2 text-xs truncate shrink-0">
                            <SelectValue className="truncate" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="moderator">Moderador</SelectItem>
                            <SelectItem value="member">Membro</SelectItem>
                          </SelectContent>
                        </Select>
                      )
                    })()}
                  </div>
                  <div className="truncate">{m.invited_at ? fmtDate(m.invited_at) : "—"}</div>
                  <div className="truncate">{m.joined_at ? fmtDate(m.joined_at) : "—"}</div>
                  <div className="flex items-center">
                    {(() => {
                      const userEmail = getUserEmail() || ""
                      const currentUserRole = normalizeRole((members.find((x) => x.email === userEmail)?.role || ""))
                      const isLeader = currentUserRole === "admin"
                      return (
                        <Select value={(m.status || "active").toLowerCase()} disabled={!isLeader} onValueChange={(v) => setMemberStatus(m.email, v)}>
                          <SelectTrigger id={`status-${m.email}`} className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="inactive">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      )
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end mt-4 gap-2">
            <Button size="sm" onClick={saveAllStatusChanges} disabled={savingStatuses}>Salvar Alteração</Button>
            <Button size="sm" variant="outline" onClick={loadMembers}>Atualizar lista</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
