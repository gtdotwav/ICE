import { type NextRequest, NextResponse } from "next/server"
import { AIAutomationWebhooks } from "@/lib/webhooks/ai-automation-webhooks"
import type { AIAutomationRequest } from "@/lib/webhooks/ai-automation-webhooks"

/**
 * API para solicitar automação de IA
 */
export async function POST(request: NextRequest) {
  try {
    const requestData: AIAutomationRequest = await request.json()

    // Validar dados obrigatórios
    if (!requestData.type || !requestData.prompt || !requestData.userId) {
      return NextResponse.json({ error: "Campos obrigatórios: type, prompt, userId" }, { status: 400 })
    }

    // Validar tipo de automação
    const validTypes = ["copywriter", "images", "videos", "email"]
    if (!validTypes.includes(requestData.type)) {
      return NextResponse.json({ error: "Tipo de automação inválido" }, { status: 400 })
    }

    // Enviar solicitação via webhook
    const requestId = await AIAutomationWebhooks.sendAutomationRequest(requestData)

    return NextResponse.json({
      success: true,
      request_id: requestId,
      message: "Solicitação de automação enviada com sucesso",
      estimated_time: getEstimatedTime(requestData.type),
      webhook_sent: true,
      status_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/ai-automation/status/${requestId}`,
    })
  } catch (error) {
    console.error("Erro ao solicitar automação:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

function getEstimatedTime(type: string): string {
  switch (type) {
    case "copywriter":
      return "30-60 segundos"
    case "images":
      return "2-3 minutos"
    case "videos":
      return "5-10 minutos"
    case "email":
      return "1-2 minutos"
    default:
      return "1-5 minutos"
  }
}
