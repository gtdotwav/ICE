import { NextRequest, NextResponse } from 'next/server'
import { WebhookService } from '@/lib/webhooks/webhook-service'

const webhookService = new WebhookService()

/**
 * Endpoint para receber webhooks de sistemas externos
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { endpoint: string } }
) {
  const startTime = Date.now()
  
  try {
    const { endpoint } = params
    const signature = request.headers.get('x-webhook-signature') || ''
    const payload = await request.json()

    // Valida assinatura
    const isValid = await webhookService.validateIncomingWebhook(
      endpoint,
      signature,
      payload
    )

    if (!isValid) {
      return NextResponse.json(
        { error: 'Assinatura inválida ou webhook não configurado' },
        { status: 401 }
      )
    }

    // Processa webhook
    await webhookService.processIncomingWebhook(endpoint, payload)

    return NextResponse.json({ 
      success: true,
      message: 'Webhook processado com sucesso',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro ao processar webhook recebido:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro ao processar webhook',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * Endpoint para validar configuração de webhook (GET)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { endpoint: string } }
) {
  try {
    const { endpoint } = params
    
    // Verifica se o endpoint está configurado
    // const config = await getIncomingWebhookConfig(endpoint)
    
    return NextResponse.json({
      endpoint,
      status: 'active',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Endpoint não encontrado' },
      { status: 404 }
    )
  }
}