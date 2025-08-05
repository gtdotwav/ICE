import { NextRequest, NextResponse } from 'next/server'
import { WebhookTriggers } from '@/lib/webhooks/webhook-triggers'

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    
    // Validar dados obrigatórios
    if (!userData.email || !userData.name) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: email, name' },
        { status: 400 }
      )
    }

    // Processar registro do usuário
    const processedData = {
      userId: userData.id || `user_${Date.now()}`,
      email: userData.email,
      name: userData.name,
      registeredAt: new Date().toISOString(),
      source: userData.source || 'direct',
      plan: userData.plan || 'free'
    }

    // Simular salvamento no banco de dados
    console.log('User registered:', processedData)

    // Disparar webhook automaticamente
    await WebhookTriggers.onUserRegistered(processedData, processedData.userId)

    return NextResponse.json({
      success: true,
      userId: processedData.userId,
      message: 'Usuário registrado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
