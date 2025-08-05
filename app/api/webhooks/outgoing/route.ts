import { NextRequest, NextResponse } from 'next/server'
import { WebhookService } from '@/lib/webhooks/webhook-service'

const webhookService = new WebhookService()

/**
 * API para disparar webhooks manualmente (para testes)
 */
export async function POST(request: NextRequest) {
  try {
    const { event, data, userId } = await request.json()

    if (!event || !data || !userId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: event, data, userId' },
        { status: 400 }
      )
    }

    await webhookService.triggerWebhook(event, data, userId)

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook disparado com sucesso' 
    })

  } catch (error) {
    console.error('Erro ao disparar webhook:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * API para listar configurações de webhook
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      )
    }

    // Implementar busca das configurações do usuário
    const webhooks = [] // await getWebhookConfigs(userId)

    return NextResponse.json({ webhooks })

  } catch (error) {
    console.error('Erro ao buscar webhooks:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
