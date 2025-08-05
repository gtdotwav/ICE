import { type NextRequest, NextResponse } from "next/server"

/**
 * Endpoint para consultar o status de uma automação de IA
 */
export async function GET(request: NextRequest, { params }: { params: { requestId: string } }) {
  try {
    const requestId = params.requestId

    if (!requestId) {
      return NextResponse.json({ error: "ID da solicitação não fornecido" }, { status: 400 })
    }

    // Em um ambiente real, consultaríamos o banco de dados ou um serviço externo
    // para obter o status atual da automação

    // Simulação de resposta para fins de demonstração
    const mockStatus = {
      request_id: requestId,
      status: Math.random() > 0.3 ? "completed" : "processing",
      automation_type: getRandomType(),
      created_at: new Date(Date.now() - 60000).toISOString(),
      updated_at: new Date().toISOString(),
      result:
        Math.random() > 0.3
          ? {
              content: "Conteúdo gerado pela automação de IA",
              metadata: {
                processing_time: "2.5s",
                tokens_used: 150,
              },
            }
          : null,
      estimated_completion: new Date(Date.now() + 30000).toISOString(),
    }

    return NextResponse.json(mockStatus)
  } catch (error) {
    console.error("Erro ao consultar status da automação:", error)
    return NextResponse.json(
      {
        error: "Erro ao consultar status",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

function getRandomType() {
  const types = ["copywriter", "images", "videos", "email"]
  return types[Math.floor(Math.random() * types.length)]
}
