import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const prompt: string | undefined = body?.prompt
  const tone: string | undefined = body?.tone || "neutro"
  const style: string | undefined = body?.style || "conciso"

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Prompt é obrigatório" }, { status: 400 })
  }

  // Stub de geração
  const headline = `Eleve suas conversões hoje: ${prompt.slice(0, 50)}...`
  const description = `Em um tom ${tone} e estilo ${style}, nossa IA recomenda: ${prompt}`

  return NextResponse.json({
    headline,
    description,
    costCredits: 10,
  })
}
