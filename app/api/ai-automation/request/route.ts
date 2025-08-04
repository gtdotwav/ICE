import { NextRequest, NextResponse } from 'next/server'
import { aiAutomationWebhooks } from '@/lib/webhooks/ai-automation-webhooks'
import type { AIAutomationRequest } from '@/lib/webhooks/ai-automation-webhooks'

// Webhook endpoint para n8n
const N8N_WEBHOOK_URL = 'https://duduquadrado.app.n8n.cloud/webhook-test/b488f551-9141-422f-9a7e-10347ef87506'

/**
 * API para solicitar automação de IA
 */
export async function POST(request: NextRequest) {
  try {
    const requestData: AIAutomationRequest = await request.json()
    
    // Validar dados obrigatórios
    if (!requestData.type || !requestData.prompt || !requestData.userId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: type, prompt, userId' },
        { status: 400 }
      )
    }

    // Validar tipo de automação
    const validTypes = ['copywriter', 'images', 'videos', 'email']
    if (!validTypes.includes(requestData.type)) {
      return NextResponse.json(
        { error: 'Tipo de automação inválido' },
        { status: 400 }
      )
    }

    // Preparar payload para n8n
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const webhookPayload = {
      request_id: requestId,
      type: requestData.type,
      prompt: requestData.prompt,
      context: requestData.context || {},
      user_id: requestData.userId,
      timestamp: new Date().toISOString(),
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/ai-automation/callback`
    }

    // Enviar para n8n
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'hiasflow',
        'X-Request-ID': requestId,
        'X-Automation-Type': requestData.type
      },
      body: JSON.stringify(webhookPayload)
    })

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`)
    }

    return NextResponse.json({
      success: true,
      request_id: requestId,
      message: 'Solicitação de automação enviada com sucesso',
      estimated_time: getEstimatedTime(requestData.type),
      webhook_sent: true
    })

  } catch (error) {
    console.error('Erro ao solicitar automação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function getEstimatedTime(type: string): string {
  switch (type) {
    case 'copywriter':
      return '30-60 segundos'
    case 'images':
      return '2-3 minutos'
    case 'videos':
      return '5-10 minutos'
    case 'email':
      return '1-2 minutos'
    default:
      return '1-5 minutos'
  }
}