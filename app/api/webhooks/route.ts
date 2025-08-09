import { WebhookStore } from "./store"

export async function GET() {
  const items = WebhookStore.list()
  return Response.json({ data: items })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body || !body.name || !body.url || !Array.isArray(body.events)) {
    return new Response(JSON.stringify({ error: "Invalid body" }), { status: 400 })
  }
  const item = WebhookStore.create({
    name: body.name,
    url: body.url,
    events: body.events,
    active: body.active ?? true,
    secret: body.secret,
  })
  return new Response(JSON.stringify(item), { status: 201 })
}
