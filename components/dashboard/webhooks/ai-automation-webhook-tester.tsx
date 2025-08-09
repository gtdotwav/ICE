"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, ImageIcon, Video, Mail, Send, CheckCircle, XCircle, Clock, Loader2, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TestResult {
  success: boolean
  request_id?: string
  automation_type?: string
  message?: string
  error?: string
  timestamp: string
  processing_time?: string
}

interface WebhookLog {
  id: string
  type: "request" | "completion" | "error"
  automation_type: string
  request_id: string
  status: "pending" | "completed" | "failed"
  timestamp: string
  payload?: any
  result?: any
}

export function AIAutomationWebhookTester() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([])
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    automation_type: "copywriter",
    prompt: "",
    context: "{}",
    user_email: "",
    simulate_completion: true,
    simulate_delay: 2,
  })

  const automationTypes = [
    { value: "copywriter", label: "Copywriter IA", icon: Bot, description: "Geração de textos e copy" },
    { value: "images", label: "Gerador de Imagens", icon: ImageIcon, description: "Criação de imagens com IA" },
    { value: "videos", label: "Criador de Vídeos", icon: Video, description: "Produção de vídeos automatizada" },
    { value: "email", label: "Otimizador de Email", icon: Mail, description: "Otimização de campanhas de email" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTestResult(null)

    try {
      let context = {}
      if (formData.context.trim()) {
        try {
          context = JSON.parse(formData.context)
        } catch {
          throw new Error("Context deve ser um JSON válido")
        }
      }

      const response = await fetch("/api/webhooks/ai-automation/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          automation_type: formData.automation_type,
          prompt: formData.prompt,
          context,
          user_email: formData.user_email || undefined,
          simulate_completion: formData.simulate_completion,
          simulate_delay: formData.simulate_delay,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setTestResult(result)

        // Adicionar log do webhook
        const newLog: WebhookLog = {
          id: result.request_id,
          type: "request",
          automation_type: formData.automation_type,
          request_id: result.request_id,
          status: "pending",
          timestamp: result.timestamp,
          payload: {
            prompt: formData.prompt,
            context,
            simulate_completion: formData.simulate_completion,
          },
        }

        setWebhookLogs((prev) => [newLog, ...prev])

        toast({
          title: "Webhook enviado com sucesso!",
          description: `Request ID: ${result.request_id}`,
        })

        // Se simulação está ativa, aguardar conclusão
        if (formData.simulate_completion) {
          setTimeout(
            () => {
              setWebhookLogs((prev) =>
                prev.map((log) =>
                  log.request_id === result.request_id ? { ...log, status: "completed", type: "completion" } : log,
                ),
              )
            },
            formData.simulate_delay * 1000 + 500,
          )
        }
      } else {
        throw new Error(result.message || "Erro ao enviar webhook")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      setTestResult({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      })

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyRequestId = (requestId: string) => {
    navigator.clipboard.writeText(requestId)
    toast({
      title: "Copiado!",
      description: "Request ID copiado para a área de transferência",
    })
  }

  const selectedType = automationTypes.find((type) => type.value === formData.automation_type)

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Testador de Webhooks de Automação IA
          </CardTitle>
          <CardDescription>Teste os webhooks de automação de IA enviando solicitações simuladas</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="test" className="space-y-6">
            <TabsList className="glass-card">
              <TabsTrigger value="test">Teste de Webhook</TabsTrigger>
              <TabsTrigger value="logs">Logs de Webhook</TabsTrigger>
              <TabsTrigger value="docs">Documentação</TabsTrigger>
            </TabsList>

            <TabsContent value="test" className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="automation_type">Tipo de Automação</Label>
                    <Select
                      value={formData.automation_type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, automation_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {automationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedType && <p className="text-sm text-muted-foreground">{selectedType.description}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user_email">Email do Usuário (Opcional)</Label>
                    <Input
                      id="user_email"
                      type="email"
                      value={formData.user_email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, user_email: e.target.value }))}
                      placeholder="usuario@exemplo.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt da Automação</Label>
                  <Textarea
                    id="prompt"
                    value={formData.prompt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, prompt: e.target.value }))}
                    placeholder="Descreva o que você quer que a IA faça..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context">Contexto (JSON)</Label>
                  <Textarea
                    id="context"
                    value={formData.context}
                    onChange={(e) => setFormData((prev) => ({ ...prev, context: e.target.value }))}
                    placeholder='{"target_audience": "empreendedores", "tone": "profissional"}'
                    className="min-h-[80px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">Contexto adicional em formato JSON (opcional)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Simular Conclusão</Label>
                      <p className="text-sm text-muted-foreground">Simular automaticamente a conclusão da automação</p>
                    </div>
                    <Switch
                      checked={formData.simulate_completion}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, simulate_completion: checked }))}
                    />
                  </div>

                  {formData.simulate_completion && (
                    <div className="space-y-2">
                      <Label htmlFor="simulate_delay">Delay da Simulação (segundos)</Label>
                      <Input
                        id="simulate_delay"
                        type="number"
                        min="1"
                        max="30"
                        value={formData.simulate_delay}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, simulate_delay: Number.parseInt(e.target.value) || 2 }))
                        }
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={isLoading || !formData.prompt.trim()} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando Webhook...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Webhook de Teste
                    </>
                  )}
                </Button>
              </form>

              {testResult && (
                <Card
                  className={`border-2 ${testResult.success ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {testResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      {testResult.success ? "Webhook Enviado com Sucesso" : "Erro no Webhook"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {testResult.success ? (
                      <>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Request ID:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="bg-background/50 px-2 py-1 rounded text-xs">
                                {testResult.request_id}
                              </code>
                              <Button variant="ghost" size="sm" onClick={() => copyRequestId(testResult.request_id!)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tipo:</span>
                            <div className="mt-1">
                              <Badge variant="secondary">{testResult.automation_type}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Mensagem:</span>
                          <p className="mt-1">{testResult.message}</p>
                        </div>
                        {testResult.processing_time && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Tempo Estimado:</span>
                            <p className="mt-1">{testResult.processing_time}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Erro:</span>
                        <p className="mt-1 text-red-400">{testResult.error}</p>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {new Date(testResult.timestamp).toLocaleString("pt-BR")}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Logs de Webhook</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWebhookLogs([])}
                  disabled={webhookLogs.length === 0}
                >
                  Limpar Logs
                </Button>
              </div>

              {webhookLogs.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Nenhum log de webhook ainda</p>
                      <p className="text-sm text-muted-foreground">Envie um webhook de teste para ver os logs aqui</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {webhookLogs.map((log) => (
                    <Card key={log.id} className="glass-card">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={
                                log.status === "completed"
                                  ? "default"
                                  : log.status === "failed"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {log.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {log.status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
                              {log.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                              {log.status}
                            </Badge>
                            <Badge variant="outline">{log.automation_type}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString("pt-BR")}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Request ID:</span>
                            <code className="block bg-background/50 px-2 py-1 rounded text-xs mt-1">
                              {log.request_id}
                            </code>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tipo:</span>
                            <p className="mt-1 capitalize">{log.type}</p>
                          </div>
                        </div>

                        {log.payload && (
                          <details className="mt-3">
                            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                              Ver Payload
                            </summary>
                            <pre className="mt-2 bg-background/50 p-3 rounded text-xs overflow-auto">
                              {JSON.stringify(log.payload, null, 2)}
                            </pre>
                          </details>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="docs" className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Documentação da API</CardTitle>
                  <CardDescription>Como integrar com os webhooks de automação de IA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Endpoint de Teste</h4>
                    <code className="bg-background/50 p-2 rounded block text-sm">
                      POST /api/webhooks/ai-automation/test
                    </code>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Endpoint de Processamento</h4>
                    <code className="bg-background/50 p-2 rounded block text-sm">
                      POST /api/webhooks/ai-automation/process
                    </code>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Tipos de Automação Suportados</h4>
                    <ul className="space-y-2">
                      {automationTypes.map((type) => (
                        <li key={type.value} className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          <code className="bg-background/50 px-2 py-1 rounded text-sm">{type.value}</code>
                          <span className="text-sm text-muted-foreground">- {type.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Exemplo de Payload</h4>
                    <pre className="bg-background/50 p-3 rounded text-sm overflow-auto">
                      {`{
  "automation_type": "copywriter",
  "prompt": "Escreva um texto de vendas para um curso de marketing digital",
  "context": {
    "target_audience": "empreendedores",
    "tone": "profissional",
    "length": "medium"
  },
  "user_email": "usuario@exemplo.com",
  "simulate_completion": true,
  "simulate_delay": 3
}`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Eventos de Webhook</h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <code>ai_automation_requested</code> - Automação solicitada
                      </li>
                      <li>
                        <code>ai_automation_completed</code> - Automação concluída
                      </li>
                      <li>
                        <code>ai_automation_failed</code> - Automação falhou
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
