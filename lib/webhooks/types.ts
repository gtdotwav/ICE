// Tipos e interfaces para o sistema de webhooks
export interface WebhookConfig {
  id: string
  name: string
  url: string
  events: WebhookEvent[]
  secret: string
  isActive: boolean
  retryConfig: RetryConfig
  headers?: Record<string, string>
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface WebhookEvent {
  type: WebhookEventType
  description: string
}

export type WebhookEventType = 
  | 'form.submitted'
  | 'funnel.conversion'
  | 'user.registered'
  | 'payment.completed'
  | 'lead.qualified'
  | 'automation.triggered'
  | 'campaign.started'
  | 'email.opened'
  | 'email.clicked'

export interface RetryConfig {
  maxAttempts: number
  backoffMultiplier: number
  initialDelay: number // em segundos
}

export interface WebhookPayload {
  id: string
  event: WebhookEventType
  timestamp: string
  data: Record<string, any>
  source: string
  version: string
}

export interface WebhookDelivery {
  id: string
  webhookConfigId: string
  payload: WebhookPayload
  status: 'pending' | 'delivered' | 'failed' | 'retrying'
  attempts: number
  lastAttemptAt?: Date
  nextRetryAt?: Date
  responseStatus?: number
  responseBody?: string
  errorMessage?: string
  createdAt: Date
}

export interface IncomingWebhookConfig {
  id: string
  name: string
  endpoint: string
  secret: string
  isActive: boolean
  allowedSources: string[]
  eventMapping: Record<string, string>
  userId: string
  createdAt: Date
}

export interface WebhookLog {
  id: string
  type: 'outgoing' | 'incoming'
  webhookConfigId: string
  event: string
  status: 'success' | 'error'
  payload: any
  response?: any
  duration: number
  timestamp: Date
}