"use client"

import { useState } from "react"
import { Camera, Globe, Clock, DollarSign } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSettings } from "../settings-context"

export function ProfileSettings() {
  const { saveSettings, isLoading, setUnsavedChanges } = useSettings()
  const [formData, setFormData] = useState({
    firstName: "João",
    lastName: "Silva",
    email: "joao@exemplo.com",
    phone: "+55 11 99999-9999",
    company: "Minha Empresa",
    position: "CEO",
    bio: "Empreendedor apaixonado por tecnologia e inovação.",
    website: "https://minhaempresa.com",
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
    currency: "BRL",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setUnsavedChanges(true)
  }

  const handleSave = async () => {
    await saveSettings(formData)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Perfil & Conta</h2>
        <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais e preferências da conta</p>
      </div>

      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Foto do Perfil</CardTitle>
          <CardDescription>Sua foto será exibida em todo o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="text-lg">
                {formData.firstName[0]}
                {formData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Alterar Foto
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Máximo 2MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Seus dados básicos e informações de contato</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Este email será usado para login e notificações importantes</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Profissionais</CardTitle>
          <CardDescription>Detalhes sobre sua empresa e função</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Cargo</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                className="pl-10"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://exemplo.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Conte um pouco sobre você..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">Máximo 160 caracteres</p>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
          <CardDescription>Configure como você quer usar o sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fuso Horário</Label>
              <Select value={formData.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
                <SelectTrigger>
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                  <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tóquio (GMT+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                <SelectTrigger>
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Moeda</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                <SelectTrigger>
                  <DollarSign className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (R$)</SelectItem>
                  <SelectItem value="USD">Dólar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Formato de Data</Label>
              <Select value={formData.dateFormat} onValueChange={(value) => handleInputChange("dateFormat", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/AAAA</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/AAAA</SelectItem>
                  <SelectItem value="YYYY-MM-DD">AAAA-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Formato de Hora</Label>
              <Select value={formData.timeFormat} onValueChange={(value) => handleInputChange("timeFormat", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 horas</SelectItem>
                  <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  )
}
