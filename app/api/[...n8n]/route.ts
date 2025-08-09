import { n8nForward } from "@/lib/n8nClient"

// Allowlist of app API paths to forward to n8n.
const ALLOWLIST: RegExp[] = [
  /^\/api\/users\/register$/,
  /^\/api\/forms\/submit$/,
  /^\/api\/leads\/qualify$/,
  /^\/api\/payments\/complete$/,
  /^\/api\/ai\/copywriter$/,
  /^\/api\/ai-automation\/request$/,
  /^\/api\/analytics\/events$/,
  /^\/api\/analytics\/web-vitals$/,
  /^\/api\/metrics$/,
  /^\/api\/monitoring\/metrics$/,
  /^\/api\/products$/,
  /^\/api\/funnels$/,
  /^\/api\/funnels\/generate$/, // Added route for funnel generation
  /^\/api\/funnels\/stats$/,
  /^\/api\/webhooks(\/.*)?$/,
]

// Simple protection: only accept calls from same origin.
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
  if (ALLOWLIST.length === 0) return
  const ok = ALLOWLIST.some((rx) => rx.test(pathname))
  if (!ok) throw new Error(`Path not allowed: ${pathname}`)
}

async function handle(req: Request) {
  if (!requireSameOrigin(req)) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 })
  }
  const url = new URL(req.url)
  // Rebuild the path starting at /api/...
  const parts = url.pathname.split("/").slice(1) // ["api", ...]
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
