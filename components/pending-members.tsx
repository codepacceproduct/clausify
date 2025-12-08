"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getAuthToken, getUserEmail } from "@/lib/auth"
import { toast } from "sonner"

interface MemberRow {
  email: string
  name: string | null
  surname: string | null
  phone: string | null
  role: string
  status: string
  invited_at: string | null
  joined_at: string | null
}

export function PendingMembers() {
  const [items, setItems] = useState<MemberRow[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [acting, setActing] = useState<string | null>(null)

  async function load() {
    const email = getUserEmail() || ""
    if (!email) return
    setLoading(true)
    try {
      const token = getAuthToken()
      const headers: any = token ? { Authorization: `Bearer ${token}` } : undefined
      const r = await fetch(`/api/organizations/members`, { headers })
      const j = await r.json().catch(() => ({ members: [] }))
      const all: MemberRow[] = Array.isArray(j?.members) ? j.members : []
      const filtered = all.filter((m) => {
        const s = String(m.status || "").toLowerCase()
        const invited = s === "invited"
        const waiting = s !== "active" && !m.joined_at
        return invited || waiting
      })
      const sorted = filtered.sort((a, b) => {
        const ta = a.invited_at ? new Date(a.invited_at).getTime() : 0
        const tb = b.invited_at ? new Date(b.invited_at).getTime() : 0
        return tb - ta
      })
      setItems(sorted)
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((m) => {
      const n = `${m.name || ""} ${m.surname || ""}`.toLowerCase()
      return n.includes(q) || (m.email || "").toLowerCase().includes(q) || (m.phone || "").toLowerCase().includes(q)
    })
  }, [items, search])

  async function approve(email: string) {
    setActing(email)
    try {
      const token = getAuthToken()
      const headers: any = { "Content-Type": "application/json" }
      if (token) headers.Authorization = `Bearer ${token}`
      const r = await fetch(`/api/organizations/members`, { method: "PUT", headers, body: JSON.stringify({ member_email: email, status: "active" }) })
      if (!r.ok) throw new Error("fail")
      toast.success("Solicitação aprovada")
      setItems((prev) => prev.filter((m) => m.email !== email))
    } catch {
      toast.error("Falha ao aprovar")
    }
    setActing(null)
  }

  async function reject(email: string) {
    setActing(email)
    try {
      const token = getAuthToken()
      const headers: any = { "Content-Type": "application/json" }
      if (token) headers.Authorization = `Bearer ${token}`
      const r = await fetch(`/api/organizations/members`, { method: "DELETE", headers, body: JSON.stringify({ member_email: email }) })
      if (!r.ok) throw new Error("fail")
      toast.success("Solicitação rejeitada")
      setItems((prev) => prev.filter((m) => m.email !== email))
    } catch {
      toast.error("Falha ao rejeitar")
    }
    setActing(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Solicitações de Vinculação</CardTitle>
          <CardDescription>Usuários aguardando aprovação para entrar na organização</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Input placeholder="Buscar por nome, email ou telefone" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Badge variant="secondary">{items.length} pendente(s)</Badge>
          </div>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Sobrenome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">{loading ? "Carregando..." : "Nenhuma solicitação pendente"}</TableCell>
                  </TableRow>
                )}
                {visible.map((m) => (
                  <TableRow key={m.email}>
                    <TableCell className="font-medium">{m.name || "—"}</TableCell>
                    <TableCell>{m.surname || "—"}</TableCell>
                    <TableCell>{m.email}</TableCell>
                    <TableCell>{m.phone || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" disabled={acting === m.email} onClick={() => approve(m.email)}>{acting === m.email ? "Processando..." : "Aprovar"}</Button>
                        <Button size="sm" variant="destructive" disabled={acting === m.email} onClick={() => reject(m.email)}>{acting === m.email ? "Processando..." : "Rejeitar"}</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

