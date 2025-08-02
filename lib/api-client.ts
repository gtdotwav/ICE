/**
 * Cliente para APIs do IceFunnel
 * Facilita a integração com todas as APIs do sistema
 */

class IceFunnelAPI {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = '', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/api${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Formulários
  async submitForm(formData: {
    formId: string
    fields: Record<string, any>
    userId?: string
    source?: string
  }) {
    return this.request('/forms/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
  }

  // Conversões de Funil
  async trackConversion(conversionData: {
    funnelId: string
    stepId: string
    leadId?: string
    value?: number
    userId?: string
    previousSteps?: string[]
  }) {
    return this.request('/funnels/conversion', {
      method: 'POST',
      body: JSON.stringify(conversionData),
    })
  }

  // Qualificação de Leads
  async qualifyLead(leadData: {
    id?: string
    email: string
    name?: string
    score?: number
    criteria?: string[]
    source?: string
    tags?: string[]
    userId?: string
  }) {
    return this.request('/leads/qualify', {
      method: 'POST',
      body: JSON.stringify(leadData),
    })
  }

  // Pagamentos
  async completePayment(paymentData: {
    id?: string
    amount: number
    currency?: string
    customerId: string
    productId?: string
    paymentMethod?: string
    userId?: string
  }) {
    return this.request('/payments/complete', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    })
  }

  // Registro de Usuários
  async registerUser(userData: {
    id?: string
    email: string
    name: string
    source?: string
    plan?: string
  }) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // Webhooks
  async createWebhook(webhookData: {
    name: string
    url: string
    events: string[]
    maxAttempts?: number
    initialDelay?: number
    headers?: Record<string, string>
    userId: string
  }) {
    return this.request('/webhooks/config', {
      method: 'POST',
      body: JSON.stringify(webhookData),
    })
  }

  async listWebhooks(userId: string) {
    return this.request(`/webhooks/config?userId=${userId}`)
  }

  async testWebhook(webhookId: string, testPayload?: any) {
    return this.request('/webhooks/test', {
      method: 'POST',
      body: JSON.stringify({ webhookId, testPayload }),
    })
  }

  async triggerWebhook(event: string, data: any, userId: string) {
    return this.request('/webhooks/outgoing', {
      method: 'POST',
      body: JSON.stringify({ event, data, userId }),
    })
  }
}

// Instância global para uso fácil
export const iceFunnelAPI = new IceFunnelAPI()

// Hook para React
export function useIceFunnelAPI() {
  return iceFunnelAPI
}

// Funções de conveniência
export const API = {
  // Formulários
  submitForm: (formData: any) => iceFunnelAPI.submitForm(formData),
  
  // Conversões
  trackConversion: (data: any) => iceFunnelAPI.trackConversion(data),
  
  // Leads
  qualifyLead: (data: any) => iceFunnelAPI.qualifyLead(data),
  
  // Pagamentos
  completePayment: (data: any) => iceFunnelAPI.completePayment(data),
  
  // Usuários
  registerUser: (data: any) => iceFunnelAPI.registerUser(data),
  
  // Webhooks
  createWebhook: (data: any) => iceFunnelAPI.createWebhook(data),
  listWebhooks: (userId: string) => iceFunnelAPI.listWebhooks(userId),
  testWebhook: (webhookId: string, payload?: any) => iceFunnelAPI.testWebhook(webhookId, payload),
  triggerWebhook: (event: string, data: any, userId: string) => iceFunnelAPI.triggerWebhook(event, data, userId),
}

export default iceFunnelAPI