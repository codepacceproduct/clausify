import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, Edit, Trash2, Mail, Clock } from "lucide-react"

const users = [
  {
    id: 1,
    name: "Dr. Ricardo Silva",
    email: "ricardo@empresa.com",
    role: "admin" as const,
    lastAccess: "Há 5 minutos",
    status: "active" as const,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Ana Paula Mendes",
    email: "ana.mendes@empresa.com",
    role: "editor" as const,
    lastAccess: "Há 2 horas",
    status: "active" as const,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Carlos Alberto",
    email: "carlos.alberto@empresa.com",
    role: "editor" as const,
    lastAccess: "Há 4 horas",
    status: "active" as const,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Julia Santos",
    email: "julia.santos@empresa.com",
    role: "viewer" as const,
    lastAccess: "Há 1 dia",
    status: "active" as const,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Marcos Oliveira",
    email: "marcos.oliveira@empresa.com",
    role: "editor" as const,
    lastAccess: "Há 3 dias",
    status: "inactive" as const,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const rolePermissions = {
  admin: ["Gerenciar usuários", "Editar contratos", "Excluir contratos", "Ver relatórios", "Configurar sistema"],
  editor: ["Editar contratos", "Fazer upload", "Ver relatórios", "Comparar versões"],
  viewer: ["Visualizar contratos", "Ver relatórios"],
}

export function AccessControl() {
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
            <Button>Adicionar Usuário</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.name}</p>
                      <Badge
                        variant={user.role === "admin" ? "default" : "secondary"}
                        className={
                          user.role === "admin"
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : user.role === "editor"
                              ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {user.role === "admin" ? "Administrador" : user.role === "editor" ? "Editor" : "Visualizador"}
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
                        {user.lastAccess}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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
    </div>
  )
}
