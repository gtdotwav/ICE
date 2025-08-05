import { type NextRequest, NextResponse } from "next/server"
import { WebhookTriggers } from "@/lib/webhooks/webhook-triggers"

/**
 * Endpoint para receber callbacks de automações de IA
 */
export async function POST(request: NextRequest) {
  try {
    // Obter dados do corpo da requisição
    const callbackData = await request.json()

    // Obter assinatura do cabeçalho
    const signature = request.headers.get("X-Webhook-Signature") || ""

    // Validar assinatura (em produção)
    // if (!AIAutomationWebhooks.verifySignature(callbackData, signature)) {
    //   return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 })
    // }

    // Validar dados mínimos necessários
    if (!callbackData.request_id || !callbackData.automation_type) {
      return NextResponse.json({ error: "Dados de callback inválidos" }, { status: 400 })
    }

    // Processar o resultado da automação
    console.log("Callback de automação recebido:", callbackData)

    // Disparar evento de automação completada
    await WebhookTriggers.onAIAutomationCompleted(callbackData, callbackData.user_id || "system")

    // Retornar resposta de sucesso
    return NextResponse.json({
      success: true,
      message: "Callback processado com sucesso",
      request_id: callbackData.request_id,
    })
  } catch (error) {
    console.error("Erro ao processar callback de automação:", error)
    return NextResponse.json(
      {
        error: "Erro ao processar callback",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
