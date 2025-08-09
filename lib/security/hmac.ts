/**
 * HMAC-SHA256 helpers for signing and verifying webhook payloads.
 * Works in Next.js Route Handlers on Node 18+.
 */
import crypto from "node:crypto"

/**
 * Create a hex-encoded HMAC-SHA256 signature.
 */
export function createSignature(body: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(body, "utf8").digest("hex")
}

/**
 * Constant-time verification of a signature header against a computed signature.
 */
export function verifySignature(body: string, secret: string, candidate: string): boolean {
  const expected = createSignature(body, secret)
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(candidate, "hex"))
  } catch {
    // Fallback if lengths differ
    return false
  }
}
