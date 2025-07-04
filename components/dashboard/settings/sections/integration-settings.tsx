"use client"

import { useState } from "react"
import { Plug, Key, Webhook, ExternalLink, Copy, Eye, EyeOff, Plus } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useSettings } from "../settings-context"
import { toast } from "@/hooks/use-toast"

const apiKeys = [
  {
    id: 1,
    name: "Produção",
    key: "sk_live_51234567890abcdef",
    created: "2024-01-15",
    lastUsed: "2024-01-20",
    isActive: true,
  },
  {
    id: 2,
    name: "Desenvolvimento",
    key: "sk_test_51234567890abcdef",
    created: "2024-01-10",
    lastUsed: "2024-01-19",
    isActive: true,
  },
]

const webhooks = [
  {
    id: 1,
    name: "Conversões de Funil",
    url: "https://api.exemplo.com/webhooks/conversions",
    events: ["funnel.conversion", "funnel.abandoned"],
    isActive: true,
    lastTriggered: "2024-01-20T10:30:00Z",
  },
  {
    id: 2,
    name: "Vendas de Produtos",
    url: "https://api.exemplo.com/webhooks/sales",
    events: ["product.sold", "payment.completed"],
    isActive: false,
    lastTriggered: "2024-01-18T15:45:00Z",
  },
]

const integrations = [
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Rastreie visitantes e conversões",
    icon: "📊",
    isConnected: true,
    configUrl: "/integrations/google-analytics",
  },
  {
    id: "facebook-pixel",
    name: "Facebook Pixel",
    description: "Otimize campanhas do Facebook",
    icon: "📘",
    isConnected: true,
    configUrl: "/integrations/facebook-pixel",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Sincronize leads com email marketing",
    icon: "🐵",
    isConnected: false,
    configUrl: "/integrations/mailchimp",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Processe pagamentos online",
    icon: "💳",
    isConnected: true,
    configUrl: "/integrations/stripe",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Conecte com 5000+ aplicativos",
    icon: "⚡",
    isConnected: false,
    configUrl: "/integrations/zapier",
  },
  {
    id: "hubspot",
    name: "HubSpot CRM",
    description: "Gerencie leads e contatos",
    icon: "🎯",
    isConnected: false,
    configUrl: "/integrations/hubspot",
  },
]

export function IntegrationSettings() {
  const { saveSettings, isLoading } = useSettings()
  const [showApiKeys, setShowApiKeys] = useState<{ [key: number]: boolean }>({})
  const [newWebhookUrl, setNewWebhookUrl] = useState("")

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: "Chave API copiada para a área de transferência",
    })
  }

  const toggleApiKeyVisibility = (keyId: number) => {
    setShowApiKeys((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }))
  }

  const maskApiKey = (key: string) => {
    return key.substring(0, 12) + "..." + key.substring(key.length - 4)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Integrações</h2>
        <p className="text-muted-foreground mt-1">Conecte o IceFunnel com suas ferramentas favoritas</p>
      </div>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Chaves de API
          </CardTitle>
          <CardDescription>Gerencie suas chaves de API para integração com sistemas externos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{apiKey.name}</span>
                  <Badge variant={apiKey.isActive ? "secondary" : "outline"}>
                    {apiKey.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 font-mono text-sm">
                  <span>{showApiKeys[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => toggleApiKeyVisibility(apiKey.id)}
                  >
                    {showApiKeys[apiKey.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(apiKey.key)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Criada em {new Date(apiKey.created).toLocaleDateString("pt-BR")} • Último uso:{" "}
                  {new Date(apiKey.lastUsed).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Regenerar
                </Button>
                <Button variant="outline" size="sm">
                  Revogar
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Gerar Nova Chave
          </Button>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Webhooks
          </CardTitle>
          <CardDescription>Configure webhooks para receber notificações em tempo real</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{webhook.name}</span>
                    <Badge variant={webhook.isActive ? "secondary" : "outline"}>
                      {webhook.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">{webhook.url}</div>
                </div>
                <Switch checked={webhook.isActive} onCheckedChange={() => {}} />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Eventos:</div>
                <div className="flex flex-wrap gap-2">
                  {webhook.events.map((event) => (
                    <Badge key={event} variant="outline" className="text-xs">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Último disparo: {new Date(webhook.lastTriggered).toLocaleString("pt-BR")}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Testar
                </Button>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
                <Button variant="outline" size="sm">
                  Logs
                </Button>
              </div>
            </div>
          ))}

          <div className="space-y-3 p-4 border-2 border-dashed rounded-lg">
            <div className="font-medium">Adicionar Novo Webhook</div>
            <div className="flex gap-2">
              <Input
                placeholder="https://api.exemplo.com/webhook"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
              />
              <Button>Adicionar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Third-party Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5" />
            Integrações Disponíveis
          </CardTitle>
          <CardDescription>Conecte-se com ferramentas populares para expandir suas funcionalidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{integration.name}</div>
                    <div className="text-sm text-muted-foreground">{integration.description}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant={integration.isConnected ? "secondary" : "outline"}>
                    {integration.isConnected ? "Conectado" : "Disponível"}
                  </Badge>
                  <Button variant={integration.isConnected ? "outline" : "default"} size="sm">
                    {integration.isConnected ? "Configurar" : "Conectar"}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Documentação da API</CardTitle>
          <CardDescription>Recursos para desenvolvedores</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <div className="font-medium">Referência da API</div>
                <div className="text-sm text-muted-foreground">Documentação completa dos endpoints</div>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <div className="font-medium">SDKs e Bibliotecas</div>
                <div className="text-sm text-muted-foreground">Código pronto para diferentes linguagens</div>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <div className="font-medium">Exemplos de Código</div>
                <div className="text-sm text-muted-foreground">Implementações práticas e casos de uso</div>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <div className="font-medium">Webhooks Guide</div>
                <div className="text-sm text-muted-foreground">Como configurar e usar webhooks</div>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
