import crypto from "crypto"
import { WebhookStore } from "../store"

// HMAC header per spec
const SIGN_HEADER = "X-IceFunnel-Signature"

function signBody(body: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(body).digest("hex")
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    id?: string
    event?: string
    samplePayload?: unknown
    forceSuccess?: boolean
  } | null

  if (!body?.id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 })
  }

  const webhook = WebhookStore.get(body.id)
  if (!webhook) {
    return new Response(JSON.stringify({ error: "Webhook not found" }), { status: 404 })
  }
  if (!webhook.active) {
    return new Response(JSON.stringify({ error: "Webhook is inactive" }), { status: 409 })
  }

  // Prepare payload
  const event = body.event || "webhook.test"
  const payload = body.samplePayload ?? {
    event,
    ts: new Date().toISOString(),
    example: true,
  }
  const raw = JSON.stringify(payload)

  const secret = webhook.secret || process.env.ICEFUNNEL_WEBHOOK_SECRET || "dev_secret"

  let success = body.forceSuccess ?? Math.random() > 0.2
  let respStatus: number | undefined
  let errMsg: string | undefined
  const started = Date.now()

  try {
    // Attempt to deliver to the target URL.
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      [SIGN_HEADER]: signBody(raw, secret),
    }
    const resp = await fetch(webhook.url, {
      method: "POST",
      headers,
      body: raw,
    })
    respStatus = resp.status
    // Consider success based on HTTP 2xx unless forceSuccess controls outcome.
    if (body.forceSuccess == null) success = resp.ok
  } catch (err: any) {
    errMsg = typeof err?.message === "string" ? err.message : "network_error"
    if (body.forceSuccess == null) success = false
  }

  const durationMs = Date.now() - started

  // Update stats and logs
  WebhookStore.updateStats(webhook.id, success)
  WebhookStore.addLog({
    id: crypto.randomUUID(),
    webhookId: webhook.id,
    timestamp: new Date().toISOString(),
    event,
    payload,
    status: success ? "success" : "error",
    durationMs,
    responseStatus: respStatus,
    error: errMsg,
  })

  const updated = WebhookStore.get(webhook.id)!
  return Response.json(
    {
      ok: success,
      webhook: {
        id: updated.id,
        stats: updated.stats,
        lastDeliveryAt: updated.stats.lastDeliveryAt,
      },
    },
    { status: success ? 200 : 502 },
  )
}
