import { NextRequest, NextResponse } from 'next/server'
import { aiAutomationWebhooks } from '@/lib/webhooks/ai-automation-webhooks'

/**
 * API para verificar status de solicitação de automação
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const { requestId } = params
    
    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a solicitação ainda está pendente
    const pendingRequests = aiAutomationWebhooks.getPendingRequests('current-user-id')
    const isPending = pendingRequests.some(req => req.userId === 'current-user-id')

    // Em produção, você consultaria o banco de dados para obter o status real
    const status = isPending ? 'processing' : 'completed'

    return NextResponse.json({
      request_id: requestId,
      status,
      estimated_completion: isPending ? new Date(Date.now() + 60000).toISOString() : null,
      message: isPending ? 'Automação em processamento' : 'Automação concluída'
    })

  } catch (error) {
    console.error('Erro ao verificar status da automação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}