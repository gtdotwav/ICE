import { NextRequest, NextResponse } from 'next/server'
import { WebhookTriggers } from '@/lib/webhooks/webhook-triggers'

export async function POST(request: NextRequest) {
  try {
    const conversionData = await request.json()
    
    // Validar dados obrigatórios
    if (!conversionData.funnelId || !conversionData.stepId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: funnelId, stepId' },
        { status: 400 }
      )
    }

    // Processar conversão
    const processedData = {
      funnelId: conversionData.funnelId,
      stepId: conversionData.stepId,
      leadId: conversionData.leadId || `lead_${Date.now()}`,
      value: conversionData.value || 0,
      convertedAt: new Date().toISOString(),
      previousSteps: conversionData.previousSteps || []
    }

    // Simular salvamento no banco de dados
    console.log('Funnel conversion:', processedData)

    // Disparar webhook automaticamente
    await WebhookTriggers.onFunnelConversion(processedData, conversionData.userId || 'anonymous')

    return NextResponse.json({
      success: true,
      conversionId: processedData.leadId,
      message: 'Conversão registrada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao processar conversão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
