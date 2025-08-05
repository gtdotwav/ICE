import { NextRequest, NextResponse } from 'next/server'
import { WebhookTriggers } from '@/lib/webhooks/webhook-triggers'

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json()
    
    // Validar dados obrigatórios
    if (!leadData.email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Processar qualificação do lead
    const processedData = {
      leadId: leadData.id || `lead_${Date.now()}`,
      email: leadData.email,
      name: leadData.name || '',
      score: leadData.score || 75,
      qualificationCriteria: leadData.criteria || ['form_submitted'],
      qualifiedAt: new Date().toISOString(),
      source: leadData.source || 'direct',
      tags: leadData.tags || []
    }

    // Simular salvamento no banco de dados
    console.log('Lead qualified:', processedData)

    // Disparar webhook automaticamente
    await WebhookTriggers.onLeadQualified(processedData, leadData.userId || 'anonymous')

    return NextResponse.json({
      success: true,
      leadId: processedData.leadId,
      score: processedData.score,
      message: 'Lead qualificado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao qualificar lead:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
