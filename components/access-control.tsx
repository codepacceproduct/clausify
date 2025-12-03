"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, Trash2, Mail, Clock, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase-client"

type Member = {
  id: string
  organization_id: string
  user_id: string | null
  email: string
  role: "owner" | "admin" | "member"
  status: "invited" | "active" | "removed"
  invited_at: string | null
  joined_at: string | null
}

const rolePermissions = {
  admin: ["Gerenciar usuários", "Editar contratos", "Excluir contratos", "Ver relatórios", "Configurar sistema"],
  editor: ["Editar contratos", "Fazer upload", "Ver relatórios", "Comparar versões"],
  viewer: ["Visualizar contratos", "Ver relatórios"],
}

export function AccessControl() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [invEmail, setInvEmail] = useState("")
  const [invRole, setInvRole] = useState<"member" | "admin" | "owner">("member")
  const [inviting, setInviting] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [sortBy, setSortBy] = useState("invited_at")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [allowedDomainsText, setAllowedDomainsText] = useState("")

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) {
        setLoading(false)
        return
      }
      const qp = new URLSearchParams({ page: String(page), limit: String(limit), search, status: statusFilter, role: roleFilter, sortBy, order })
      const res = await fetch(`/api/settings/organization/members?${qp.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      setMembers(json?.members || [])
      setTotal(json?.total || 0)
      setLoading(false)
    }
    load()
  }, [page, limit, search, statusFilter, roleFilter, sortBy, order])

  useEffect(() => {
    const loadOrg = async () => {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) return
      const res = await fetch("/api/settings/organization", { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      const o = json?.organization
      if (o) setAllowedDomainsText(Array.isArray(o.allowed_domains) ? o.allowed_domains.join(", ") : "")
    }
    loadOrg()
  }, [])

  const invite = async () => {
    setInviting(true)
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) {
      setInviting(false)
      return
    }
    const res = await fetch("/api/settings/organization/members", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email: invEmail, role: invRole }),
    })
    const json = await res.json()
    if (res.ok && json?.member) {
      setMembers((prev) => [json.member, ...prev])
      setInvEmail("")
      setInvRole("member")
    }
    setInviting(false)
  }

  const updateRole = async (id: string, role: Member["role"]) => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) return
    const res = await fetch("/api/settings/organization/members", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, role }),
    })
    const json = await res.json()
    if (res.ok && json?.member) {
      setMembers((prev) => prev.map((m) => (m.id === id ? json.member : m)))
    }
  }

  const removeMember = async (id: string) => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) return
    const res = await fetch(`/api/settings/organization/members?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== id))
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Users List */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Usuários do Sistema</CardTitle>
              <CardDescription>Gerenciar permissões e acessos</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Buscar por email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-52"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="invited">Convidado</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="removed">Removido</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os papéis</SelectItem>
                  <SelectItem value="member">Membro</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invited_at">Ordenar por convite</SelectItem>
                  <SelectItem value="joined_at">Ordenar por entrada</SelectItem>
                  <SelectItem value="role">Ordenar por papel</SelectItem>
                </SelectContent>
              </Select>
              <Select value={order} onValueChange={(v) => setOrder(v as "asc" | "desc") }>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Asc</SelectItem>
                  <SelectItem value="desc">Desc</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="email@empresa.com"
                value={invEmail}
                onChange={(e) => setInvEmail(e.target.value)}
                className="w-52"
              />
              <Select value={invRole} onValueChange={(v) => setInvRole(v as Member["role"])}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Membro</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={invite} disabled={inviting || !invEmail}>
                <UserPlus className="h-4 w-4 mr-2" /> Convidar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/20">
              <div className="font-medium">Primeiros passos</div>
              <div className="text-sm text-muted-foreground mt-2">Convide sua equipe, defina papéis e configure domínios permitidos. Use os controles acima para gerenciar membros.</div>
            </div>
            {!loading && members.length === 0 && (
              <div className="p-4 border rounded-lg text-sm text-muted-foreground">Nenhum membro encontrado</div>
            )}
            {members.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" alt={user.email} />
                    <AvatarFallback>
                      {user.email.split("@")[0].slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.email}</p>
                      <Badge
                        variant={user.role === "admin" || user.role === "owner" ? "default" : "secondary"}
                        className={
                          user.role === "owner"
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : user.role === "admin"
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {user.role === "owner" ? "Owner" : user.role === "admin" ? "Administrador" : "Membro"}
                      </Badge>
                      {user.status === "invited" && (
                        <Badge
                          variant="destructive"
                          className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                        >
                          Convidado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {user.joined_at ? "Ativo" : "Aguardando aceite"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Select value={user.role} onValueChange={(v) => updateRole(user.id, v as Member["role"]) }>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Membro</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" onClick={() => removeMember(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground">Total: {total}</div>
              <div className="flex items-center gap-2">
                <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Prev
                </Button>
                <Button variant="outline" size="sm" disabled={page * limit >= total} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          </div>
      </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Permissões por Papel</CardTitle>
          <CardDescription>Níveis de acesso do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Administrador</h3>
            </div>
            <ul className="space-y-2 text-sm">
              {rolePermissions.admin.map((permission, index) => (
                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-success" />
                  {permission}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold">Editor</h3>
            </div>
            <ul className="space-y-2 text-sm">
              {rolePermissions.editor.map((permission, index) => (
                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-success" />
                  {permission}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Visualizador</h3>
            </div>
            <ul className="space-y-2 text-sm">
              {rolePermissions.viewer.map((permission, index) => (
                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-success" />
                  {permission}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Domínios Permitidos</CardTitle>
          <CardDescription>Limitar convites por domínio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="allowedDomainsEquipe">Domínios permitidos para convites</Label>
              <Input
                id="allowedDomainsEquipe"
                placeholder="ex: empresa.com, parceiro.com.br"
                value={allowedDomainsText}
                onChange={(e) => setAllowedDomainsText(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={async () => {
                  const { data } = await supabase.auth.getSession()
                  const token = data.session?.access_token
                  if (!token) return
                  await fetch("/api/settings/organization", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ allowed_domains: allowedDomainsText }),
                  })
                }}
              >
                Salvar Domínios
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
