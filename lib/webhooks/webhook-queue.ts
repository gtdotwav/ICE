import { WebhookDelivery } from './types'

export class WebhookQueue {
  private queue: Map<string, any> = new Map()

  /**
   * Adiciona webhook à fila de processamento
   */
  async addToQueue(delivery: Omit<WebhookDelivery, 'id' | 'createdAt'>): Promise<string> {
    const id = this.generateId()
    const webhookDelivery: WebhookDelivery = {
      ...delivery,
      id,
      createdAt: new Date()
    }

    // Em produção, usar Redis ou RabbitMQ
    this.queue.set(id, webhookDelivery)
    
    // Processa imediatamente (em produção seria assíncrono)
    setTimeout(() => this.processQueue(id), 100)
    
    return id
  }

  /**
   * Agenda retry de webhook
   */
  async scheduleRetry(deliveryId: string, delaySeconds: number): Promise<void> {
    setTimeout(() => {
      this.processQueue(deliveryId)
    }, delaySeconds * 1000)
  }

  /**
   * Processa item da fila
   */
  private async processQueue(deliveryId: string): Promise<void> {
    // Em produção, importar WebhookService aqui para evitar dependência circular
    console.log(`Processando webhook: ${deliveryId}`)
  }

  /**
   * Obtém estatísticas da fila
   */
  async getQueueStats(): Promise<{
    pending: number
    processing: number
    failed: number
    delivered: number
  }> {
    // Implementar contagem real do banco/fila
    return {
      pending: 0,
      processing: 0,
      failed: 0,
      delivered: 0
    }
  }

  private generateId(): string {
    return `delivery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}