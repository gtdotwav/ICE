"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Send, CheckCircle, Webhook } from "lucide-react"

export function WebhookTestPanel() {
  const [isLoading, setIsLoading] = useState(false)
  const [eventType, setEventType] = useState("form.submitted")
  const [payload, setPayload] = useState(
    JSON.stringify(
      {
        event_id: "evt_" + Date.now(),
        timestamp: new Date().toISOString(),
        data: {
          form_id: "contact_form",
          fields: {
            name: "Usuário Teste",
            email: "usuario@teste.com",
            message: "Esta é uma mensagem de teste",
          },
          submitted_at: new Date().toISOString(),
        },
      },
      null,
      2,
    ),
  )
  const [endpoint, setEndpoint] = useState("/api/webhooks/test")
  const [result, setResult] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)
  const { toast } = useToast()

  const handleEventTypeChange = (value: string) => {
    setEventType(value)

    // Atualizar payload com base no tipo de evento
    let newPayload = {}

    switch (value) {
      case "form.submitted":
        newPayload = {
          event_id: "evt_" + Date.now(),
          timestamp: new Date().toISOString(),
          data: {
            form_id: "contact_form",
            fields: {
              name: "Usuário Teste",
              email: "usuario@teste.com",
              message: "Esta é uma mensagem de teste",
            },
            submitted_at: new Date().toISOString(),
          },
        }
        break
      case "user.registered":
        newPayload = {
          event_id: "evt_" + Date.now(),
          timestamp: new Date().toISOString(),
          data: {
            user_id: "usr_" + Math.random().toString(36).substring(2, 10),
            email: "novo@usuario.com",
            name: "Novo Usuário",
            registered_at: new Date().toISOString(),
            source: "website",
          },
        }
        break
      case "payment.completed":
        newPayload = {
          event_id: "evt_" + Date.now(),
          timestamp: new Date().toISOString(),
          data: {
            payment_id: "pay_" + Math.random().toString(36).substring(2, 10),
            amount: 99.9,
            currency: "BRL",
            customer_id: "cus_" + Math.random().toString(36).substring(2, 10),
            payment_method: "credit_card",
            status: "completed",
          },
        }
        break
      default:
        newPayload = {
          event_id: "evt_" + Date.now(),
          timestamp: new Date().toISOString(),
          data: {},
        }
    }

    setPayload(JSON.stringify(newPayload, null, 2))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setShowResult(false)

    try {
      // Validar JSON
      const payloadObj = JSON.parse(payload)

      // Enviar para o endpoint
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Test": "true",
        },
        body: JSON.stringify({
          ...payloadObj,
          event_type: eventType,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Webhook enviado com sucesso!",
          description: "Os dados foram enviados para o endpoint de teste.",
        })
        setResult(result)
        setShowResult(true)
      } else {
        throw new Error(result.error || "Erro ao enviar webhook")
      }
    } catch (error) {
      console.error("Erro ao enviar webhook:", error)
      toast({
        title: "Erro ao enviar webhook",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao enviar o webhook",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Webhook className="h-5 w-5 text-primary" />
          Teste de Webhook
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event-type">Tipo de Evento</Label>
              <Select value={eventType} onValueChange={handleEventTypeChange}>
                <SelectTrigger id="event-type" className="mt-1">
                  <SelectValue placeholder="Selecione o tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="form.submitted">Formulário Enviado</SelectItem>
                  <SelectItem value="user.registered">Usuário Registrado</SelectItem>
                  <SelectItem value="payment.completed">Pagamento Concluído</SelectItem>
                  <SelectItem value="lead.qualified">Lead Qualificado</SelectItem>
                  <SelectItem value="campaign.started">Campanha Iniciada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="endpoint">Endpoint</Label>
              <Input id="endpoint" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="mt-1" />
            </div>
          </div>

          <div>
            <Label htmlFor="payload">Payload (JSON)</Label>
            <Textarea
              id="payload"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="mt-1 font-mono"
              rows={10}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white">
              {isLoading ? (
                <>
                  <motion.div className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Webhook
                </>
              )}
            </Button>
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 border rounded-md bg-muted/30"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Webhook Enviado com Sucesso</h3>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                  Status 200
                </Badge>
              </div>
              <Separator className="my-2" />
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2">Resposta:</p>
                <pre className="bg-black/80 p-4 rounded-md text-xs text-white overflow-auto max-h-60">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
