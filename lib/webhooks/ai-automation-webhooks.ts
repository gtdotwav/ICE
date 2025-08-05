import crypto from "crypto"

// Tipos de automação de IA suportados
export type AIAutomationType = "copywriter" | "images" | "videos" | "email"

// Interface para solicitação de automação de IA
export interface AIAutomationRequest {
  type: AIAutomationType
  prompt: string
  context?: Record<string, any>
  userId: string
  userEmail?: string
}

// Interface para resposta de automação de IA
export interface AIAutomationResponse {
  success: boolean
  request_id: string
  automation_type: AIAutomationType
  result?: {
    content?: string
    metadata?: {
      processing_time?: string
      tokens_used?: number
    }
  }
  files?: string[]
  timestamp: string
}

export class AIAutomationWebhooks {
  private static readonly WEBHOOK_URL =
    process.env.AI_AUTOMATION_WEBHOOK_URL || "https://meu-sistema-automacao.com/webhook/icefunnel"
  private static readonly WEBHOOK_SECRET = process.env.AI_AUTOMATION_WEBHOOK_SECRET || "webhook_secret_key"

  /**
   * Envia uma solicitação de automação de IA para o webhook configurado
   */
  static async sendAutomationRequest(requestData: AIAutomationRequest): Promise<string> {
    try {
      // Gerar ID único para a solicitação
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Preparar payload do webhook
      const webhookPayload = {
        event_type: "ai_automation_requested",
        request_id: requestId,
        user_id: requestData.userId,
        timestamp: new Date().toISOString(),
        automation_details: {
          type: requestData.type,
          prompt: requestData.prompt,
          context: requestData.context || {},
        },
        callback_config: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/ai-automation/callback`,
          user_interface_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/ia`,
          notification_email: requestData.userEmail || "usuario@email.com",
        },
      }

      // Gerar assinatura para o webhook
      const signature = this.generateSignature(webhookPayload)

      // Enviar para o webhook configurado
      const response = await fetch(this.WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
          "X-Request-ID": requestId,
          "X-Automation-Type": requestData.type,
        },
        body: JSON.stringify(webhookPayload),
      })

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`)
      }

      console.log(`Webhook de automação enviado com sucesso: ${requestId}`)
      return requestId
    } catch (error) {
      console.error("Erro ao enviar webhook de automação:", error)
      throw error
    }
  }

  /**
   * Verifica a assinatura de um webhook recebido
   */
  static verifySignature(payload: any, signature: string): boolean {
    const expectedSignature = this.generateSignature(payload)
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  }

  /**
   * Gera uma assinatura para o payload do webhook
   */
  private static generateSignature(payload: any): string {
    const hmac = crypto.createHmac("sha256", this.WEBHOOK_SECRET)
    hmac.update(JSON.stringify(payload))
    return hmac.digest("hex")
  }
}
