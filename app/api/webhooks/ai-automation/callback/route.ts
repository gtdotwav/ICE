import { NextRequest, NextResponse } from 'next/server'
import { aiAutomationWebhooks } from '@/lib/webhooks/ai-automation-webhooks'
import type { AIAutomationResponse } from '@/lib/webhooks/ai-automation-webhooks'

/**
 * Endpoint para receber respostas do sistema de automação de IA
 */
export async function POST(request: NextRequest) {
  try {
    const response: AIAutomationResponse = await request.json()
    
    // Validar dados obrigatórios
    if (!response.request_id || !response.automation_type) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: request_id, automation_type' },
        { status: 400 }
      )
    }

    // Processar resposta da automação
    await aiAutomationWebhooks.processAutomationResponse(response)

    return NextResponse.json({
      success: true,
      message: 'Resposta da automação processada com sucesso',
      request_id: response.request_id
    })

  } catch (error) {
    console.error('Erro ao processar resposta da automação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}