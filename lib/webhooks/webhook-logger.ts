import { WebhookLog } from './types'

export class WebhookLogger {
  /**
   * Log de webhook enviado com sucesso
   */
  async logSuccess(
    webhookConfigId: string,
    event: string,
    duration: number,
    response: any
  ): Promise<void> {
    const log: Omit<WebhookLog, 'id'> = {
      type: 'outgoing',
      webhookConfigId,
      event,
      status: 'success',
      payload: null, // Não logamos payload completo por questões de privacidade
      response: {
        status: response.status,
        headers: response.headers
      },
      duration,
      timestamp: new Date()
    }

    await this.saveLog(log)
  }

  /**
   * Log de erro em webhook enviado
   */
  async logError(
    webhookConfigId: string,
    event: string,
    duration: number,
    error: any
  ): Promise<void> {
    const log: Omit<WebhookLog, 'id'> = {
      type: 'outgoing',
      webhookConfigId,
      event,
      status: 'error',
      payload: null,
      response: error,
      duration,
      timestamp: new Date()
    }

    await this.saveLog(log)
  }

  /**
   * Log de webhook recebido com sucesso
   */
  async logIncomingSuccess(
    webhookConfigId: string,
    event: string,
    duration: number,
    payload: any
  ): Promise<void> {
    const log: Omit<WebhookLog, 'id'> = {
      type: 'incoming',
      webhookConfigId,
      event,
      status: 'success',
      payload: this.sanitizePayload(payload),
      duration,
      timestamp: new Date()
    }

    await this.saveLog(log)
  }

  /**
   * Log de erro em webhook recebido
   */
  async logIncomingError(
    endpoint: string,
    duration: number,
    error: Error,
    payload: any
  ): Promise<void> {
    const log: Omit<WebhookLog, 'id'> = {
      type: 'incoming',
      webhookConfigId: endpoint,
      event: 'unknown',
      status: 'error',
      payload: this.sanitizePayload(payload),
      response: { error: error.message },
      duration,
      timestamp: new Date()
    }

    await this.saveLog(log)
  }

  /**
   * Obtém logs de webhook
   */
  async getWebhookLogs(
    webhookConfigId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<WebhookLog[]> {
    // Implementar busca no banco de dados
    return []
  }

  /**
   * Obtém estatísticas de webhook
   */
  async getWebhookStats(webhookConfigId: string, days: number = 7): Promise<{
    totalDeliveries: number
    successRate: number
    averageResponseTime: number
    errorsByType: Record<string, number>
  }> {
    // Implementar agregação de estatísticas
    return {
      totalDeliveries: 0,
      successRate: 0,
      averageResponseTime: 0,
      errorsByType: {}
    }
  }

  /**
   * Remove dados sensíveis do payload para log
   */
  private sanitizePayload(payload: any): any {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'credit_card']
    
    if (typeof payload !== 'object' || payload === null) {
      return payload
    }

    const sanitized = { ...payload }
    
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]'
      }
    }
    
    return sanitized
  }

  /**
   * Salva log no banco de dados
   */
  private async saveLog(log: Omit<WebhookLog, 'id'>): Promise<void> {
    // Implementar salvamento no banco de dados
    console.log('Webhook log:', log)
  }
}