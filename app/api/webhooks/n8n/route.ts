import crypto from "crypto"

function verifySignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false
  const h = crypto.createHmac("sha256", secret).update(rawBody).digest("hex")
  const provided = signature.replace(/^sha256=/i, "")
  return crypto.timingSafeEqual(Buffer.from(h), Buffer.from(provided))
}

export async function POST(req: Request) {
  const secret = process.env.N8N_HMAC_SECRET
  const raw = await req.text()
  const sig = req.headers.get("x-webhook-signature")
  if (!secret || !verifySignature(raw, sig, secret)) {
    return new Response(JSON.stringify({ error: "invalid signature" }), { status: 401 })
  }
  const data = JSON.parse(raw)
  // TODO: persist into DB or trigger internal events
  return new Response(JSON.stringify({ ok: true, received: data }), { status: 200 })
}
