"use client"

import { WebhookManagement } from "@/components/dashboard/webhooks/webhook-management"

export default function WebhooksPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Webhooks
        </h1>
        <p className="text-lg text-muted-foreground">
          Configure integrações automáticas com sistemas externos através de webhooks bidirecionais.
        </p>
      </div>

      <WebhookManagement />
    </div>
  )
}