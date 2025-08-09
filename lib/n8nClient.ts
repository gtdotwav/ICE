import crypto from "crypto"

export const N8N_BASE_URL = process.env.N8N_BASE_URL!
const PREFIX = process.env.N8N_WEBHOOK_PREFIX || "webhook"
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || ""
const N8N_HMAC_SECRET = process.env.N8N_HMAC_SECRET || ""

function buildUrl(path: string, search?: string) {
  const clean = path.startsWith("/") ? path : `/${path}`
  const query = search ? (search.startsWith("?") ? search : `?${search}`) : ""
  return `${N8N_BASE_URL}/${PREFIX}${clean}${query}`
}

function hmac(body: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(body).digest("hex")
}

/**
 * Forwards an incoming API request to an n8n Webhook endpoint.
 * - Adds x-internal-api-key
 * - Optionally signs the body with x-webhook-signature
 */
export async function n8nForward(req: Request, path: string) {
  const target = buildUrl(path, new URL(req.url).search)
  const method = req.method.toUpperCase()

  // Only include body for payload methods.
  const rawBody = method === "GET" || method === "HEAD" ? "" : await req.text()

  const headers: Record<string, string> = {
    "Content-Type": req.headers.get("content-type") || "application/json",
    "x-internal-api-key": INTERNAL_API_KEY,
    "x-forwarded-user-agent": req.headers.get("user-agent") || "",
    "x-forwarded-ip": req.headers.get("x-forwarded-for") || "",
  }

  if (N8N_HMAC_SECRET && rawBody) {
    headers["x-webhook-signature"] = hmac(rawBody, N8N_HMAC_SECRET)
  }

  const resp = await fetch(target, {
    method,
    headers,
    body: rawBody || undefined,
    redirect: "manual",
  })

  const text = await resp.text()
  return new Response(text, {
    status: resp.status,
    headers: {
      "content-type": resp.headers.get("content-type") || "application/json",
    },
  })
}
