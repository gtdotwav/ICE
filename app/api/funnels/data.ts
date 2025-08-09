export type Funnel = {
  id: string
  name: string
  status: "active" | "paused" | "draft"
  revenue: number
  conversion: number
  trend: number
  createdAt: string
}

export const funnelsStore: Funnel[] = [
  { id: "FNL-001", name: "Lançamento SaaS", status: "active", revenue: 45231.89, conversion: 12.5, trend: 5.2, createdAt: new Date().toISOString() },
  { id: "FNL-002", name: "Webinar Tech", status: "active", revenue: 12100.0, conversion: 22.1, trend: -1.8, createdAt: new Date().toISOString() },
  { id: "FNL-003", name: "Ebook Gratuito", status: "paused", revenue: 5300.5, conversion: 35.0, trend: 0, createdAt: new Date().toISOString() },
]
