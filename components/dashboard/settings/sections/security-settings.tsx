"use client"

import { useState } from "react"
import { Shield, Smartphone, Key, Monitor, MapPin, AlertTriangle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSettings } from "../settings-context"

const activeSessions = [
  {
    id: 1,
    device: "MacBook Pro",
    browser: "Chrome 120.0",
    location: "São Paulo, Brasil",
    ip: "192.168.1.100",
    lastActive: "Agora",
    isCurrent: true,
  },
  {
    id: 2,
    device: "iPhone 15",
    browser: "Safari Mobile",
    location: "São Paulo, Brasil",
    ip: "192.168.1.101",
    lastActive: "2 horas atrás",
    isCurrent: false,
  },
  {
    id: 3,
    device: "Windows PC",
    browser: "Edge 119.0",
    location: "Rio de Janeiro, Brasil",
    ip: "201.23.45.67",
    lastActive: "1 dia atrás",
    isCurrent: false,
  },
]

const loginAttempts = [
  {
    id: 1,
    status: "success",
    location: "São Paulo, Brasil",
    ip: "192.168.1.100",
    device: "MacBook Pro",
    timestamp: "2024-01-20T10:30:00Z",
  },
  {
    id: 2,
    status: "failed",
    location: "Unknown",
    ip: "45.123.67.89",
    device: "Unknown",
    timestamp: "2024-01-19T22:15:00Z",
  },
  {
    id: 3,
    status: "success",
    location: "São Paulo, Brasil",
    ip: "192.168.1.101",
    device: "iPhone 15",
    timestamp: "2024-01-19T08:45:00Z",
  },
]

export function SecuritySettings() {
  const { saveSettings, isLoading } = useSettings()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordSubmit = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      return
    }
    await saveSettings({ password: passwordForm })
    setPasswordForm({ current: "", new: "", confirm: "" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Segurança</h2>
        <p className="text-muted-foreground mt-1">Proteja sua conta com configurações de segurança avançadas</p>
      </div>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Alterar Senha
          </CardTitle>
          <CardDescription>Mantenha sua conta segura com uma senha forte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordForm.current}
              onChange={(e) => handlePasswordChange("current", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordForm.new}
              onChange={(e) => handlePasswordChange("new", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 8 caracteres, incluindo maiúsculas, minúsculas e números
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordForm.confirm}
              onChange={(e) => handlePasswordChange("confirm", e.target.value)}
            />
          </div>

          <Button onClick={handlePasswordSubmit} disabled={isLoading}>
            Alterar Senha
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Autenticação de Dois Fatores (2FA)
          </CardTitle>
          <CardDescription>Adicione uma camada extra de segurança à sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Status do 2FA</div>
              <div className="text-sm text-muted-foreground">
                {twoFactorEnabled ? "Ativado e funcionando" : "Desativado - sua conta está em risco"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={twoFactorEnabled ? "secondary" : "destructive"}>
                {twoFactorEnabled ? "Ativo" : "Inativo"}
              </Badge>
              <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
            </div>
          </div>

          {twoFactorEnabled && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                2FA está ativo usando o aplicativo Google Authenticator.
                <Button variant="link" className="p-0 h-auto ml-1">
                  Ver códigos de backup
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button variant={twoFactorEnabled ? "outline" : "default"}>
              {twoFactorEnabled ? "Reconfigurar" : "Ativar"} 2FA
            </Button>
            {twoFactorEnabled && <Button variant="outline">Códigos de Backup</Button>}
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Segurança</CardTitle>
          <CardDescription>Configure quando você quer ser notificado sobre atividades suspeitas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Alertas por Email</div>
              <div className="text-sm text-muted-foreground">
                Receba emails sobre logins suspeitos e alterações de segurança
              </div>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Sessões Ativas
          </CardTitle>
          <CardDescription>Gerencie onde você está logado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{session.device}</span>
                  {session.isCurrent && <Badge variant="secondary">Sessão Atual</Badge>}
                </div>
                <div className="text-sm text-muted-foreground">
                  {session.browser} • {session.ip}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {session.location} • {session.lastActive}
                </div>
              </div>
              {!session.isCurrent && (
                <Button variant="outline" size="sm">
                  Revogar
                </Button>
              )}
            </div>
          ))}

          <Button variant="outline" className="w-full bg-transparent">
            Revogar Todas as Outras Sessões
          </Button>
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Acessos</CardTitle>
          <CardDescription>Últimas tentativas de login na sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loginAttempts.map((attempt) => (
            <div key={attempt.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${attempt.status === "success" ? "bg-green-500" : "bg-red-500"}`}
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {attempt.status === "success" ? "Login realizado" : "Tentativa falhada"}
                    </span>
                    {attempt.status === "failed" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {attempt.device} • {attempt.ip} • {attempt.location}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(attempt.timestamp).toLocaleString("pt-BR")}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full bg-transparent">
            Ver Histórico Completo
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
