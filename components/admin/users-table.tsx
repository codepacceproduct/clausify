"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  MoreHorizontal, 
  Search, 
  Shield, 
  ShieldAlert, 
  CreditCard, 
  UserCog, 
  Ban, 
  CheckCircle2,
  Mail,
  Calendar,
  DollarSign,
  History,
  Building2,
  Crown,
  Trash2,
  UserPlus,
  AlertTriangle
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"

import { 
  UserWithDetails, 
  updateUserRole, 
  updateUserPlan, 
  toggleUserBlock, 
  adminUpdateUserProfile 
} from "@/app/actions/users"
import { 
  getOrganizationMembers, 
  addMemberToOrganization, 
  removeMemberFromOrganization, 
  transferOwnership,
  OrganizationMember
} from "@/app/actions/organizations"
import { Plan } from "@/actions/plans"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UsersTableProps {
  users: UserWithDetails[]
  plans: Plan[]
}

export function UsersTable({ users, plans }: UsersTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState("")
  
  // State for modals
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isPlanOpen, setIsPlanOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  
  // Organization Management State
  const [orgMembers, setOrgMembers] = useState<OrganizationMember[]>([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [memberToAction, setMemberToAction] = useState<OrganizationMember | null>(null)
  const [actionType, setActionType] = useState<"remove" | "transfer" | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  // Form states
  const [selectedPlan, setSelectedPlan] = useState("")
  const [editForm, setEditForm] = useState({ name: "", surname: "", email: "" })

  // Reload helper - force full reload as requested
  const handleModalOpenChange = (open: boolean, setOpen: (open: boolean) => void) => {
    setOpen(open)
    if (!open) {
      // Force reload when modal closes
      window.location.reload()
    }
  }

  // Load members when details modal opens or selected user changes
  useEffect(() => {
    if (isDetailsOpen && selectedUser?.organization?.id) {
      loadMembers(selectedUser.organization.id)
    }
  }, [isDetailsOpen, selectedUser])

  const loadMembers = async (orgId: string) => {
    setIsLoadingMembers(true)
    try {
      const members = await getOrganizationMembers(orgId)
      setOrgMembers(members)
    } catch (error) {
      toast.error("Erro ao carregar membros")
    } finally {
      setIsLoadingMembers(false)
    }
  }

  const handleAddMember = async () => {
    if (!selectedUser?.organization?.id || !newMemberEmail) return

    startTransition(async () => {
      const result = await addMemberToOrganization(selectedUser.organization!.id, newMemberEmail)
      if (result.ok) {
        toast.success("Membro adicionado com sucesso")
        setNewMemberEmail("")
        loadMembers(selectedUser.organization!.id)
      } else {
        toast.error(`Erro: ${result.message}`)
      }
    })
  }

  const handleConfirmAction = async () => {
    if (!memberToAction || !actionType || !selectedUser?.organization?.id) return

    startTransition(async () => {
      let result
      if (actionType === "remove") {
        result = await removeMemberFromOrganization(memberToAction.id)
      } else {
        result = await transferOwnership(selectedUser.organization!.id, memberToAction.id)
      }

      if (result.ok) {
        toast.success(actionType === "remove" ? "Membro removido" : "Liderança transferida")
        loadMembers(selectedUser.organization!.id)
        // If we transferred ownership, we might need to update the local selectedUser state too to reflect new owner
        // But for now, a reload on close handles the main state, and loadMembers handles the list.
        // We can manually update selectedUser.organization.owner_id if needed for UI consistency immediately.
        if (actionType === "transfer") {
           setSelectedUser(prev => prev ? ({
             ...prev,
             organization: {
               ...prev.organization!,
               owner_id: memberToAction.id
             }
           }) : null)
        }
      } else {
        toast.error(`Erro: ${result.message}`)
      }
      setIsConfirmOpen(false)
      setMemberToAction(null)
      setActionType(null)
    })
  }

  // Filter users
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRoleToggle = (user: UserWithDetails) => {
    const newRole = user.role === "admin" ? "user" : "admin"
    toast.promise(
      async () => {
        await updateUserRole(user.id, newRole)
        router.refresh()
      },
      {
        loading: "Atualizando permissão...",
        success: `Usuário agora é ${newRole === "admin" ? "Administrador" : "Usuário Comum"}`,
        error: "Erro ao atualizar permissão",
      }
    )
  }

  const handleBlockToggle = (user: UserWithDetails) => {
    const newBlockedStatus = !user.blocked
    toast.promise(
      async () => {
        await toggleUserBlock(user.id, newBlockedStatus)
        router.refresh()
      },
      {
        loading: "Atualizando status...",
        success: `Usuário ${newBlockedStatus ? "bloqueado" : "desbloqueado"} com sucesso`,
        error: "Erro ao atualizar status",
      }
    )
  }

  const handleUpdatePlan = async () => {
    if (!selectedUser || !selectedUser.organization_id) return
    
    startTransition(async () => {
      const result = await updateUserPlan(selectedUser.organization_id, selectedPlan)
      if (result.ok) {
        toast.success("Plano atualizado com sucesso")
        handleModalOpenChange(false, setIsPlanOpen)
      } else {
        toast.error(`Erro: ${result.message}`)
      }
    })
  }

  const handleUpdateProfile = async () => {
    if (!selectedUser) return

    startTransition(async () => {
      const result = await adminUpdateUserProfile({
        userId: selectedUser.id,
        ...editForm
      })
      if (result.ok) {
        toast.success("Perfil atualizado com sucesso")
        handleModalOpenChange(false, setIsEditProfileOpen)
      } else {
        toast.error(`Erro: ${result.message}`)
      }
    })
  }

  const openDetails = (user: UserWithDetails) => {
    setSelectedUser(user)
    handleModalOpenChange(true, setIsDetailsOpen)
  }

  const openPlan = (user: UserWithDetails) => {
    setSelectedUser(user)
    const currentPlan = user.organization?.subscriptions?.[0]?.plan || "free"
    setSelectedPlan(currentPlan)
    handleModalOpenChange(true, setIsPlanOpen)
  }

  const openEditProfile = (user: UserWithDetails) => {
    setSelectedUser(user)
    setEditForm({
      name: user.name || "",
      surname: user.surname || "",
      email: user.email || ""
    })
    handleModalOpenChange(true, setIsEditProfileOpen)
  }

  // Helper for safe avatar initials
  const getInitials = (name?: string, surname?: string, email?: string) => {
    if (name) return name[0].toUpperCase()
    if (email) return email[0].toUpperCase()
    return "?"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Permissão</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const currentPlan = user.organization?.subscriptions?.[0]
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url || ""} />
                          <AvatarFallback>
                            {getInitials(user.name, user.surname, user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {user.name} {user.surname}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.blocked ? (
                        <Badge variant="destructive">Bloqueado</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Ativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {currentPlan?.plan || "Free"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <div className="flex items-center gap-1 text-purple-600 font-medium text-sm">
                          <Shield className="h-3 w-3" />
                          Admin
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-sm">Usuário</div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openDetails(user)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditProfile(user)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Editar Perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openPlan(user)}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Alterar Plano
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleRoleToggle(user)}>
                            {user.role === "admin" ? (
                              <>
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                Remover Admin
                              </>
                            ) : (
                              <>
                                <Shield className="mr-2 h-4 w-4" />
                                Tornar Admin
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleBlockToggle(user)}
                            className={user.blocked ? "text-emerald-600" : "text-destructive"}
                          >
                            {user.blocked ? (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Desbloquear
                              </>
                            ) : (
                              <>
                                <Ban className="mr-2 h-4 w-4" />
                                Bloquear Acesso
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL: User Details */}
      <Dialog open={isDetailsOpen} onOpenChange={(open) => handleModalOpenChange(open, setIsDetailsOpen)}>
        <DialogContent className="w-[98vw] h-[98vh] max-w-none flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle>Detalhes do Usuário</DialogTitle>
            <DialogDescription>
              Visão completa das informações, organização e assinaturas.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Header Info */}
            {selectedUser && (
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedUser.avatar_url || ""} />
                      <AvatarFallback className="text-xl">
                        {getInitials(selectedUser.name, selectedUser.surname, selectedUser.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold">
                        {selectedUser.name} {selectedUser.surname}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {selectedUser.email}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="h-4 w-4" />
                        Cadastrado em {format(new Date(selectedUser.created_at), "PPP", { locale: ptBR })}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={selectedUser.blocked ? "destructive" : "outline"}>
                          {selectedUser.blocked ? "Bloqueado" : "Ativo"}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {selectedUser.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                <Tabs defaultValue="subscriptions" className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
                    <TabsTrigger 
                      value="subscriptions" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
                    >
                      Assinaturas & Organização
                    </TabsTrigger>
                    <TabsTrigger 
                      value="members" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
                    >
                      Membros da Organização
                    </TabsTrigger>
                    <TabsTrigger 
                      value="payments" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
                    >
                      Histórico de Pagamentos
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="subscriptions" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {/* Left: Organization Info */}
                      <div className="md:col-span-1 lg:col-span-1 space-y-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              Organização
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {selectedUser?.organization ? (
                              <div className="space-y-4">
                                <div>
                                  <span className="text-xs text-muted-foreground block">Nome</span>
                                  <span className="font-medium">{selectedUser.organization.name}</span>
                                </div>
                                <div>
                                  <span className="text-xs text-muted-foreground block">Papel</span>
                                  <Badge variant={selectedUser.id === selectedUser.organization.owner_id ? "default" : "secondary"}>
                                    {selectedUser.id === selectedUser.organization.owner_id ? "Owner" : "Member"}
                                  </Badge>
                                </div>
                                <div>
                                  <span className="text-xs text-muted-foreground block">Status</span>
                                  <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                    Vinculado
                                  </div>
                                </div>
                                <div>
                                  <span className="text-xs text-muted-foreground block">Data de entrada</span>
                                  <span className="font-medium text-sm">
                                    {format(new Date(selectedUser.created_at), "dd/MM/yyyy", { locale: ptBR })}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                Sem organização vinculada
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      {/* Right: Subscriptions */}
                      <div className="md:col-span-2 lg:col-span-3 space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Assinaturas Ativas</h4>
                        {selectedUser?.organization?.subscriptions?.length ? (
                          selectedUser.organization.subscriptions.map((sub, idx) => (
                            <Card key={idx}>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base flex justify-between items-center">
                                  <span className="capitalize">{sub.plan}</span>
                                  <Badge variant={sub.status === 'active' || sub.status === 'paid' ? 'default' : 'secondary'}>
                                    {sub.status}
                                  </Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="text-sm space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Valor:</span>
                                  <span>R$ {(sub.amount / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Expira em:</span>
                                  <span>
                                    {sub.current_period_end 
                                      ? format(new Date(sub.current_period_end), "PPP", { locale: ptBR })
                                      : "N/A"}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground border rounded-md">
                            Nenhuma assinatura encontrada.
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="members" className="mt-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Input 
                        placeholder="Adicionar usuário por e-mail..." 
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="max-w-sm"
                      />
                      <Button onClick={handleAddMember} disabled={isPending || !newMemberEmail}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Membro</TableHead>
                            <TableHead>Papel</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLoadingMembers ? (
                            <TableRow>
                              <TableCell colSpan={3} className="h-24 text-center">
                                Carregando membros...
                              </TableCell>
                            </TableRow>
                          ) : orgMembers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="h-24 text-center">
                                Nenhum membro encontrado.
                              </TableCell>
                            </TableRow>
                          ) : (
                            orgMembers.map((member) => (
                              <TableRow key={member.id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage src={member.avatar_url || ""} />
                                      <AvatarFallback>{member.email[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {member.name} {member.surname}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {member.email}
                                      </span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {member.role === 'owner' ? (
                                    <Badge className="bg-amber-500 hover:bg-amber-600">
                                      <Crown className="h-3 w-3 mr-1" />
                                      Owner
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary">Member</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    {member.role !== 'owner' && (
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        title="Transferir Liderança"
                                        onClick={() => {
                                          setMemberToAction(member)
                                          setActionType("transfer")
                                          setIsConfirmOpen(true)
                                        }}
                                      >
                                        <Crown className="h-4 w-4 text-amber-500" />
                                      </Button>
                                    )}
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      title="Remover da Organização"
                                      onClick={() => {
                                        setMemberToAction(member)
                                        setActionType("remove")
                                        setIsConfirmOpen(true)
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="payments" className="mt-4">
                    {selectedUser?.organization?.payments?.length ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Data</TableHead>
                              <TableHead>Valor</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Método</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedUser.organization.payments.map((pay) => (
                              <TableRow key={pay.id}>
                                <TableCell>
                                  {format(new Date(pay.created_at), "dd/MM/yyyy", { locale: ptBR })}
                                </TableCell>
                                <TableCell>R$ {(pay.amount / 100).toFixed(2)}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{pay.status}</Badge>
                                </TableCell>
                                <TableCell className="capitalize">{pay.method}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum pagamento encontrado.
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: Edit Plan */}
      <Dialog open={isPlanOpen} onOpenChange={(open) => handleModalOpenChange(open, setIsPlanOpen)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Plano</DialogTitle>
            <DialogDescription>
              Selecione o novo plano para o usuário {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Plano Disponível</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.slug}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleModalOpenChange(false, setIsPlanOpen)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdatePlan} disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Edit Profile */}
      <Dialog open={isEditProfileOpen} onOpenChange={(open) => handleModalOpenChange(open, setIsEditProfileOpen)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Atualize as informações básicas do usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input 
                  value={editForm.name} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Sobrenome</Label>
                <Input 
                  value={editForm.surname} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, surname: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                value={editForm.email} 
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleModalOpenChange(false, setIsEditProfileOpen)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateProfile} disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ALERT DIALOG: Confirmation */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirmação Necessária
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "remove" 
                ? `Tem certeza que deseja remover ${memberToAction?.name || memberToAction?.email} da organização?`
                : `Tem certeza que deseja transferir a liderança da organização para ${memberToAction?.name || memberToAction?.email}? Esta ação é irreversível pelo painel de membro.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction} className={actionType === "remove" ? "bg-destructive hover:bg-destructive/90" : "bg-emerald-600 hover:bg-emerald-700"}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
