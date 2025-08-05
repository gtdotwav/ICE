import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Obter dados do corpo da requisição
    const webhookData = await request.json()

    // Validar dados mínimos necessários
    if (!webhookData.event_type || !webhookData.automation_details?.type) {
      return NextResponse.json({ error: "Dados de webhook inválidos" }, { status: 400 })
    }

    // Simular processamento do webhook
    console.log("Webhook de teste recebido:", webhookData)

    // Simular resposta de sucesso
    const responseData = {
      success: true,
      received_at: new Date().toISOString(),
      request_id: webhookData.request_id || `req_${Date.now()}`,
      event_type: webhookData.event_type,
      automation_type: webhookData.automation_details.type,
      status: "received",
      message: "Webhook recebido com sucesso e será processado",
      estimated_processing_time: getEstimatedTime(webhookData.automation_details.type),
      webhook_signature: "sim_" + Buffer.from(Date.now().toString()).toString("base64").substring(0, 8),
    }

    // Retornar resposta de sucesso
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Erro ao processar webhook de teste:", error)
    return NextResponse.json(
      {
        error: "Erro ao processar webhook",
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
