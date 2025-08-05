import { WebhookTestPanel } from "@/components/dashboard/webhooks/webhook-test-panel"
import { WebhookTestButton } from "@/components/dashboard/webhooks/webhook-test-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function WebhookTestPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Teste de Webhooks</h1>
        <p className="text-muted-foreground mt-2">
          Teste os webhooks do sistema para garantir que estão funcionando corretamente.
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Webhooks Gerais</TabsTrigger>
          <TabsTrigger value="ai">Webhooks de IA</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <WebhookTestPanel />
        </TabsContent>

        <TabsContent value="ai">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Teste de Webhooks de Automação de IA</h2>
              <p className="text-muted-foreground">
                Simule o envio de webhooks para automações de IA (Copywriter, Imagens, Vídeos, Email).
              </p>
            </div>

            <WebhookTestButton className="mt-4" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
