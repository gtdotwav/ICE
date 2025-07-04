"use client"

import { useState } from "react"
import { Users, UserPlus, Crown, Shield, Eye, Mail, MoreHorizontal } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSettings } from "../settings-context"

const teamMembers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@exemplo.com",
    role: "owner",
    avatar: "/placeholder-user.jpg",
    status: "active",
    joinedAt: "2023-01-15",
    lastActive: "2024-01-20T10:30:00Z",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@exemplo.com",
    role: "admin",
    avatar: "/placeholder-user.jpg",
    status: "active",
    joinedAt: "2023-03-20",
    lastActive: "2024-01-19T15:45:00Z",
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@exemplo.com",
    role: "editor",
    avatar: "/placeholder-user.jpg",
    status: "active",
    joinedAt: "2023-06-10",
    lastActive: "2024-01-18T09:15:00Z",
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana@exemplo.com",
    role: "viewer",
    avatar: "/placeholder-user.jpg",
    status: "pending",
    joinedAt: "2024-01-15",
    lastActive: null,
  },
]

const rolePermissions = {
  owner: {
    label: "Proprietário",
    description: "Acesso total, incluindo cobrança e configurações",
    permissions: ["Tudo"],
  },
  admin: {
    label: "Administrador",
    description: "Gerenciar funis, produtos e membros da equipe",
    permissions: ["Criar/editar funis", "Gerenciar produtos", "Convidar membros", "Ver relatórios"],
  },
  editor: {
    label: "Editor",
    description: "Criar e editar funis e produtos",
    permissions: ["Criar/editar funis", "Gerenciar produtos", "Ver relatórios básicos"],
  },
  viewer: {
    label: "Visualizador",
    description: "Apenas visualizar funis e relatórios",
    permissions: ["Ver funis", "Ver relatórios básicos"],
  },
}

export function TeamSettings() {
  const { saveSettings, isLoading } = useSettings()
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("viewer")

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "admin":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "editor":
        return <Users className="h-4 w-4 text-green-500" />
      case "viewer":
        return <Eye className="h-4 w-4 text-gray-500" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary">Ativo</Badge>
      case "pending":
        return <Badge variant="outline">Pendente</Badge>
      case "inactive":
        return <Badge variant="destructive">Inativo</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleInvite = async () => {
    if (!inviteEmail) return

    // Simulate API call
    await saveSettings({
      invite: {
        email: inviteEmail,
        role: inviteRole,
      },
    })

    setInviteEmail("")
    setInviteRole("viewer")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Equipe</h2>
        <p className="text-muted-foreground mt-1">Gerencie membros da equipe e suas permissões</p>
      </div>

      {/* Invite Member */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Convidar Membro
          </CardTitle>
          <CardDescription>Adicione novos membros à sua equipe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="inviteEmail">Email</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="email@exemplo.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="w-48 space-y-2">
              <Label>Função</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(rolePermissions).map(([key, role]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(key)}
                        {role.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleInvite} disabled={!inviteEmail || isLoading}>
                <Mail className="h-4 w-4 mr-2" />
                Enviar Convite
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Membros da Equipe
          </CardTitle>
          <CardDescription>
            {teamMembers.length} membros • {teamMembers.filter((m) => m.status === "active").length} ativos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{member.name}</span>
                    {getStatusBadge(member.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">{member.email}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Entrou em {new Date(member.joinedAt).toLocaleDateString("pt-BR")}</span>
                    {member.lastActive && (
                      <>
                        <span>•</span>
                        <span>Último acesso: {new Date(member.lastActive).toLocaleDateString("pt-BR")}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getRoleIcon(member.role)}
                  <span className="text-sm font-medium">
                    {rolePermissions[member.role as keyof typeof rolePermissions].label}
                  </span>
                </div>

                {member.role !== "owner" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Alterar Função</DropdownMenuItem>
                      <DropdownMenuItem>Reenviar Convite</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remover da Equipe</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Funções e Permissões</CardTitle>
          <CardDescription>Entenda o que cada função pode fazer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(rolePermissions).map(([key, role]) => (
            <div key={key} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                {getRoleIcon(key)}
                <span className="font-medium">{role.label}</span>
              </div>
              <p className="text-sm text-muted-foreground">{role.description}</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
