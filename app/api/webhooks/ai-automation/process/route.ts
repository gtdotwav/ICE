import { type NextRequest, NextResponse } from "next/server"
import { WebhookSecurity } from "@/lib/webhooks/webhook-security"
import { db } from "@/lib/database/operations"
import { WebhookLogger } from "@/lib/webhooks/webhook-logger"
import { z } from "zod"

// Schema de validação para o payload do webhook
const aiAutomationPayloadSchema = z.object({
  event_type: z.enum(["ai_automation_requested", "ai_automation_completed", "ai_automation_failed"]),
  request_id: z.string().min(1),
  user_id: z.string().min(1),
  timestamp: z.string(),
  automation_details: z.object({
    type: z.enum(["copywriter", "images", "videos", "email"]),
    prompt: z.string().min(1),
    context: z.record(z.any()).optional(),
  }),
  result: z
    .object({
      content: z.string().optional(),
      files: z.array(z.string()).optional(),
      metadata: z
        .object({
          processing_time: z.string().optional(),
          tokens_used: z.number().optional(),
          model_used: z.string().optional(),
          quality_score: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
      details: z.record(z.any()).optional(),
    })
    .optional(),
  callback_config: z
    .object({
      return_url: z.string().url(),
      user_interface_url: z.string().url(),
      notification_email: z.string().email().optional(),
    })
    .optional(),
})

type AIAutomationPayload = z.infer<typeof aiAutomationPayloadSchema>

const webhookSecurity = new WebhookSecurity()
const webhookLogger = new WebhookLogger()

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Verificar assinatura do webhook
    const signature = request.headers.get("x-webhook-signature") || ""
    const rawBody = await request.text()

    let payload: AIAutomationPayload
    try {
      payload = JSON.parse(rawBody)
    } catch (error) {
      return NextResponse.json(
        {
          error: "Invalid JSON payload",
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    // Validar estrutura do payload
    const validationResult = aiAutomationPayloadSchema.safeParse(payload)
    if (!validationResult.success) {
      await webhookLogger.logIncomingError(
        "ai-automation-process",
        Date.now() - startTime,
        new Error(`Validation failed: ${validationResult.error.message}`),
        payload,
      )

      return NextResponse.json(
        {
          error: "Invalid payload structure",
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    // Verificar assinatura (se configurada)
    const webhookSecret = process.env.AI_AUTOMATION_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      const isValidSignature = webhookSecurity.verifySignature(payload, signature, webhookSecret)
      if (!isValidSignature) {
        await webhookLogger.logIncomingError(
          "ai-automation-process",
          Date.now() - startTime,
          new Error("Invalid webhook signature"),
          payload,
        )

        return NextResponse.json(
          {
            error: "Invalid webhook signature",
            timestamp: new Date().toISOString(),
          },
          { status: 401 },
        )
      }
    }

    // Processar o webhook baseado no tipo de evento
    const result = await processAIAutomationWebhook(payload)

    const duration = Date.now() - startTime
    await webhookLogger.logIncomingSuccess("ai-automation-process", payload.event_type, duration, payload)

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      request_id: payload.request_id,
      processed_at: new Date().toISOString(),
      processing_time: `${duration}ms`,
      result,
    })
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    await webhookLogger.logIncomingError("ai-automation-process", duration, error as Error, {})

    console.error("Error processing AI automation webhook:", error)

    return NextResponse.json(
      {
        error: "Internal server error",
        message: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

async function processAIAutomationWebhook(payload: AIAutomationPayload) {
  const { event_type, request_id, user_id, automation_details, result, error } = payload

  switch (event_type) {
    case "ai_automation_requested":
      return await handleAutomationRequested(request_id, user_id, automation_details)

    case "ai_automation_completed":
      return await handleAutomationCompleted(request_id, user_id, automation_details, result)

    case "ai_automation_failed":
      return await handleAutomationFailed(request_id, user_id, automation_details, error)

    default:
      throw new Error(`Unknown event type: ${event_type}`)
  }
}

async function handleAutomationRequested(
  requestId: string,
  userId: string,
  automationDetails: AIAutomationPayload["automation_details"],
) {
  try {
    // Criar registro da solicitação no banco de dados
    const automationRequest = await db.createWebhookDelivery({
      webhook_config_id: "ai-automation-system",
      payload: {
        request_id: requestId,
        user_id: userId,
        automation_type: automationDetails.type,
        prompt: automationDetails.prompt,
        context: automationDetails.context || {},
        status: "processing",
      },
      status: "pending",
      attempts: 0,
    })

    // Aqui você pode adicionar lógica adicional, como:
    // - Notificar o usuário que a automação foi iniciada
    // - Atualizar estatísticas
    // - Disparar outros webhooks

    return {
      action: "automation_request_logged",
      automation_id: automationRequest.id,
      status: "processing",
    }
  } catch (error) {
    console.error("Error handling automation requested:", error)
    throw error
  }
}

async function handleAutomationCompleted(
  requestId: string,
  userId: string,
  automationDetails: AIAutomationPayload["automation_details"],
  result?: AIAutomationPayload["result"],
) {
  try {
    // Atualizar o status da automação no banco de dados
    // Aqui você implementaria a lógica para encontrar e atualizar o registro

    // Processar o resultado baseado no tipo de automação
    const processedResult = await processAutomationResult(automationDetails.type, result)

    // Notificar o usuário sobre a conclusão
    await notifyUserAutomationCompleted(userId, requestId, processedResult)

    return {
      action: "automation_completed",
      request_id: requestId,
      result: processedResult,
      status: "completed",
    }
  } catch (error) {
    console.error("Error handling automation completed:", error)
    throw error
  }
}

async function handleAutomationFailed(
  requestId: string,
  userId: string,
  automationDetails: AIAutomationPayload["automation_details"],
  error?: AIAutomationPayload["error"],
) {
  try {
    // Atualizar o status da automação no banco de dados
    // Implementar lógica de retry se necessário

    // Notificar o usuário sobre o erro
    await notifyUserAutomationFailed(userId, requestId, error)

    return {
      action: "automation_failed",
      request_id: requestId,
      error: error,
      status: "failed",
    }
  } catch (error) {
    console.error("Error handling automation failed:", error)
    throw error
  }
}

async function processAutomationResult(automationType: string, result?: AIAutomationPayload["result"]) {
  if (!result) return null

  switch (automationType) {
    case "copywriter":
      return {
        type: "text",
        content: result.content,
        metadata: result.metadata,
      }

    case "images":
      return {
        type: "images",
        files: result.files || [],
        metadata: result.metadata,
      }

    case "videos":
      return {
        type: "videos",
        files: result.files || [],
        metadata: result.metadata,
      }

    case "email":
      return {
        type: "email",
        content: result.content,
        metadata: result.metadata,
      }

    default:
      return result
  }
}

async function notifyUserAutomationCompleted(userId: string, requestId: string, result: any) {
  // Implementar notificação ao usuário
  // Pode ser via email, push notification, websocket, etc.
  console.log(`Automation completed for user ${userId}:`, { requestId, result })
}

async function notifyUserAutomationFailed(userId: string, requestId: string, error?: AIAutomationPayload["error"]) {
  // Implementar notificação de erro ao usuário
  console.log(`Automation failed for user ${userId}:`, { requestId, error })
}

// Endpoint GET para verificar status do webhook
export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "ai-automation-process",
    supported_events: ["ai_automation_requested", "ai_automation_completed", "ai_automation_failed"],
    timestamp: new Date().toISOString(),
  })
}
