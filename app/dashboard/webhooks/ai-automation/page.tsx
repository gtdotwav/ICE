import { AIAutomationWebhookTester } from "@/components/dashboard/webhooks/ai-automation-webhook-tester"

export default function AIAutomationWebhooksPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text">Webhooks de Automação IA</h1>
        <p className="text-muted-foreground mt-2">
          Teste e monitore os webhooks de automação de inteligência artificial
        </p>
      </div>

      <AIAutomationWebhookTester />
    </div>
  )
}
