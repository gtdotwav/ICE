import { NextRequest, NextResponse } from 'next/server'
import { WebhookService } from '@/lib/webhooks/webhook-service'

const webhookService = new WebhookService()

/**
 * API para testar webhook
 */
export async function POST(request: NextRequest) {
  try {
    const { webhookId, testPayload } = await request.json()

    if (!webhookId) {
      return NextResponse.json(
        { error: 'webhookId é obrigatório' },
        { status: 400 }
      )
    }

    // Payload de teste padrão
    const defaultTestPayload = {
      event: 'webhook.test',
      timestamp: new Date().toISOString(),
      data: {
        message: 'Este é um webhook de teste do IceFunnel',
        test: true,
        ...testPayload
      }
    }

    // Buscar configuração do webhook
    // const config = await getWebhookConfig(webhookId)
    
    // Simular envio de teste
    const testResult = {
      success: true,
      webhookId,
      testPayload: defaultTestPayload,
      timestamp: new Date().toISOString(),
      message: 'Webhook de teste enviado com sucesso'
    }

    return NextResponse.json(testResult)

  } catch (error) {
    console.error('Erro ao testar webhook:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao enviar webhook de teste',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}