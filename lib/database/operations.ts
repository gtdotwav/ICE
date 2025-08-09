import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface DatabaseUser {
  id: string
  email: string
  name?: string
  created_at: string
  updated_at: string
}

export interface DatabaseProduct {
  id: string
  name: string
  category: string
  price: number
  status: "active" | "draft" | "archived"
  description?: string
  promo_price?: number
  user_id: string
  created_at: string
  updated_at: string
}

export interface DatabaseWebhook {
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

export interface DatabaseWebhookDelivery {
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

export class DatabaseOperations {
  // User operations
  async createUser(userData: Omit<DatabaseUser, "id" | "created_at" | "updated_at">): Promise<DatabaseUser> {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`)
    }

    return data
  }

  async getUserById(id: string): Promise<DatabaseUser | null> {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // User not found
      }
      throw new Error(`Failed to get user: ${error.message}`)
    }

    return data
  }

  async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // User not found
      }
      throw new Error(`Failed to get user by email: ${error.message}`)
    }

    return data
  }

  async updateUser(id: string, updates: Partial<Omit<DatabaseUser, "id" | "created_at">>): Promise<DatabaseUser> {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`)
    }

    return data
  }

  // Product operations
  async createProduct(
    productData: Omit<DatabaseProduct, "id" | "created_at" | "updated_at">,
  ): Promise<DatabaseProduct> {
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          ...productData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`)
    }

    return data
  }

  async getProductById(id: string): Promise<DatabaseProduct | null> {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Failed to get product: ${error.message}`)
    }

    return data
  }

  async getProductsByUserId(userId: string): Promise<DatabaseProduct[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Failed to get products: ${error.message}`)
    }

    return data || []
  }

  async updateProduct(
    id: string,
    updates: Partial<Omit<DatabaseProduct, "id" | "created_at">>,
  ): Promise<DatabaseProduct> {
    const { data, error } = await supabase
      .from("products")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`)
    }

    return data
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`)
    }
  }

  // Webhook operations
  async createWebhookConfig(
    webhookData: Omit<DatabaseWebhook, "id" | "created_at" | "updated_at">,
  ): Promise<DatabaseWebhook> {
    const { data, error } = await supabase
      .from("webhook_configs")
      .insert([
        {
          ...webhookData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create webhook config: ${error.message}`)
    }

    return data
  }

  async getWebhookConfigById(id: string): Promise<DatabaseWebhook | null> {
    const { data, error } = await supabase.from("webhook_configs").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Failed to get webhook config: ${error.message}`)
    }

    return data
  }

  async getWebhookConfigsByUserId(userId: string): Promise<DatabaseWebhook[]> {
    const { data, error } = await supabase
      .from("webhook_configs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Failed to get webhook configs: ${error.message}`)
    }

    return data || []
  }

  async getActiveWebhookConfigsByEvent(userId: string, eventType: string): Promise<DatabaseWebhook[]> {
    const { data, error } = await supabase
      .from("webhook_configs")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .contains("events", [eventType])

    if (error) {
      throw new Error(`Failed to get active webhook configs: ${error.message}`)
    }

    return data || []
  }

  async updateWebhookConfig(
    id: string,
    updates: Partial<Omit<DatabaseWebhook, "id" | "created_at">>,
  ): Promise<DatabaseWebhook> {
    const { data, error } = await supabase
      .from("webhook_configs")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update webhook config: ${error.message}`)
    }

    return data
  }

  async deleteWebhookConfig(id: string): Promise<void> {
    const { error } = await supabase.from("webhook_configs").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete webhook config: ${error.message}`)
    }
  }

  // Webhook delivery operations
  async createWebhookDelivery(
    deliveryData: Omit<DatabaseWebhookDelivery, "id" | "created_at">,
  ): Promise<DatabaseWebhookDelivery> {
    const { data, error } = await supabase
      .from("webhook_deliveries")
      .insert([
        {
          ...deliveryData,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create webhook delivery: ${error.message}`)
    }

    return data
  }

  async getWebhookDeliveryById(id: string): Promise<DatabaseWebhookDelivery | null> {
    const { data, error } = await supabase.from("webhook_deliveries").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Failed to get webhook delivery: ${error.message}`)
    }

    return data
  }

  async updateWebhookDelivery(
    id: string,
    updates: Partial<Omit<DatabaseWebhookDelivery, "id" | "created_at">>,
  ): Promise<DatabaseWebhookDelivery> {
    const { data, error } = await supabase.from("webhook_deliveries").update(updates).eq("id", id).select().single()

    if (error) {
      throw new Error(`Failed to update webhook delivery: ${error.message}`)
    }

    return data
  }

  async getWebhookDeliveriesByConfigId(configId: string, limit = 100): Promise<DatabaseWebhookDelivery[]> {
    const { data, error } = await supabase
      .from("webhook_deliveries")
      .select("*")
      .eq("webhook_config_id", configId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to get webhook deliveries: ${error.message}`)
    }

    return data || []
  }

  async getPendingWebhookDeliveries(): Promise<DatabaseWebhookDelivery[]> {
    const { data, error } = await supabase
      .from("webhook_deliveries")
      .select("*")
      .in("status", ["pending", "retrying"])
      .lte("next_retry_at", new Date().toISOString())
      .order("created_at", { ascending: true })

    if (error) {
      throw new Error(`Failed to get pending webhook deliveries: ${error.message}`)
    }

    return data || []
  }

  // Analytics and stats
  async getWebhookStats(
    configId: string,
    days = 7,
  ): Promise<{
    totalDeliveries: number
    successRate: number
    averageResponseTime: number
  }> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from("webhook_deliveries")
      .select("status, response_status, created_at, last_attempt_at")
      .eq("webhook_config_id", configId)
      .gte("created_at", startDate.toISOString())

    if (error) {
      throw new Error(`Failed to get webhook stats: ${error.message}`)
    }

    const deliveries = data || []
    const totalDeliveries = deliveries.length
    const successfulDeliveries = deliveries.filter((d) => d.status === "delivered").length
    const successRate = totalDeliveries > 0 ? (successfulDeliveries / totalDeliveries) * 100 : 0

    // Calculate average response time (simplified)
    const averageResponseTime = 250 // Placeholder

    return {
      totalDeliveries,
      successRate: Math.round(successRate * 100) / 100,
      averageResponseTime,
    }
  }
}

export const db = new DatabaseOperations()
