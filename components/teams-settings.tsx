"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Trash2, Users, Search } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { getUserEmail, getAuthToken } from "@/lib/auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TeamsSettings() {
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
  const [memberQuery, setMemberQuery] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 5

  

  

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
    if (!requesterEmail) return
    const statusChanges = Object.entries(pendingStatuses)
    const roleChanges = Object.entries(pendingRoles)
    const allEmails = Array.from(new Set([...statusChanges.map(([e]) => e), ...roleChanges.map(([e]) => e)]))
    if (allEmails.length === 0) return toast.info("Nada para salvar")
    setSavingStatuses(true)
    try {
      for (const targetEmail of allEmails) {
        const status = pendingStatuses[targetEmail]
        const role = pendingRoles[targetEmail]
        const payload: any = { requester: requesterEmail, member_email: targetEmail }
        if (status) payload.status = status
        if (role) payload.role = role
        {
          const token = getAuthToken()
          const headers: any = { "Content-Type": "application/json" }
          if (token) headers.Authorization = `Bearer ${token}`
          await fetch(`/api/organizations/members`, {
            method: "PUT",
            headers,
            body: JSON.stringify(payload),
          })
        }
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
      const token = getAuthToken()
      const r = await fetch(`/api/organizations/current`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
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
      const token = getAuthToken()
      const r = await fetch(`/api/organizations/members`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
      const j = await r.json().catch(() => ({ members: [] }))
      setMembers(j.members || [])
    } catch {}
  }, [])

  useEffect(() => {
    const id = setTimeout(() => {
      loadOrganization()
      loadMembers()
    }, 0)
    return () => clearTimeout(id)
  }, [loadOrganization, loadMembers])

  const userEmail = getUserEmail() || ""
  const currentUserRole = normalizeRole((members.find((x) => x.email === userEmail)?.role || ""))
  const isLeader = currentUserRole === "admin"

  const filteredMembers = members.filter((m) => {
    const q = memberQuery.trim().toLowerCase()
    if (!q) return true
    const fullName = [m.name || "", m.surname || ""].join(" ").toLowerCase()
    return fullName.includes(q) || (m.email || "").toLowerCase().includes(q)
  })
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize))
  const start = (page - 1) * pageSize
  const currentMembers = filteredMembers.slice(start, start + pageSize)
  useEffect(() => {
    const id = setTimeout(() => setPage(1), 0)
    return () => clearTimeout(id)
  }, [memberQuery])

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
      const token = getAuthToken()
      const headers: any = { "Content-Type": "application/json" }
      if (token) headers.Authorization = `Bearer ${token}`
      const r = await fetch(`/api/organizations/current`, { method: "PUT", headers, body: JSON.stringify(payload) })
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
      const token = getAuthToken()
      const r = await fetch(`/api/organizations/current`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : undefined })
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
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Organização</CardTitle>
          </div>
          <CardDescription>Dados completos da empresa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Nome</Label>
              <Input id="orgName" value={orgName} onChange={(e) => setOrgName(e.target.value)} disabled={!isLeader} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legalName">Razão Social</Label>
              <Input id="legalName" value={legalName} onChange={(e) => setLegalName(e.target.value)} disabled={!isLeader} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">CNPJ</Label>
              <Input id="taxId" value={taxId} onChange={(e) => setTaxId(e.target.value)} disabled={!isLeader} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">E-mail corporativo</Label>
              <Input id="companyEmail" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} disabled={!isLeader} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isLeader} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} disabled={!isLeader} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Setor</Label>
              <Select value={industry || undefined} onValueChange={(v) => setIndustry(v)} disabled={!isLeader}>
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
              <Select value={size || undefined} onValueChange={(v) => setSize(v)} disabled={!isLeader}>
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
              <Input id="address1" value={address1} onChange={(e) => setAddress1(e.target.value)} disabled={!isLeader} />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="address2">Endereço Linha 2</Label>
              <Input id="address2" value={address2} onChange={(e) => setAddress2(e.target.value)} disabled={!isLeader} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} disabled={!isLeader} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Estado/Região</Label>
              <Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} disabled={!isLeader} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} disabled={!isLeader} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">CEP</Label>
              <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} disabled={!isLeader} />
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
          <CardDescription>Membros da Organização Cadastrados.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou e-mail..." value={memberQuery} onChange={(e) => setMemberQuery(e.target.value)} className="pl-10" />
          </div>
          {currentMembers.length === 0 ? (
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
              {currentMembers.map((m) => (
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
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-muted-foreground">Página {page} de {totalPages}</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Anterior</Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Próxima</Button>
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <Button size="sm" onClick={saveAllStatusChanges} disabled={savingStatuses}>Salvar Alteração</Button>
            <Button size="sm" variant="outline" onClick={loadMembers}>Atualizar lista</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
