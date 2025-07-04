"use client"

import { useState } from "react"
import { Bell, Mail, Smartphone, MessageSquare, Zap } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useSettings } from "../settings-context"

interface NotificationSettings {
  email: {
    marketing: boolean
    transactional: boolean
    security: boolean
    reports: boolean
    frequency: string
  }
  push: {
    browser: boolean
    mobile: boolean
    desktop: boolean
  }
  inApp: {
    conversions: boolean
    comments: boolean
    mentions: boolean
    updates: boolean
  }
  sms: {
    security: boolean
    critical: boolean
    marketing: boolean
  }
}

export function NotificationSettings() {
  const { saveSettings, isLoading } = useSettings()
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      marketing: true,
      transactional: true,
      security: true,
      reports: false,
      frequency: "daily",
    },
    push: {
      browser: true,
      mobile: true,
      desktop: false,
    },
    inApp: {
      conversions: true,
      comments: true,
      mentions: true,
      updates: false,
    },
    sms: {
      security: true,
      critical: true,
      marketing: false,
    },
  })

  const updateSetting = (category: keyof NotificationSettings, key: string, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  const handleSave = async () => {
    await saveSettings({ notifications: settings })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Notificações</h2>
        <p className="text-muted-foreground mt-1">Configure como e quando você quer receber notificações</p>
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notificações por Email
          </CardTitle>
          <CardDescription>Controle quais emails você recebe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Emails Transacionais</Label>
                <p className="text-sm text-muted-foreground">Confirmações, recibos e atualizações importantes</p>
              </div>
              <Switch
                checked={settings.email.transactional}
                onCheckedChange={(checked) => updateSetting("email", "transactional", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Alertas de Segurança</Label>
                <p className="text-sm text-muted-foreground">Logins suspeitos e alterações de segurança</p>
              </div>
              <Switch
                checked={settings.email.security}
                onCheckedChange={(checked) => updateSetting("email", "security", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Relatórios e Resumos</Label>
                <p className="text-sm text-muted-foreground">Relatórios semanais de performance e estatísticas</p>
              </div>
              <Switch
                checked={settings.email.reports}
                onCheckedChange={(checked) => updateSetting("email", "reports", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Marketing e Novidades</Label>
                <p className="text-sm text-muted-foreground">Dicas, novos recursos e conteúdo educativo</p>
              </div>
              <Switch
                checked={settings.email.marketing}
                onCheckedChange={(checked) => updateSetting("email", "marketing", checked)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Frequência dos Resumos</Label>
            <Select
              value={settings.email.frequency}
              onValueChange={(value) => updateSetting("email", "frequency", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Tempo Real</SelectItem>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Notificações Push
          </CardTitle>
          <CardDescription>Receba alertas instantâneos nos seus dispositivos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Navegador</Label>
              <p className="text-sm text-muted-foreground">Notificações no navegador web</p>
            </div>
            <Switch
              checked={settings.push.browser}
              onCheckedChange={(checked) => updateSetting("push", "browser", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Aplicativo Mobile</Label>
              <p className="text-sm text-muted-foreground">Notificações no app do celular</p>
            </div>
            <Switch
              checked={settings.push.mobile}
              onCheckedChange={(checked) => updateSetting("push", "mobile", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Desktop</Label>
              <p className="text-sm text-muted-foreground">Notificações no sistema operacional</p>
            </div>
            <Switch
              checked={settings.push.desktop}
              onCheckedChange={(checked) => updateSetting("push", "desktop", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações no Sistema
          </CardTitle>
          <CardDescription>Alertas que aparecem dentro da plataforma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Conversões de Funil</Label>
              <p className="text-sm text-muted-foreground">Quando alguém converte em seus funis</p>
            </div>
            <Switch
              checked={settings.inApp.conversions}
              onCheckedChange={(checked) => updateSetting("inApp", "conversions", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Comentários e Avaliações</Label>
              <p className="text-sm text-muted-foreground">Feedback em produtos e funis</p>
            </div>
            <Switch
              checked={settings.inApp.comments}
              onCheckedChange={(checked) => updateSetting("inApp", "comments", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Menções da Equipe</Label>
              <p className="text-sm text-muted-foreground">Quando alguém te menciona em comentários</p>
            </div>
            <Switch
              checked={settings.inApp.mentions}
              onCheckedChange={(checked) => updateSetting("inApp", "mentions", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Atualizações do Sistema</Label>
              <p className="text-sm text-muted-foreground">Novos recursos e manutenções</p>
            </div>
            <Switch
              checked={settings.inApp.updates}
              onCheckedChange={(checked) => updateSetting("inApp", "updates", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Notificações por SMS
          </CardTitle>
          <CardDescription>Alertas importantes via mensagem de texto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Alertas de Segurança</Label>
              <p className="text-sm text-muted-foreground">Logins suspeitos e alterações críticas</p>
            </div>
            <Switch
              checked={settings.sms.security}
              onCheckedChange={(checked) => updateSetting("sms", "security", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Alertas Críticos</Label>
              <p className="text-sm text-muted-foreground">Problemas que requerem ação imediata</p>
            </div>
            <Switch
              checked={settings.sms.critical}
              onCheckedChange={(checked) => updateSetting("sms", "critical", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Promoções</Label>
              <p className="text-sm text-muted-foreground">Ofertas especiais e campanhas</p>
            </div>
            <Switch
              checked={settings.sms.marketing}
              onCheckedChange={(checked) => updateSetting("sms", "marketing", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>Configure todas as notificações de uma vez</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Ativar Todas
            </Button>
            <Button variant="outline" size="sm">
              Desativar Todas
            </Button>
            <Button variant="outline" size="sm">
              Apenas Essenciais
            </Button>
            <Button variant="outline" size="sm">
              Configuração Padrão
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Preferências"}
        </Button>
      </div>
    </div>
  )
}
