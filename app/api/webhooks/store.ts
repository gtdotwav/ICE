export type WebhookItem = {
  id: string
  name: string
  url: string
  events: string[]
  active: boolean
  secret?: string
  createdAt: string
  stats: {
    totalDeliveries: number
    totalSuccess: number
    totalFailures: number
    successRate: number // 0..1
    lastDeliveryAt?: string
  }
}

export type WebhookDeliveryLog = {
  id: string
  webhookId: string
  timestamp: string
  event: string
  payload: unknown
  status: "success" | "error"
  durationMs: number
  responseStatus?: number
  error?: string
}

const webhooks = new Map<string, WebhookItem>()
const logs: WebhookDeliveryLog[] = []

function recalcStats(item: WebhookItem) {
  const total = item.stats.totalDeliveries
  item.stats.successRate = total === 0 ? 0 : item.stats.totalSuccess / total
}

export const WebhookStore = {
  list(): WebhookItem[] {
    return Array.from(webhooks.values())
  },
  get(id: string): WebhookItem | undefined {
    return webhooks.get(id)
  },
  create(input: { name: string; url: string; events: string[]; active?: boolean; secret?: string }) {
    const id = crypto.randomUUID()
    const item: WebhookItem = {
      id,
      name: input.name,
      url: input.url,
      events: input.events,
      active: input.active ?? true,
      secret: input.secret,
      createdAt: new Date().toISOString(),
      stats: { totalDeliveries: 0, totalSuccess: 0, totalFailures: 0, successRate: 0, lastDeliveryAt: undefined },
    }
    webhooks.set(id, item)
    return item
  },
  upsert(item: WebhookItem) {
    webhooks.set(item.id, item)
  },
  addLog(entry: WebhookDeliveryLog) {
    logs.unshift(entry)
  },
  listLogs({ webhookId }: { webhookId?: string } = {}) {
    return webhookId ? logs.filter((l) => l.webhookId === webhookId) : logs
  },
  updateStats(id: string, success: boolean) {
    const item = webhooks.get(id)
    if (!item) return
    item.stats.totalDeliveries += 1
    if (success) item.stats.totalSuccess += 1
    else item.stats.totalFailures += 1
    item.stats.lastDeliveryAt = new Date().toISOString()
    recalcStats(item)
    webhooks.set(id, item)
  },
}

// Seed a couple of examples for the Webhooks UI.
import crypto from "crypto"
if (webhooks.size === 0) {
  WebhookStore.create({
    name: "CRM Sync",
    url: "https://example.com/webhooks/crm",
    events: ["funnel.created", "conversion.completed"],
    active: true,
  })
  WebhookStore.create({
    name: "Zapier",
    url: "https://hooks.zapier.com/hooks/catch/123456/abcdef",
    events: ["user.registered", "ai.generation.completed"],
    active: true,
  })
}
