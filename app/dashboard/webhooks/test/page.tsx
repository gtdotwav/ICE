"use client"

import { Suspense } from "react"
import { WebhookTestPanel } from "@/components/dashboard/webhooks/webhook-test-panel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function WebhookTestPage() {
  return (
    <Suspense fallback={<div>Carregando teste de webhook...</div>}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/webhooks">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Teste de Webhook</h1>
            <p className="text-muted-foreground">Valide suas integrações com webhooks de teste</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <WebhookTestPanel 
            webhookId="wh_test_001" 
            webhookUrl="https://webhook.site/test" 
          />
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Documentação</CardTitle>
              <CardDescription>
                Guia rápido para configurar webhooks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">1. Configure o Endpoint</h4>
                <p className="text-sm text-muted-foreground">
                  Defina a URL que receberá os webhooks do IceFunnel
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">2. Valide a Assinatura</h4>
                <p className="text-sm text-muted-foreground">
                  Use o header X-Webhook-Signature para validar a autenticidade
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">3. Responda Rapidamente</h4>
                <p className="text-sm text-muted-foreground">
                  Retorne status 200 em menos de 30 segundos
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">4. Implemente Idempotência</h4>
                <p className="text-sm text-muted-foreground">
                  Use o ID do webhook para evitar processamento duplicado
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Suspense>
  )
}