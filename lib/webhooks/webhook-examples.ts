/**
 * Exemplos de uso do sistema de webhooks
 */

import { WebhookTriggers } from './webhook-triggers'

// Exemplo 1: Disparar webhook quando formulário é submetido
export async function handleFormSubmission(formData: any, userId: string) {
  try {
    // Processar dados do formulário
    const processedData = {
      formId: formData.id,
      fields: formData.fields,
      submittedAt: new Date().toISOString(),
      userAgent: formData.userAgent,
      ipAddress: formData.ipAddress,
      source: formData.source || 'direct'
    }

    // Salvar no banco de dados
    // await saveFormSubmission(processedData)

    // Disparar webhook
    await WebhookTriggers.onFormSubmitted(processedData, userId)

    return { success: true, id: processedData.formId }
  } catch (error) {
    console.error('Erro ao processar submissão:', error)
    throw error
  }
}

// Exemplo 2: Disparar webhook quando há conversão no funil
export async function handleFunnelConversion(conversionData: any, userId: string) {
  try {
    const processedData = {
      funnelId: conversionData.funnelId,
      stepId: conversionData.stepId,
      leadId: conversionData.leadId,
      value: conversionData.value,
      convertedAt: new Date().toISOString(),
      previousSteps: conversionData.previousSteps || []
    }

    // Atualizar métricas do funil
    // await updateFunnelMetrics(processedData)

    // Disparar webhook
    await WebhookTriggers.onFunnelConversion(processedData, userId)

    return { success: true, conversionId: processedData.leadId }
  } catch (error) {
    console.error('Erro ao processar conversão:', error)
    throw error
  }
}

// Exemplo 3: Processar webhook recebido de sistema externo
export async function handleIncomingWebhook(endpoint: string, payload: any) {
  try {
    // Exemplo de payload recebido do Zapier
    const zapierPayload = {
      event: 'lead_created',
      data: {
        email: payload.email,
        name: payload.name,
        source: 'zapier',
        tags: payload.tags || []
      }
    }

    // Mapear para evento interno
    const internalEvent = 'lead.qualified'
    const internalData = {
      email: zapierPayload.data.email,
      name: zapierPayload.data.name,
      source: zapierPayload.data.source,
      score: 75, // Score padrão para leads do Zapier
      qualifiedAt: new Date().toISOString(),
      tags: zapierPayload.data.tags
    }

    // Processar no sistema
    // await createQualifiedLead(internalData)

    return { success: true, processed: true }
  } catch (error) {
    console.error('Erro ao processar webhook recebido:', error)
    throw error
  }
}

// Exemplo 4: Payload de webhook para diferentes eventos
export const webhookPayloadExamples = {
  'form.submitted': {
    id: 'wh_1234567890',
    event: 'form.submitted',
    timestamp: '2024-01-20T10:30:00Z',
    data: {
      formId: 'form_123',
      fields: {
        name: 'João Silva',
        email: 'joao@exemplo.com',
        phone: '+55 11 99999-9999',
        company: 'Empresa XYZ'
      },
      submittedAt: '2024-01-20T10:30:00Z',
      userAgent: 'Mozilla/5.0...',
      ipAddress: '192.168.1.100',
      source: 'landing_page'
    },
    source: 'hiasflow',
    version: '1.0'
  },

  'funnel.conversion': {
    id: 'wh_1234567891',
    event: 'funnel.conversion',
    timestamp: '2024-01-20T10:35:00Z',
    data: {
      funnelId: 'funnel_456',
      stepId: 'step_checkout',
      leadId: 'lead_789',
      value: 297.00,
      convertedAt: '2024-01-20T10:35:00Z',
      previousSteps: ['step_landing', 'step_video', 'step_form']
    },
    source: 'hiasflow',
    version: '1.0'
  },

  'payment.completed': {
    id: 'wh_1234567892',
    event: 'payment.completed',
    timestamp: '2024-01-20T10:40:00Z',
    data: {
      paymentId: 'pay_123456',
      amount: 297.00,
      currency: 'BRL',
      customerId: 'cust_789',
      productId: 'prod_456',
      completedAt: '2024-01-20T10:40:00Z',
      paymentMethod: 'credit_card'
    },
    source: 'hiasflow',
    version: '1.0'
  }
}

// Exemplo 5: Headers de segurança para webhook
export const webhookSecurityHeaders = {
  'Content-Type': 'application/json',
  'X-Webhook-Signature': 'sha256=a1b2c3d4e5f6...',
  'X-Webhook-Event': 'form.submitted',
  'X-Webhook-ID': 'wh_1234567890',
  'X-Webhook-Timestamp': '2024-01-20T10:30:00Z',
  'User-Agent': 'HiasFlow-Webhooks/1.0'
}