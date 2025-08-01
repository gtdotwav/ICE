/**
 * Integração do sistema de webhooks com o SaaS
 * Este arquivo conecta os webhooks aos eventos reais do sistema
 */

import { WebhookTriggers } from './webhook-triggers'

// Integração com formulários
export async function integrateFormWebhooks() {
  // Exemplo de como integrar com submissão de formulários
  const originalFormSubmit = window.HTMLFormElement.prototype.submit
  
  window.HTMLFormElement.prototype.submit = function() {
    const formData = new FormData(this)
    const formObject = Object.fromEntries(formData.entries())
    
    // Disparar webhook
    WebhookTriggers.onFormSubmitted({
      formId: this.id || 'unknown',
      fields: formObject,
      userAgent: navigator.userAgent,
      ipAddress: 'client-side', // Em produção, obter do servidor
      source: window.location.pathname
    }, 'current-user-id') // Em produção, obter do contexto de autenticação
    
    // Chamar submit original
    return originalFormSubmit.call(this)
  }
}

// Integração com eventos de conversão
export async function trackConversion(funnelId: string, stepId: string, leadId: string, value: number) {
  await WebhookTriggers.onFunnelConversion({
    funnelId,
    stepId,
    leadId,
    value,
    previousSteps: [] // Implementar tracking de steps
  }, 'current-user-id')
}

// Integração com sistema de pagamentos
export async function trackPayment(paymentData: any) {
  await WebhookTriggers.onPaymentCompleted(paymentData, 'current-user-id')
}

// Integração com qualificação de leads
export async function qualifyLead(leadData: any) {
  await WebhookTriggers.onLeadQualified(leadData, 'current-user-id')
}

// Inicializar integrações
export function initializeWebhookIntegrations() {
  if (typeof window !== 'undefined') {
    integrateFormWebhooks()
  }
}