// Catch-all API that proxies to n8n with allowlist + same-origin guard
import { n8nForward } from "@/lib/n8nClient"

const ALLOWLIST: RegExp[] = [
  /^\/api\/users\/register$/,
  /^\/api\/forms\/submit$/,
  /^\/api\/leads\/qualify$/,
  /^\/api\/payments\/complete$/,
  /^\/api\/ai\/copywriter$/,
  /^\/api\/ai-automation\/request$/,
  /^\/api\/ai\/metrics$/,
  /^\/api\/analytics\/events$/,
  /^\/api\/analytics\/web-vitals$/,
  /^\/api\/metrics$/,
  /^\/api\/monitoring\/metrics$/,
  /^\/api\/products$/,
  /^\/api\/funnels$/,
  /^\/api\/funnels\/stats$/,
  /^\/api\/ai\/page-generate$/, // Preview generation (Studio)
  /^\/api\/funnels\/create$/, // Create funnel + page (Studio)
  /^\/api\/webhooks(\/.*)?$/,
]

function requireSameOrigin(req: Request) {
  const origin = req.headers.get("origin")
  const host = req.headers.get("host")
  if (!origin || !host) return false
  try {
    const u = new URL(origin)
    return u.host === host
  } catch {
    return false
  }
}

function assertAllowed(pathname: string) {
  const ok = ALLOWLIST.some((rx) => rx.test(pathname))
  if (!ok) throw new Error(`Path not allowed: ${pathname}`)
}

async function handle(req: Request) {
  if (!requireSameOrigin(req)) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })
  }
  const url = new URL(req.url)
  const parts = url.pathname.split("/").slice(1)
  const idxApi = parts.indexOf("api")
  const forwardPath = `/${parts.slice(idxApi).join("/")}`
  assertAllowed(forwardPath)
  return n8nForward(req, forwardPath)
}

export async function GET(req: Request) {
  return handle(req)
}
export async function POST(req: Request) {
  return handle(req)
}
export async function PUT(req: Request) {
  return handle(req)
}
export async function PATCH(req: Request) {
  return handle(req)
}
export async function DELETE(req: Request) {
  return handle(req)
}
export async function OPTIONS(req: Request) {
  return handle(req)
}
