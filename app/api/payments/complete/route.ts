import { NextRequest, NextResponse } from 'next/server'
import { WebhookTriggers } from '@/lib/webhooks/webhook-triggers'

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json()
    
    // Validar dados obrigatórios
    if (!paymentData.amount || !paymentData.customerId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: amount, customerId' },
        { status: 400 }
      )
    }

    // Processar pagamento
    const processedData = {
      paymentId: paymentData.id || `pay_${Date.now()}`,
      amount: paymentData.amount,
      currency: paymentData.currency || 'BRL',
      customerId: paymentData.customerId,
      productId: paymentData.productId || 'unknown',
      completedAt: new Date().toISOString(),
      paymentMethod: paymentData.paymentMethod || 'credit_card',
      status: 'completed'
    }

    // Simular salvamento no banco de dados
    console.log('Payment completed:', processedData)

    // Disparar webhook automaticamente
    await WebhookTriggers.onPaymentCompleted(processedData, paymentData.userId || 'anonymous')

    return NextResponse.json({
      success: true,
      paymentId: processedData.paymentId,
      message: 'Pagamento processado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}