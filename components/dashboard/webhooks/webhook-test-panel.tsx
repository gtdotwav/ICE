"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { TestTube, Send, Copy, CheckCircle, AlertCircle } from "lucide-react"

interface WebhookTestPanelProps {
  webhookId: string
  webhookUrl: string
}

export function WebhookTestPanel({ webhookId, webhookUrl }: WebhookTestPanelProps) {
  const [selectedEvent, setSelectedEvent] = useState('form.submitted')
  const [customPayload, setCustomPayload] = useState('')
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const eventTemplates = {
    'form.submitted': {
      id: 'wh_test_001',
      event: 'form.submitted',
      timestamp: new Date().toISOString(),
      data: {
        formId: 'contact_form',
        fields: {
          name: 'João Silva',
          email: 'joao@exemplo.com',
          phone: '+55 11 99999-9999'
        },
        submittedAt: new Date().toISOString(),
        source: 'landing_page'
      },
      source: 'icefunnel',
      version: '1.0'
    },
    'funnel.conversion': {
      id: 'wh_test_002',
      event: 'funnel.conversion',
      timestamp: new Date().toISOString(),
      data: {
        funnelId: 'funnel_main',
        stepId: 'checkout',
        leadId: 'lead_123',
        value: 297.00,
        convertedAt: new Date().toISOString()
      },
      source: 'icefunnel',
      version: '1.0'
    },
    'payment.completed': {
      id: 'wh_test_003',
      event: 'payment.completed',
      timestamp: new Date().toISOString(),
      data: {
        paymentId: 'pay_123',
        amount: 297.00,
        currency: 'BRL',
        customerId: 'cust_456',
        completedAt: new Date().toISOString()
      },
      source: 'icefunnel',
      version: '1.0'
    }
  }

  const handleEventChange = (event: string) => {
    setSelectedEvent(event)
    setCustomPayload(JSON.stringify(eventTemplates[event as keyof typeof eventTemplates], null, 2))
  }

  const sendTestWebhook = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      let payload
      try {
        payload = customPayload ? JSON.parse(customPayload) : eventTemplates[selectedEvent as keyof typeof eventTemplates]
      } catch {
        toast({
          title: "Erro",
          description: "Payload JSON inválido",
          variant: "destructive"
        })
        return
      }

      const response = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookId,
          testPayload: payload
        })
      })

      const result = await response.json()
      setTestResult(result)

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Webhook de teste enviado com sucesso!"
        })
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao enviar webhook",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro de conexão",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyPayload = () => {
    navigator.clipboard.writeText(customPayload)
    toast({
      title: "Sucesso",
      description: "Payload copiado para a área de transferência!"
    })
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Testar Webhook
        </CardTitle>
        <CardDescription>
          Envie um webhook de teste para validar a integração
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Evento</label>
          <Select value={selectedEvent} onValueChange={handleEventChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="form.submitted">Formulário Submetido</SelectItem>
              <SelectItem value="funnel.conversion">Conversão no Funil</SelectItem>
              <SelectItem value="payment.completed">Pagamento Completado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Payload JSON</label>
            <Button variant="ghost" size="sm" onClick={copyPayload}>
              <Copy className="h-3 w-3 mr-1" />
              Copiar
            </Button>
          </div>
          <Textarea
            value={customPayload}
            onChange={(e) => setCustomPayload(e.target.value)}
            placeholder="Payload do webhook em formato JSON"
            rows={12}
            className="font-mono text-xs"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={sendTestWebhook} 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Teste
              </>
            )}
          </Button>
        </div>

        {testResult && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Resultado do Teste</label>
            <div className={`p-3 rounded-lg border ${
              testResult.success 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {testResult.success ? 'Sucesso' : 'Erro'}
                </span>
              </div>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}