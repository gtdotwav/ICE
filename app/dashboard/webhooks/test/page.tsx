"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WebhookTestPanel } from "@/components/dashboard/webhooks/webhook-test-panel"
import { WebhookTestButton } from "@/components/dashboard/webhooks/webhook-test-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TestTube, Zap, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function WebhookTestPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TestTube className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Teste de Webhooks</h1>
          </div>
          <p className="text-muted-foreground">Teste e valide seus webhooks em ambiente seguro</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/webhooks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Webhooks Gerais
          </TabsTrigger>
          <TabsTrigger value="ai-automation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Webhooks de IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teste de Webhooks Gerais</CardTitle>
              <CardDescription>
                Teste webhooks para eventos gerais do sistema como formulários, conversões e leads.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WebhookTestPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-automation" className="space-y-6">
          <WebhookTestButton />

          <Card>
            <CardHeader>
              <CardTitle>Como Funciona</CardTitle>
              <CardDescription>Entenda como os webhooks de automação de IA são processados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">1. Solicitação</h4>
                  <p className="text-sm text-muted-foreground">
                    Quando você preenche um formulário de IA, o sistema gera uma solicitação com ID único.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">2. Webhook Enviado</h4>
                  <p className="text-sm text-muted-foreground">
                    Um webhook é enviado para o endpoint configurado com os dados da solicitação.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">3. Processamento</h4>
                  <p className="text-sm text-muted-foreground">
                    O sistema externo processa a solicitação e gera o conteúdo solicitado.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">4. Callback</h4>
                  <p className="text-sm text-muted-foreground">
                    O resultado é enviado de volta via callback para atualizar o status.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
