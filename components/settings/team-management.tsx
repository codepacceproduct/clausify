"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Loader2, Plus, Mail, Trash2, Edit, Link as LinkIcon, Copy, Check } from "lucide-react"
import { getAuthToken } from "@/lib/auth"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Member {
  email: string
  name: string | null
  surname: string | null
  role: "admin" | "moderator" | "member"
  status: string
  invited_at: string | null
  joined_at: string | null
  avatar_url?: string | null
}

const roleMap = {
  admin: "Administrador",
  moderator: "Moderador",
  member: "Membro",
}

export function TeamManagement() {
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<Member[]>([])
  
  // Invite Dialog
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"admin" | "moderator" | "member">("member")
  const [inviting, setInviting] = useState(false)

  // Invite Link
  const [linkOpen, setLinkOpen] = useState(false)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [linkLoading, setLinkLoading] = useState(false)
  const [linkName, setLinkName] = useState("")
  
  // Edit Role
  const [editOpen, setEditOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [newRole, setNewRole] = useState<"admin" | "moderator" | "member">("member")

  useEffect(() => {
    loadMembers()
  }, [])

  async function loadMembers() {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      
      const res = await fetch("/api/organizations/members", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      
      if (res.status === 404 || res.status === 401) {
        // Usuário não tem organização ou não encontrada
        setMembers([])
        return
      }
      
      if (!res.ok) throw new Error("Failed to load members")
      const data = await res.json()
      setMembers(data.members || [])
    } catch (error) {
      console.error(error)
      // toast.error("Erro ao carregar membros") // Silently fail or show milder warning
    } finally {
      setLoading(false)
    }
  }

  async function handleInvite() {
    if (!inviteEmail) return
    setInviting(true)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      // Assuming direct add or invite
      const res = await fetch("/api/organizations/members", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole, password: "tempPassword123!" }), // Simplification for demo if API requires password
      })
      
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to invite")
      }

      toast.success("Convite enviado com sucesso")
      setInviteOpen(false)
      setInviteEmail("")
      loadMembers()
    } catch (error: any) {
      toast.error(error.message || "Erro ao convidar membro")
    } finally {
      setInviting(false)
    }
  }

  async function handleGenerateLink() {
     if (!linkName) {
         toast.error("Digite um nome para referência")
         return
     }
     setLinkLoading(true)
     try {
         const res = await fetch("/api/teams/invite", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
                 name: linkName,
                 surname: "Convidado", // Default
                 email: `guest_${Date.now()}@temp.com`, // Dummy for link gen if required
                 valid_from: new Date().toISOString(),
                 valid_to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
             })
         })
         const data = await res.json()
         if (data.link) {
             setGeneratedLink(data.link)
         } else {
             throw new Error("No link returned")
         }
     } catch (error) {
         toast.error("Erro ao gerar link")
     } finally {
         setLinkLoading(false)
     }
  }

  async function handleUpdateRole() {
      if (!editingMember) return
      try {
          const res = await fetch("/api/organizations/members", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: editingMember.email, role: newRole })
          })
          if (!res.ok) throw new Error("Failed to update")
          
          toast.success("Função atualizada")
          setEditOpen(false)
          loadMembers()
      } catch (error) {
          toast.error("Erro ao atualizar função")
      }
  }

  async function handleRemoveMember(email: string) {
      if (!confirm("Tem certeza que deseja remover este membro?")) return
      try {
           const res = await fetch("/api/organizations/members", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email })
          })
          if (!res.ok) throw new Error("Failed to remove")
          toast.success("Membro removido")
          loadMembers()
      } catch (error) {
          toast.error("Erro ao remover membro")
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
      <div className="flex items-center justify-between">
        <div>
            <h3 className="text-lg font-medium">Equipe</h3>
            <p className="text-sm text-muted-foreground">
            Gerencie quem tem acesso à sua organização.
            </p>
        </div>
        <div className="flex gap-2">
            <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Gerar Link
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Gerar Link de Convite</DialogTitle>
                        <DialogDescription>Crie um link temporário para convidar pessoas externas.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Nome de Referência</Label>
                            <Input value={linkName} onChange={e => setLinkName(e.target.value)} placeholder="Ex: Consultor Externo" />
                        </div>
                        {generatedLink && (
                            <div className="flex items-center gap-2 p-2 bg-muted rounded border">
                                <code className="flex-1 text-xs truncate">{generatedLink}</code>
                                <Button size="icon" variant="ghost" onClick={() => {
                                    navigator.clipboard.writeText(generatedLink)
                                    toast.success("Copiado!")
                                }}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        {!generatedLink && (
                            <Button onClick={handleGenerateLink} disabled={linkLoading}>
                                {linkLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Gerar Link
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Convidar Membro
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Convidar Membro</DialogTitle>
                        <DialogDescription>Envie um convite por e-mail para um novo membro.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>E-mail</Label>
                            <Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="email@empresa.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>Função</Label>
                            <Select value={inviteRole} onValueChange={(v: any) => setInviteRole(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="member">Membro</SelectItem>
                                    <SelectItem value="moderator">Moderador</SelectItem>
                                    <SelectItem value="admin">Administrador</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleInvite} disabled={inviting}>
                            {inviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enviar Convite
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Membro</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Entrou em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.map((member) => (
                        <TableRow key={member.email}>
                            <TableCell className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={member.avatar_url || undefined} />
                                    <AvatarFallback>{member.email[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium">{member.name ? `${member.name} ${member.surname || ""}` : member.email}</span>
                                    <span className="text-xs text-muted-foreground">{member.email}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{roleMap[member.role]}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={member.status === "active" ? "default" : "secondary"}>
                                    {member.status === "active" ? "Ativo" : "Pendente"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">
                                    {member.joined_at ? formatDistanceToNow(new Date(member.joined_at), { addSuffix: true, locale: ptBR }) : "-"}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => {
                                        setEditingMember(member)
                                        setNewRole(member.role)
                                        setEditOpen(true)
                                    }}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemoveMember(member.email)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Editar Permissões</DialogTitle>
            </DialogHeader>
            <div className="py-4">
                <Label>Função</Label>
                <Select value={newRole} onValueChange={(v: any) => setNewRole(v)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="member">Membro</SelectItem>
                        <SelectItem value="moderator">Moderador</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button onClick={handleUpdateRole}>Salvar</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
