export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  status: "active" | "draft" | "archived"
  description?: string
  promo_price?: number
  image_url?: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface WebhookConfig {
  id: string
  name: string
  url: string
  events: string[]
  secret: string
  is_active: boolean
  max_attempts: number
  initial_delay: number
  backoff_multiplier: number
  headers?: Record<string, string>
  user_id: string
  created_at: string
  updated_at: string
}

export interface WebhookDelivery {
  id: string
  webhook_config_id: string
  payload: any
  status: "pending" | "delivered" | "failed" | "retrying"
  attempts: number
  last_attempt_at?: string
  next_retry_at?: string
  response_status?: number
  response_body?: string
  error_message?: string
  created_at: string
}

export interface AIAutomationRequest {
  id: string
  user_id: string
  automation_type: "copywriter" | "images" | "videos" | "email"
  prompt: string
  context?: Record<string, any>
  status: "pending" | "processing" | "completed" | "failed"
  result?: any
  error_message?: string
  webhook_request_id?: string
  created_at: string
  updated_at: string
}

export interface WebhookLog {
  id: string
  webhook_config_id: string
  event_type: string
  status: "success" | "error"
  payload: any
  response?: any
  duration: number
  error_message?: string
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<User, "id" | "created_at">>
      }
      products: {
        Row: Product
        Insert: Omit<Product, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Product, "id" | "created_at">>
      }
      webhook_configs: {
        Row: WebhookConfig
        Insert: Omit<WebhookConfig, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<WebhookConfig, "id" | "created_at">>
      }
      webhook_deliveries: {
        Row: WebhookDelivery
        Insert: Omit<WebhookDelivery, "id" | "created_at">
        Update: Partial<Omit<WebhookDelivery, "id" | "created_at">>
      }
      ai_automation_requests: {
        Row: AIAutomationRequest
        Insert: Omit<AIAutomationRequest, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<AIAutomationRequest, "id" | "created_at">>
      }
      webhook_logs: {
        Row: WebhookLog
        Insert: Omit<WebhookLog, "id" | "created_at">
        Update: Partial<Omit<WebhookLog, "id" | "created_at">>
      }
    }
  }
}
