import { NextRequest, NextResponse } from 'next/server'
import { WebhookTriggers } from '@/lib/webhooks/webhook-triggers'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    // Validar dados obrigatórios
    if (!formData.fields || !formData.formId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: formId, fields' },
        { status: 400 }
      )
    }

    // Processar dados do formulário
    const processedData = {
      formId: formData.formId,
      fields: formData.fields,
      submittedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      source: formData.source || 'direct'
    }

    // Simular salvamento no banco de dados
    console.log('Form submitted:', processedData)

    // Disparar webhook automaticamente
    await WebhookTriggers.onFormSubmitted(processedData, formData.userId || 'anonymous')

    return NextResponse.json({
      success: true,
      id: `form_${Date.now()}`,
      message: 'Formulário enviado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao processar formulário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}