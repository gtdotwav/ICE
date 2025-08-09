import { type NextRequest, NextResponse } from "next/server"
import { AIAutomationWebhooks } from "@/lib/webhooks/ai-automation-webhooks"
import { z } from "zod"

const testRequestSchema = z.object({
  automation_type: z.enum(["copywriter", "images", "videos", "email"]),
  prompt: z.string().min(1),
  context: z.record(z.any()).optional(),
  user_id: z.string().default("test-user"),
  user_email: z.string().email().optional(),
  simulate_completion: z.boolean().default(true),
  simulate_delay: z.number().min(0).max(30).default(2), // segundos
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validationResult = testRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const { automation_type, prompt, context, user_id, user_email, simulate_completion, simulate_delay } =
      validationResult.data

    // Enviar webhook de solicitação
    const requestId = await AIAutomationWebhooks.sendAutomationRequest({
      type: automation_type,
      prompt,
      context,
      userId: user_id,
      userEmail: user_email,
    })

    // Se solicitado, simular a conclusão após um delay
    if (simulate_completion) {
      setTimeout(async () => {
        try {
          await simulateAutomationCompletion(requestId, automation_type, prompt)
        } catch (error) {
          console.error("Error simulating automation completion:", error)
        }
      }, simulate_delay * 1000)
    }

    return NextResponse.json({
      success: true,
      message: "Test webhook sent successfully",
      request_id: requestId,
      automation_type,
      prompt: prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""),
      estimated_completion: simulate_completion ? `${simulate_delay} seconds` : "Manual completion required",
      test_mode: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error sending test webhook:", error)

    return NextResponse.json(
      {
        error: "Failed to send test webhook",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

async function simulateAutomationCompletion(requestId: string, automationType: string, prompt: string) {
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/ai-automation/process`

  // Simular resultado baseado no tipo de automação
  const simulatedResult = generateSimulatedResult(automationType, prompt)

  const completionPayload = {
    event_type: "ai_automation_completed",
    request_id: requestId,
    user_id: "test-user",
    timestamp: new Date().toISOString(),
    automation_details: {
      type: automationType,
      prompt,
      context: {},
    },
    result: simulatedResult,
    callback_config: {
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/ai-automation/callback`,
      user_interface_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/ia`,
    },
  }

  // Enviar webhook de conclusão
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Signature": "test-signature",
      "X-Request-ID": requestId,
    },
    body: JSON.stringify(completionPayload),
  })

  if (!response.ok) {
    throw new Error(`Failed to send completion webhook: ${response.status}`)
  }

  console.log(`Simulated completion webhook sent for request ${requestId}`)
}

function generateSimulatedResult(automationType: string, prompt: string) {
  const baseMetadata = {
    processing_time: `${Math.random() * 5 + 1}s`,
    tokens_used: Math.floor(Math.random() * 1000 + 100),
    model_used: "gpt-4o",
    quality_score: Math.random() * 0.3 + 0.7, // 0.7 - 1.0
  }

  switch (automationType) {
    case "copywriter":
      return {
        content: `Este é um texto gerado pela IA baseado no prompt: "${prompt.substring(0, 50)}..."\n\nConteúdo simulado para demonstração do webhook de automação de IA. Em um cenário real, este seria o texto gerado pela ferramenta de copywriting.`,
        metadata: baseMetadata,
      }

    case "images":
      return {
        files: ["https://example.com/generated-image-1.jpg", "https://example.com/generated-image-2.jpg"],
        metadata: {
          ...baseMetadata,
          image_count: 2,
          resolution: "1024x1024",
          style: "realistic",
        },
      }

    case "videos":
      return {
        files: ["https://example.com/generated-video.mp4"],
        metadata: {
          ...baseMetadata,
          duration: "30s",
          resolution: "1920x1080",
          format: "mp4",
        },
      }

    case "email":
      return {
        content: `Assunto: Email gerado pela IA\n\nOlá!\n\nEste é um email gerado automaticamente baseado no prompt: "${prompt.substring(0, 50)}..."\n\nConteúdo do email simulado para demonstração.\n\nAtenciosamente,\nSistema de IA`,
        metadata: {
          ...baseMetadata,
          subject: "Email gerado pela IA",
          estimated_open_rate: "25%",
        },
      }

    default:
      return {
        content: `Resultado simulado para ${automationType}`,
        metadata: baseMetadata,
      }
  }
}

// Endpoint GET para informações sobre o teste
export async function GET() {
  return NextResponse.json({
    endpoint: "ai-automation-test",
    description: "Endpoint para testar webhooks de automação de IA",
    supported_types: ["copywriter", "images", "videos", "email"],
    parameters: {
      automation_type: "string (required)",
      prompt: "string (required)",
      context: "object (optional)",
      user_id: "string (optional, default: test-user)",
      user_email: "string (optional)",
      simulate_completion: "boolean (optional, default: true)",
      simulate_delay: "number (optional, default: 2, max: 30)",
    },
    example_request: {
      automation_type: "copywriter",
      prompt: "Escreva um texto de vendas para um curso de marketing digital",
      context: {
        target_audience: "empreendedores",
        tone: "profissional",
      },
      simulate_completion: true,
      simulate_delay: 3,
    },
  })
}
