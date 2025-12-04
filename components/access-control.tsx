"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, Edit, Trash2, Mail, Clock } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { getUserEmail, getAuthToken } from "@/lib/auth"
import { formatDistanceToNow } from "date-fns"
import { ptBR, enUS, es } from "date-fns/locale"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Member = {
  email: string
  name: string | null
  surname: string | null
  role: "admin" | "moderator" | "member"
  status: string
  invited_at: string | null
  joined_at: string | null
  avatar_url?: string | null
}

  const rolePermissions = {
    admin: ["Gerenciar usuários", "Editar contratos", "Excluir contratos", "Ver relatórios", "Configurar sistema"],
    moderator: ["Editar contratos", "Fazer upload", "Ver relatórios", "Comparar versões"],
    member: ["Visualizar contratos", "Ver relatórios"],
  }

export function AccessControl() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [newName, setNewName] = useState("")
  const [newSurname, setNewSurname] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [editingEmail, setEditingEmail] = useState<string | null>(null)
  const [editingRole, setEditingRole] = useState<"admin" | "moderator" | "member">("member")
  const [newRole, setNewRole] = useState<"admin" | "moderator" | "member">("member")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState<string | null>(null)
  const locale = useMemo(() => {
    const prefs = typeof window !== "undefined" ? ((window as any).__prefs || (() => { try { return JSON.parse(localStorage.getItem("prefs") || "{}") } catch { return {} } })()) : {}
    const lang = prefs?.language || "pt-br"
    if (lang === "en") return enUS
    if (lang === "es") return es
    return ptBR
  }, [])

  useEffect(() => {
    const email = getUserEmail() || ""
    if (!email) {
      setLoading(false)
      return
    }
    const url = `/api/organizations/members`
    const token = getAuthToken()
    fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
      .then(async (r) => r.json())
      .then((json) => {
        setMembers(Array.isArray(json?.members) ? json.members : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const requesterEmail = getUserEmail() || ""
  const currentUserRole = useMemo(() => {
    const me = members.find((m) => m.email === requesterEmail)
    return (me?.role || "member") as "admin" | "moderator" | "member"
  }, [members, requesterEmail])
  const isAdmin = currentUserRole === "admin"

  function reloadMembers() {
    const email = requesterEmail
    if (!email) return
    const url = `/api/organizations/members`
    const token = getAuthToken()
    fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined }).then(async (r) => r.json()).then((json) => {
      setMembers(Array.isArray(json?.members) ? json.members : [])
    })
  }

  async function handleCreateUser() {
    if (!newEmail || !newPassword) return
    setInviting(true)
    try {
      const token = getAuthToken()
      const headers: any = { "Content-Type": "application/json" }
      if (token) headers.Authorization = `Bearer ${token}`
      const res = await fetch("/api/organizations/members", {
        method: "POST",
        headers,
        body: JSON.stringify({ email: newEmail, name: newName || undefined, surname: newSurname || undefined, password: newPassword, role: newRole }),
      })
      if (res.ok) {
        setInviteOpen(false)
        setNewEmail("")
        setNewName("")
        setNewSurname("")
        setNewPassword("")
        setNewRole("member")
        reloadMembers()
      }
    } finally {
      setInviting(false)
    }
  }

  async function handleSaveRole(email: string) {
    const token = getAuthToken()
    const headers: any = { "Content-Type": "application/json" }
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch("/api/organizations/members", { method: "PUT", headers, body: JSON.stringify({ member_email: email, role: editingRole }) })
    if (res.ok) {
      setEditingEmail(null)
      reloadMembers()
    }
  }

  async function confirmDelete() {
    if (!deleteEmail) return
    const token = getAuthToken()
    const headers: any = { "Content-Type": "application/json" }
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch("/api/organizations/members", { method: "DELETE", headers, body: JSON.stringify({ member_email: deleteEmail }) })
    setDeleteOpen(false)
    setDeleteEmail(null)
    if (res.ok) reloadMembers()
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
            {isAdmin ? (
              <>
                <Button onClick={() => setInviteOpen(true)}>Adicionar Usuário</Button>
                <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Novo Usuário</DialogTitle>
                      <DialogDescription>Informe os dados para cadastro</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3">
                      <Input placeholder="Nome" value={newName} onChange={(e) => setNewName(e.target.value)} />
                      <Input placeholder="Sobrenome" value={newSurname} onChange={(e) => setNewSurname(e.target.value)} />
                      <Input placeholder="E-mail" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                      <Input placeholder="Senha" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Função</span>
                        <Select value={newRole} onValueChange={(v) => setNewRole(v as any)}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="moderator">Moderador</SelectItem>
                            <SelectItem value="member">Membro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancelar</Button>
                      <Button onClick={handleCreateUser} disabled={inviting || !newEmail || !newPassword}>Cadastrar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-sm text-muted-foreground">Carregando usuários...</div>
            ) : members.length === 0 ? (
              <div className="text-sm text-muted-foreground">Nenhum usuário encontrado</div>
            ) : (
              members.map((user) => (
              <div key={user.email} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name || user.email} />
                    <AvatarFallback>
                      {([user.name, user.surname].filter(Boolean).join(" ") || user.email)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{[user.name, user.surname].filter(Boolean).join(" ") || "—"}</p>
                      <Badge
                        variant={user.role === "admin" ? "default" : user.role === "moderator" ? "secondary" : "secondary"}
                        className={
                          user.role === "admin"
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : user.role === "moderator"
                              ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {user.role === "admin" ? "Administrador" : user.role === "moderator" ? "Moderador" : "Membro"}
                      </Badge>
                      {user.status === "inactive" && (
                        <Badge
                          variant="destructive"
                          className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                        >
                          Inativo
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
                        {user.joined_at
                          ? `Entrou ${formatDistanceToNow(new Date(user.joined_at), { addSuffix: true, locale })}`
                          : user.invited_at
                            ? `Convite ${formatDistanceToNow(new Date(user.invited_at), { addSuffix: true, locale })}`
                            : "Sem atividade"
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isAdmin ? (
                    editingEmail === user.email ? (
                      <div className="flex items-center gap-2">
                        <Select value={editingRole} onValueChange={(v) => setEditingRole(v as any)}>
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Papel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="moderator">Moderador</SelectItem>
                            <SelectItem value="member">Membro</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="sm" onClick={() => handleSaveRole(user.email)}>Salvar</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingEmail(null)}>Cancelar</Button>
                      </div>
                    ) : (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => { setEditingEmail(user.email); setEditingRole(user.role) }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setDeleteEmail(user.email); setDeleteOpen(true) }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )
                  ) : null}
                </div>
              </div>
            )))
            }
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
              <h3 className="font-semibold">Moderador</h3>
            </div>
            <ul className="space-y-2 text-sm">
              {rolePermissions.moderator.map((permission, index) => (
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
              <h3 className="font-semibold">Membro</h3>
            </div>
            <ul className="space-y-2 text-sm">
              {rolePermissions.member.map((permission, index) => (
                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-success" />
                  {permission}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir usuário</DialogTitle>
            <DialogDescription>Tem certeza que deseja excluir este usuário?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Delete confirmation dialog attached to component root
