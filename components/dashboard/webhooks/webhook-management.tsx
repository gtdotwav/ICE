"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Webhook, Plus, Settings, Activity, AlertCircle, CheckCircle, Copy, TestTube } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface WebhookConfig {
  id: string
  name: string
  url: string
  events: string[]
  isActive: boolean
  secret: string
  stats: {
    totalDeliveries: number
    successRate: number
    lastDelivery?: string
  }
}

const fetcher = (u: string) => fetch(u).then((r) => r.json())

export function WebhookManagement() {
  const { data, mutate } = useSWR("/api/webhooks?type=out", fetcher)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Normalize to ensure stats exists even if API changes
  const items: WebhookConfig[] = (data?.items || []).map((w: any) => ({
    ...w,
    stats: w.stats ?? {
      totalDeliveries: typeof w.deliveries === "number" ? w.deliveries : 0,
      successRate: typeof w.successRate === "number" ? w.successRate : 1,
      lastDelivery: w.lastDelivery,
    },
  }))

const availableEvents = [
  { value: 'form.submitted', label: 'Formulário Submetido' },
  { value: 'funnel.conversion', label: 'Conversão no Funil' },
  { value: 'user.registered', label: 'Usuário Registrado' },
  { value: 'payment.completed', label: 'Pagamento Completado' },
  { value: 'lead.qualified', label: 'Lead Qualificado' },
  { value: 'automation.triggered', label: 'Automação Acionada' },
  { value: 'campaign.started', label: 'Campanha Iniciada' },
  { value: 'email.opened', label: 'Email Aberto' },
  { value: 'email.clicked', label: 'Email Clicado' }
]

useEffect(() => {
  setIsLoading(false)
}, [])

const createWebhook = async (webhookData: any) => {
  try {
    const response = await fetch('/api/webhooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookData),
    })

    if (!response.ok) {
      throw new Error('Erro ao criar webhook')
    }

    // Revalidate list from the server
    await mutate()

    setIsCreateDialogOpen(false)
    toast({
      title: "Sucesso",
      description: "Webhook criado com sucesso!"
    })
  } catch (error) {
    toast({
      title: "Erro",
      description: "Erro ao criar webhook",
      variant: "destructive"
    })
  }
}

const testWebhook = async (webhookId: string) => {
  try {
    const response = await fetch('/api/webhooks/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookId })
    })
    
    if (response.ok) {
      toast({
        title: "Sucesso",
        description: "Webhook de teste enviado com sucesso!"
      })
      // Revalidate list to pick up new totals/success rate
      await mutate()
    } else {
      const err = await response.json().catch(() => ({}))
      toast({
        title: "Erro",
        description: err?.error || "Erro ao enviar webhook de teste",
        variant: "destructive"
      })
    }
  } catch (error) {
    toast({
      title: "Erro",
      description: "Erro ao testar webhook",
      variant: "destructive"
    })
  }
}

const toggleWebhook = async (webhookId: string, isActive: boolean) => {
  mutate(data.items.map(wh => 
    wh.id === webhookId ? { ...wh, isActive } : wh
  ))
  
  toast({
    title: "Sucesso",
    description: `Webhook ${isActive ? 'ativado' : 'desativado'} com sucesso!`
  })
}

const copySecret = (secret: string) => {
  navigator.clipboard.writeText(secret)
  toast({
    title: "Sucesso",
    description: "Secret copiado para a área de transferência!"
  })
}

return (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Gerenciamento de Webhooks</h2>
        <p className="text-muted-foreground">Configure webhooks para integrar com sistemas externos</p>
      </div>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Webhook
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Novo Webhook</DialogTitle>
            <DialogDescription>
              Configure um novo webhook para receber eventos do IceFunnel
            </DialogDescription>
          </DialogHeader>
          <WebhookCreateForm 
            availableEvents={availableEvents}
            onSubmit={createWebhook}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>

    <Tabs defaultValue="outgoing" className="space-y-6">
      <TabsList className="glass-card">
        <TabsTrigger value="outgoing">Webhooks de Saída</TabsTrigger>
        <TabsTrigger value="incoming">Webhooks de Entrada</TabsTrigger>
        <TabsTrigger value="logs">Logs e Monitoramento</TabsTrigger>
      </TabsList>

      <TabsContent value="outgoing" className="space-y-4">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map(i => (
              <Card key={i} className="glass-card animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-4" />
                  <div className="h-3 bg-white/10 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((w) => (
              <Card key={w.id} className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Webhook className="h-5 w-5" />
                      {w.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={w.isActive ? "secondary" : "outline"}>
                        {w.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                      <Switch
                        checked={w.isActive}
                        onCheckedChange={(checked) => toggleWebhook(w.id, checked)}
                      />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {w.events.map(event => (
                      <Badge key={event} variant="outline" className="text-xs">
                        {availableEvents.find(e => e.value === event)?.label || event}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Entregas</div>
                      <div className="font-semibold">{w.stats.totalDeliveries}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Taxa de Sucesso</div>
                      <div className="font-semibold text-green-400">
                        {Math.round((w.stats.successRate ?? 0) * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => testWebhook(w.id)}
                      className="flex-1"
                    >
                      <TestTube className="h-3 w-3 mr-1" />
                      Testar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copySecret(w.secret)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedWebhook(w)}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="incoming" className="space-y-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Webhooks de Entrada</CardTitle>
            <CardDescription>
              Configure endpoints para receber webhooks de sistemas externos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/20">
                <h4 className="font-medium mb-2">Endpoint Base</h4>
                <code className="text-sm bg-background/50 p-2 rounded block">
                  https://app.icefunnel.com/api/webhooks/incoming/[endpoint]
                </code>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Para configurar um webhook de entrada:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Crie um endpoint personalizado</li>
                  <li>Configure o secret para validação</li>
                  <li>Mapeie eventos externos para eventos internos</li>
                  <li>Teste a integração</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="logs" className="space-y-4">
        <WebhookLogs />
      </TabsContent>
    </Tabs>
  </div>
)
}

function WebhookCreateForm({ 
availableEvents, 
onSubmit, 
onCancel 
}: {
availableEvents: Array<{ value: string; label: string }>
onSubmit: (data: any) => void
onCancel: () => void
}) {
const [formData, setFormData] = useState({
  name: '',
  url: '',
  events: [] as string[],
  maxAttempts: 3,
  initialDelay: 5,
  headers: ''
})
const { toast } = useToast()

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  
  let headers = {}
  if (formData.headers) {
    try {
      headers = JSON.parse(formData.headers)
    } catch {
      toast({
        title: "Erro",
        description: "Headers devem estar em formato JSON válido",
        variant: "destructive"
      })
      return
    }
  }

  onSubmit({
    ...formData,
    headers
  })
}

return (
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Webhook</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Ex: Zapier Integration"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="url">URL de Destino</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://hooks.zapier.com/..."
          required
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label>Eventos</Label>
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded">
        {availableEvents.map(event => (
          <label key={event.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.events.includes(event.value)}
              onChange={(e) => {
                if (e.target.checked) {
                  setFormData(prev => ({ 
                    ...prev, 
                    events: [...prev.events, event.value] 
                  }))
                } else {
                  setFormData(prev => ({ 
                    ...prev, 
                    events: prev.events.filter(ev => ev !== event.value) 
                  }))
                }
              }}
              className="rounded"
            />
            <span className="text-sm">{event.label}</span>
          </label>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="maxAttempts">Máximo de Tentativas</Label>
        <Select 
          value={formData.maxAttempts.toString()} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, maxAttempts: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 tentativa</SelectItem>
            <SelectItem value="3">3 tentativas</SelectItem>
            <SelectItem value="5">5 tentativas</SelectItem>
            <SelectItem value="10">10 tentativas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="initialDelay">Delay Inicial (segundos)</Label>
        <Input
          id="initialDelay"
          type="number"
          value={formData.initialDelay}
          onChange={(e) => setFormData(prev => ({ ...prev, initialDelay: parseInt(e.target.value) }))}
          min="1"
          max="300"
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="headers">Headers Customizados (JSON)</Label>
      <Textarea
        id="headers"
        value={formData.headers}
        onChange={(e) => setFormData(prev => ({ ...prev, headers: e.target.value }))}
        placeholder='{"Authorization": "Bearer token", "X-Custom-Header": "value"}'
        rows={3}
      />
    </div>

    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" disabled={!formData.name || !formData.url || formData.events.length === 0}>
        Criar Webhook
      </Button>
    </div>
  </form>
)
}

function WebhookLogs() {
const [logs] = useState([
  {
    id: '1',
    webhook: 'Zapier Integration',
    event: 'form.submitted',
    status: 'success',
    timestamp: '2024-01-20T10:30:00Z',
    duration: 245,
    response: '200 OK'
  },
  {
    id: '2',
    webhook: 'CRM Sync',
    event: 'lead.qualified',
    status: 'error',
    timestamp: '2024-01-20T10:25:00Z',
    duration: 5000,
    response: '500 Internal Server Error'
  }
])

return (
  <Card className="glass-card">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        Logs de Webhook
      </CardTitle>
      <CardDescription>
        Histórico de entregas e erros dos webhooks
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {logs.map(log => (
          <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {log.status === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <div>
                <div className="font-medium text-sm">{log.webhook}</div>
                <div className="text-xs text-muted-foreground">{log.event}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm">{log.response}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(log.timestamp).toLocaleString('pt-BR')} • {log.duration}ms
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)
}
