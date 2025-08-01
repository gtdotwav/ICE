/**
 * Cliente para integração fácil com o sistema de webhooks
 */

import { WebhookService } from './webhook-service'

export class WebhookClient {
  private webhookService: WebhookService
  private userId: string

  constructor(userId: string) {
    this.webhookService = new WebhookService()
    this.userId = userId
  }

  /**
   * Dispara webhook quando formulário é submetido
   */
  async onFormSubmit(formElement: HTMLFormElement) {
    const formData = new FormData(formElement)
    const fields = Object.fromEntries(formData.entries())
    
    await this.webhookService.triggerWebhook('form.submitted', {
      formId: formElement.id || 'unknown',
      fields,
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      source: window.location.pathname
    }, this.userId)
  }

  /**
   * Dispara webhook para conversão
   */
  async onConversion(funnelId: string, stepId: string, value: number) {
    await this.webhookService.triggerWebhook('funnel.conversion', {
      funnelId,
      stepId,
      leadId: `lead_${Date.now()}`,
      value,
      convertedAt: new Date().toISOString()
    }, this.userId)
  }

  /**
   * Dispara webhook para pagamento
   */
  async onPayment(paymentData: any) {
    await this.webhookService.triggerWebhook('payment.completed', {
      ...paymentData,
      completedAt: new Date().toISOString()
    }, this.userId)
  }

  /**
   * Configura listeners automáticos
   */
  setupAutoListeners() {
    // Listener para formulários
    document.addEventListener('submit', async (event) => {
      const form = event.target as HTMLFormElement
      if (form.tagName === 'FORM') {
        await this.onFormSubmit(form)
      }
    })

    // Listener para cliques em botões de conversão
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement
      if (target.dataset.webhookTrigger === 'conversion') {
        const funnelId = target.dataset.funnelId || 'unknown'
        const stepId = target.dataset.stepId || 'unknown'
        const value = parseFloat(target.dataset.value || '0')
        
        await this.onConversion(funnelId, stepId, value)
      }
    })
  }
}

// Instância global para uso fácil
let webhookClient: WebhookClient | null = null

export function initializeWebhooks(userId: string) {
  webhookClient = new WebhookClient(userId)
  webhookClient.setupAutoListeners()
  return webhookClient
}

export function getWebhookClient(): WebhookClient | null {
  return webhookClient
}