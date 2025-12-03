"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { Users, Link as LinkIcon, Mail } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

export function TeamsSettings() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [invites, setInvites] = useState<Array<{ email: string; name: string | null; surname: string | null; count: number; last_created: string }>>([])
  const [query, setQuery] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

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
    setLoading(true)
    try {
      const res = await fetch("/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: firstName, surname: lastName, email }),
      })
      const j = await res.json().catch(() => ({}))
      if (res.ok && j.link) {
        setGeneratedLink(j.link)
        toast.success("Link gerado")
        await loadInvites()
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
    const dd = String(d.getDate()).padStart(2, "0")
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const yyyy = d.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }

  const loadInvites = useCallback(async (opts?: { pageOverride?: number }) => {
    try {
      const params = new URLSearchParams()
      const currentPage = opts?.pageOverride ?? page
      params.set("page", String(currentPage))
      if (query.trim()) params.set("q", query.trim())
      if (fromDate) params.set("from", fromDate)
      if (toDate) params.set("to", toDate)
      const r = await fetch(`/api/teams/invite?${params.toString()}`)
      const j = await r.json().catch(() => ({ invites: [], total: 0 }))
      setInvites(j.invites || [])
      setTotal(Number(j.total || 0))
    } catch {}
  }, [page, query, fromDate, toDate])
  useEffect(() => {
    loadInvites()
  }, [loadInvites])

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
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Convites Gerados</CardTitle>
          </div>
          <CardDescription>Lista de destinatários e quantidade de links gerados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div className="md:col-span-2">
              <Label htmlFor="query">Filtro</Label>
              <Input id="query" placeholder="Nome, sobrenome ou e-mail" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="from">De</Label>
              <DatePicker value={fromIso(fromDate)} onChange={(d) => setFromDate(d ? toIso(d) : "")} />
            </div>
            <div>
              <Label htmlFor="to">Até</Label>
              <DatePicker value={fromIso(toDate)} onChange={(d) => setToDate(d ? toIso(d) : "")} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" onClick={() => { setQuery(""); setFromDate(""); setToDate(""); setPage(1) }}>Limpar</Button>
            <Button onClick={() => { setPage(1) }}>Aplicar filtros</Button>
          </div>
          {invites.length === 0 ? (
            <div className="text-sm text-muted-foreground">Nenhum convite gerado ainda</div>
          ) : (
            <div className="divide-y border rounded-lg">
              <div className="grid grid-cols-5 gap-2 px-4 py-3 text-xs text-muted-foreground">
                <div>Nome</div>
                <div>Sobrenome</div>
                <div>E-mail</div>
                <div>Último Convite</div>
                <div className="text-right">Links Gerados</div>
              </div>
              {invites.map((i) => (
                <div key={i.email} className="grid grid-cols-5 gap-2 px-4 py-3 items-center">
                  <div className="truncate">{i.name || "—"}</div>
                  <div className="truncate">{i.surname || "—"}</div>
                  <div className="truncate">{i.email}</div>
                  <div className="truncate">{fmtDate(i.last_created)}</div>
                  <div className="text-right">{i.count}</div>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">Página {page} de {Math.max(1, Math.ceil(total / pageSize))}</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => { setPage((p) => Math.max(1, p - 1)) }}>Anterior</Button>
              <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / pageSize)} onClick={() => { setPage((p) => p + 1) }}>Próxima</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
