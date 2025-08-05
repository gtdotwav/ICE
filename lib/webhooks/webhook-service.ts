import type { WebhookConfig, WebhookPayload, WebhookDelivery, RetryConfig } from "./types"
import { WebhookQueue } from "./webhook-queue"
import { WebhookSecurity } from "./webhook-security"
import { WebhookLogger } from "./webhook-logger"
import { nanoid } from "nanoid"

export class WebhookService {
  private queue: WebhookQueue
  private security: WebhookSecurity
  private logger: WebhookLogger

  constructor() {
    this.queue = new WebhookQueue()
    this.security = new WebhookSecurity()
    this.logger = new WebhookLogger()
  }

  /**
   * Envia webhook para todos os endpoints configurados para um evento específico
   */
  async triggerWebhook(eventType: string, data: Record<string, any>, userId: string): Promise<void> {
    try {
      // Busca todas as configurações de webhook ativas para este usuário e evento
      const webhookConfigs = await this.getActiveWebhookConfigs(userId, eventType)

      if (webhookConfigs.length === 0) {
        console.log(`Nenhum webhook configurado para evento: ${eventType}`)
        return
      }

      // Cria o payload base
      const payload: WebhookPayload = {
        id: this.generateId(),
        event: eventType as any,
        timestamp: new Date().toISOString(),
        data,
        source: "hiasflow",
        version: "1.0",
      }

      // Envia para cada webhook configurado
      for (const config of webhookConfigs) {
        await this.queueWebhookDelivery(config, payload)
      }
    } catch (error) {
      console.error("Erro ao disparar webhook:", error)
      await this.logger.logError("webhook_trigger_failed", { eventType, userId, error }, 0, {})
    }
  }

  /**
   * Adiciona webhook à fila de entrega
   */
  private async queueWebhookDelivery(config: WebhookConfig, payload: WebhookPayload): Promise<void> {
    const delivery: Omit<WebhookDelivery, "id" | "createdAt"> = {
      webhookConfigId: config.id,
      payload,
      status: "pending",
      attempts: 0,
    }

    await this.queue.addToQueue(delivery)
  }

  /**
   * Processa webhook da fila
   */
  async processWebhookDelivery(deliveryId: string): Promise<void> {
    const startTime = Date.now()

    try {
      const delivery = await this.getWebhookDelivery(deliveryId)
      const config = await this.getWebhookConfig(delivery.webhookConfigId)

      if (!config.isActive) {
        await this.updateDeliveryStatus(deliveryId, "failed", "Webhook desativado")
        return
      }

      // Assina o payload
      const signature = this.security.signPayload(delivery.payload, config.secret)

      // Prepara headers
      const headers = {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
        "X-Webhook-Event": delivery.payload.event,
        "X-Webhook-ID": delivery.payload.id,
        "User-Agent": "IceFunnel-Webhooks/1.0",
        ...config.headers,
      }

      // Envia o webhook
      const response = await fetch(config.url, {
        method: "POST",
        headers,
        body: JSON.stringify(delivery.payload),
        signal: AbortSignal.timeout(30000), // 30s timeout
      })

      const responseBody = await response.text()
      const duration = Date.now() - startTime

      if (response.ok) {
        await this.updateDeliveryStatus(deliveryId, "delivered")
        await this.logger.logSuccess(config.id, delivery.payload.event, duration, {
          status: response.status,
          response: responseBody,
        })
      } else {
        throw new Error(`HTTP ${response.status}: ${responseBody}`)
      }
    } catch (error) {
      const duration = Date.now() - startTime
      await this.handleWebhookError(deliveryId, error as Error, duration)
    }
  }

  /**
   * Trata erros e implementa retry logic
   */
  private async handleWebhookError(deliveryId: string, error: Error, duration: number): Promise<void> {
    const delivery = await this.getWebhookDelivery(deliveryId)
    const config = await this.getWebhookConfig(delivery.webhookConfigId)

    delivery.attempts += 1

    await this.logger.logError(config.id, delivery.payload.event, duration, {
      error: error.message,
      attempt: delivery.attempts,
    })

    if (delivery.attempts >= config.retryConfig.maxAttempts) {
      await this.updateDeliveryStatus(deliveryId, "failed", error.message)
      return
    }

    // Calcula próximo retry com backoff exponencial
    const delay = this.calculateRetryDelay(delivery.attempts, config.retryConfig)
    const nextRetryAt = new Date(Date.now() + delay * 1000)

    await this.updateDeliveryStatus(deliveryId, "retrying", error.message, nextRetryAt)
    await this.queue.scheduleRetry(deliveryId, delay)
  }

  /**
   * Calcula delay para retry com backoff exponencial
   */
  private calculateRetryDelay(attempt: number, config: RetryConfig): number {
    return config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1)
  }

  /**
   * Valida webhook recebido
   */
  async validateIncomingWebhook(endpoint: string, signature: string, payload: any): Promise<boolean> {
    const config = await this.getIncomingWebhookConfig(endpoint)

    if (!config || !config.isActive) {
      return false
    }

    return this.security.verifySignature(payload, signature, config.secret)
  }

  /**
   * Processa webhook recebido
   */
  async processIncomingWebhook(endpoint: string, payload: any): Promise<void> {
    const startTime = Date.now()

    try {
      const config = await this.getIncomingWebhookConfig(endpoint)

      if (!config) {
        throw new Error("Configuração de webhook não encontrada")
      }

      // Mapeia evento externo para evento interno
      const internalEvent = this.mapExternalEvent(payload, config.eventMapping)

      if (internalEvent) {
        // Processa o evento no sistema
        await this.processInternalEvent(internalEvent, payload.data, config.userId)
      }

      const duration = Date.now() - startTime
      await this.logger.logIncomingSuccess(config.id, payload.event, duration, payload)
    } catch (error) {
      const duration = Date.now() - startTime
      await this.logger.logIncomingError(endpoint, duration, error as Error, payload)
      throw error
    }
  }

  // Métodos auxiliares (implementação simplificada)
  private generateId(): string {
    return `wh_${Date.now()}_${nanoid(9)}`
  }

  private async getActiveWebhookConfigs(userId: string, eventType: string): Promise<WebhookConfig[]> {
    // Simulação de busca no banco de dados
    const mockConfigs: WebhookConfig[] = [
      {
        id: "wh_001",
        name: "Test Webhook",
        url: "https://webhook.site/test",
        events: [{ type: eventType as any, description: "Test event" }],
        secret: "test_secret",
        isActive: true,
        retryConfig: {
          maxAttempts: 3,
          backoffMultiplier: 2,
          initialDelay: 5,
        },
        headers: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
      },
    ]
    return mockConfigs.filter(
      (config) => config.userId === userId && config.events.some((event) => event.type === eventType),
    )
  }

  private async getWebhookConfig(id: string): Promise<WebhookConfig> {
    // Simulação de busca no banco de dados
    return {
      id,
      name: "Test Webhook",
      url: "https://webhook.site/test",
      events: [{ type: "form.submitted", description: "Form submitted" }],
      secret: "test_secret",
      isActive: true,
      retryConfig: {
        maxAttempts: 3,
        backoffMultiplier: 2,
        initialDelay: 5,
      },
      headers: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user_123",
    }
  }

  private async getWebhookDelivery(id: string): Promise<WebhookDelivery> {
    // Simulação de busca no banco de dados
    return {
      id,
      webhookConfigId: "wh_001",
      payload: {
        id: "payload_123",
        event: "form.submitted",
        timestamp: new Date().toISOString(),
        data: {},
        source: "icefunnel",
        version: "1.0",
      },
      status: "pending",
      attempts: 0,
      createdAt: new Date(),
    }
  }

  private async getIncomingWebhookConfig(endpoint: string): Promise<any> {
    // Simulação de busca no banco de dados
    return {
      id: "incoming_001",
      name: "Test Incoming",
      endpoint,
      secret: "incoming_secret",
      isActive: true,
      allowedSources: ["*"],
      eventMapping: {
        external_event: "internal_event",
      },
      userId: "user_123",
      createdAt: new Date(),
    }
  }

  private async updateDeliveryStatus(
    id: string,
    status: WebhookDelivery["status"],
    errorMessage?: string,
    nextRetryAt?: Date,
  ): Promise<void> {
    // Simulação de atualização no banco de dados
    console.log(`Updating delivery ${id} to status: ${status}`, { errorMessage, nextRetryAt })
  }

  private mapExternalEvent(payload: any, mapping: Record<string, string>): string | null {
    return mapping[payload.event] || payload.event || null
  }

  private async processInternalEvent(event: string, data: any, userId: string): Promise<void> {
    // Simulação de processamento de evento interno
    console.log(`Processing internal event: ${event}`, { data, userId })
  }
}
