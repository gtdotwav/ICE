import { NextRequest, NextResponse } from 'next/server'
import { WebhookSecurity } from '@/lib/webhooks/webhook-security'
import { nanoid } from 'nanoid'

const security = new WebhookSecurity()

/**
 * API para gerenciar configurações de webhook
 */
export async function POST(request: NextRequest) {
  try {
    const config = await request.json()
    
    // Valida dados obrigatórios
    if (!config.name || !config.url || !config.events) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, url, events' },
        { status: 400 }
      )
    }

    // Valida URL
    if (!security.validateWebhookUrl(config.url)) {
      return NextResponse.json(
        { error: 'URL inválida ou não permitida' },
        { status: 400 }
      )
    }

    // Gera secret se não fornecido
    if (!config.secret) {
      config.secret = security.generateSecret()
    }

    // Configurações padrão
    const webhookConfig = {
      id: `wh_${nanoid()}`,
      name: config.name,
      url: config.url,
      events: config.events,
      secret: config.secret,
      isActive: true,
      retryConfig: {
        maxAttempts: config.maxAttempts || 3,
        backoffMultiplier: config.backoffMultiplier || 2,
        initialDelay: config.initialDelay || 5
      },
      headers: config.headers || {},
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: config.userId
    }

    // Salvar no banco de dados
    // await saveWebhookConfig(webhookConfig)

    return NextResponse.json({
      success: true,
      webhook: {
        ...webhookConfig,
        secret: `${config.secret.substring(0, 8)}...` // Não retorna secret completo
      }
    })

  } catch (error) {
    console.error('Erro ao criar webhook:', error)
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

    // Buscar configurações do usuário
    // const webhooks = await getWebhookConfigsByUser(userId)

    const webhooks = [] // Placeholder

    return NextResponse.json({ webhooks })

  } catch (error) {
    console.error('Erro ao buscar webhooks:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}