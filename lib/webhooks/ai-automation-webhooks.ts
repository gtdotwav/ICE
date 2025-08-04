/**
 * AI Automation Webhook System
 * Handles outgoing webhooks for AI automation requests and incoming responses
 */

import { WebhookService } from './webhook-service'
import { nanoid } from 'nanoid'

export interface AIAutomationRequest {
  type: 'copywriter' | 'images' | 'videos' | 'email'
  prompt: string
  context: Record<string, any>
  userId: string
  userEmail?: string
}

export interface AIAutomationWebhookPayload {
  event_type: 'ai_automation_requested'
  request_id: string
  user_id: string
  timestamp: string
  automation_details: {
    type: string
    prompt: string
    context: Record<string, any>
  }
  callback_config: {
    return_url: string
    user_interface_url: string
    notification_email?: string
  }
}

export interface AIAutomationResponse {
  success: boolean
  request_id: string
  automation_type: string
  result: {
    content?: string
    metadata?: Record<string, any>
  }
  files?: string[]
  timestamp: string
}

export class AIAutomationWebhooks {
  private webhookService: WebhookService
  private pendingRequests: Map<string, AIAutomationRequest> = new Map()

  constructor() {
    this.webhookService = new WebhookService()
  }

  /**
   * Dispara webhook quando usuário solicita automação de IA
   */
  async requestAIAutomation(request: AIAutomationRequest): Promise<string> {
    const requestId = this.generateRequestId()
    
    // Armazena a solicitação para referência futura
    this.pendingRequests.set(requestId, request)

    // Prepara o payload do webhook
    const payload: AIAutomationWebhookPayload = {
      event_type: 'ai_automation_requested',
      request_id: requestId,
      user_id: request.userId,
      timestamp: new Date().toISOString(),
      automation_details: {
        type: request.type,
        prompt: request.prompt,
        context: this.formatContextByType(request.type, request.context)
      },
      callback_config: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/ai-automation/callback`,
        user_interface_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/ia`,
        notification_email: request.userEmail
      }
    }

    // Envia webhook para sistema de automação externo
    await this.sendToAutomationSystem(payload)

    return requestId
  }

  /**
   * Processa resposta do sistema de automação
   */
  async processAutomationResponse(response: AIAutomationResponse): Promise<void> {
    const originalRequest = this.pendingRequests.get(response.request_id)
    
    if (!originalRequest) {
      console.error('Request not found for response:', response.request_id)
      return
    }

    // Remove da lista de pendentes
    this.pendingRequests.delete(response.request_id)

    // Salva o resultado no sistema
    await this.saveAutomationResult(response, originalRequest)

    // Notifica o usuário via webhook interno
    await this.webhookService.triggerWebhook('ai_automation_completed', {
      requestId: response.request_id,
      automationType: response.automation_type,
      success: response.success,
      result: response.result,
      files: response.files || [],
      userId: originalRequest.userId
    }, originalRequest.userId)
  }

  /**
   * Formata contexto específico por tipo de automação
   */
  private formatContextByType(type: string, context: Record<string, any>): Record<string, any> {
    switch (type) {
      case 'copywriter':
        return {
          copy_type: context.copyType || 'headline',
          target_audience: context.targetAudience || '',
          tone: context.tone || 'professional',
          product_name: context.productName || '',
          length: context.length || 'medium',
          ...context
        }

      case 'images':
        return {
          style: context.style || 'professional',
          dimensions: context.dimensions || '1024x1024',
          format: context.format || 'png',
          quantity: context.quantity || 1,
          ...context
        }

      case 'videos':
        return {
          duration: context.duration || 30,
          style: context.style || 'promotional',
          voice_type: context.voiceType || 'professional',
          include_music: context.includeMusic || true,
          ...context
        }

      case 'email':
        return {
          email_type: context.emailType || 'marketing',
          target_audience: context.targetAudience || '',
          tone: context.tone || 'professional',
          call_to_action: context.callToAction || '',
          ...context
        }

      default:
        return context
    }
  }

  /**
   * Envia webhook para sistema de automação externo
   */
  private async sendToAutomationSystem(payload: AIAutomationWebhookPayload): Promise<void> {
    const automationSystemUrl = process.env.AI_AUTOMATION_WEBHOOK_URL || 'https://meu-sistema-automacao.com/webhook/icefunnel'
    
    try {
      const response = await fetch(automationSystemUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Source': 'icefunnel',
          'X-Request-ID': payload.request_id
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      console.log('AI automation webhook sent successfully:', payload.request_id)
    } catch (error) {
      console.error('Failed to send AI automation webhook:', error)
      throw error
    }
  }

  /**
   * Salva resultado da automação no sistema
   */
  private async saveAutomationResult(response: AIAutomationResponse, originalRequest: AIAutomationRequest): Promise<void> {
    // Em produção, salvar no banco de dados
    console.log('Saving AI automation result:', {
      requestId: response.request_id,
      type: response.automation_type,
      success: response.success,
      result: response.result,
      files: response.files,
      userId: originalRequest.userId
    })

    // Aqui você implementaria a lógica para salvar no banco de dados
    // Por exemplo: await dbOps.create('ai_automation_results', resultData)
  }

  /**
   * Gera ID único para solicitação
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${nanoid(8)}`
  }

  /**
   * Obtém solicitações pendentes para um usuário
   */
  getPendingRequests(userId: string): AIAutomationRequest[] {
    return Array.from(this.pendingRequests.values()).filter(req => req.userId === userId)
  }

  /**
   * Cancela solicitação pendente
   */
  cancelRequest(requestId: string): boolean {
    return this.pendingRequests.delete(requestId)
  }
}

// Export singleton instance
export const aiAutomationWebhooks = new AIAutomationWebhooks()