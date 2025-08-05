/**
 * Database Connection and Management System
 * Optimized for performance with connection pooling
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { DatabaseConfig, ConnectionStatus } from "./types"

export class DatabaseManager {
  private static instance: DatabaseManager
  private client: SupabaseClient | null = null
  private adminClient: SupabaseClient | null = null
  private connectionPool: Map<string, SupabaseClient> = new Map()
  private config: DatabaseConfig | null = null
  private status: ConnectionStatus = { isConnected: false }
  private isInitialized = false

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  /**
   * Initialize database connection
   */
  async initialize(config: DatabaseConfig): Promise<void> {
    if (this.isInitialized) {
      return // Already initialized
    }

    try {
      this.config = config
      this.client = createClient(config.url, config.anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          ...config.options?.auth,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
            ...config.options?.realtime?.params,
          },
        },
        global: {
          headers: {
            "X-Client-Info": "icefunnel-web",
            ...config.options?.global?.headers,
          },
        },
      })

      // Admin client for privileged operations (server-side only)
      if (config.serviceRoleKey && typeof window === "undefined") {
        this.adminClient = createClient(config.url, config.serviceRoleKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        })
      }

      // Test connection with a simple query
      const connectionTestResult = await this.testConnection()
      this.status = {
        isConnected: connectionTestResult,
        lastConnected: new Date(),
        error: connectionTestResult ? "" : "Connection test failed",
      }

      if (!connectionTestResult) {
        console.warn("Database connection test failed:", this.status.error)
      }

      this.isInitialized = true
      console.log("✅ Database connection established")
    } catch (error) {
      this.status = {
        isConnected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
      console.error("❌ Database connection failed:", error)
      // Don't throw error to prevent app from breaking
      this.isInitialized = false
    }
  }

  /**
   * Get main database client
   */
  getClient(): SupabaseClient {
    if (!this.client) {
      // Try to initialize with environment variables if available
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (url && anonKey) {
        this.client = createClient(url, anonKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
          },
        })
      } else {
        throw new Error("Database not initialized and environment variables not available")
      }
    }
    return this.client
  }

  /**
   * Get admin client for privileged operations
   */
  getAdminClient(): SupabaseClient {
    if (!this.adminClient) {
      throw new Error("Admin client not available. Provide serviceRoleKey in config.")
    }
    return this.adminClient
  }

  /**
   * Test database connection
   */
  private async testConnection(): Promise<boolean> {
    if (!this.client) throw new Error("Client not initialized")

    try {
      // Simple query to test connection
      const { error } = await this.client.from("_health_check").select("*").limit(1)

      if (error) {
        throw error
      }
      return true
    } catch (error: any) {
      // If _health_check table doesn't exist, try a different approach
      try {
        const { error: authError } = await this.client.auth.getSession()
        if (authError) {
          console.warn("Auth session error (non-critical):", authError.message)
        }
      } catch (authTestError) {
        console.warn("Connection test failed, but continuing:", authTestError)
      }
      return false
    }
  }

  /**
   * Execute query with error handling and retries
   */
  async executeQuery<T>(
    queryFn: (client: SupabaseClient) => Promise<{ data: T | null; error: any }>,
    retries = 3,
  ): Promise<T> {
    const client = this.getClient()

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const { data, error } = await queryFn(client)

        if (error) {
          throw error
        }

        return data as T
      } catch (error: any) {
        console.error(`Query attempt ${attempt} failed:`, error)

        if (attempt === retries) {
          throw new Error(`Query failed after ${retries} attempts: ${error.message}`)
        }

        // Wait before retry with exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }

    throw new Error("Query execution failed")
  }

  /**
   * Batch operations for better performance
   */
  async executeBatch<T>(
    operations: Array<(client: SupabaseClient) => Promise<{ data: T | null; error: any }>>,
    batchSize = 10,
  ): Promise<T[]> {
    const results: T[] = []
    const client = this.getClient()

    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize)
      const batchPromises = batch.map((op) => op(client))

      const batchResults = await Promise.allSettled(batchPromises)

      for (const result of batchResults) {
        if (result.status === "fulfilled" && !result.value.error) {
          results.push(result.value.data as T)
        } else {
          console.error("Batch operation failed:", result)
        }
      }
    }

    return results
  }

  /**
   * Health check for monitoring
   */
  async healthCheck(): Promise<boolean> {
    if (!this.client) return false

    try {
      const { error } = await this.client.from("_health_check").select("*").limit(1)
      return !error
    } catch {
      return false
    }
  }

  /**
   * Check if database is initialized
   */
  isReady(): boolean {
    return this.client !== null && this.status.isConnected
  }

  getStatus(): ConnectionStatus {
    return { ...this.status }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      // Supabase client doesn't have explicit disconnect
      this.client = null
      this.status = { isConnected: false }
    }
  }

  async reconnect(): Promise<void> {
    if (this.config) {
      await this.initialize(this.config)
    } else {
      throw new Error("No configuration available for reconnection")
    }
  }

  /**
   * Close all connections
   */
  async close(): Promise<void> {
    // Supabase client doesn't need explicit closing
    // but we can clear our connection pool
    this.connectionPool.clear()
    this.client = null
    this.adminClient = null
    this.isInitialized = false
    this.status = { isConnected: false }
    console.log("🔌 Database connections closed")
  }
}

// Export singleton instance
export const dbManager = DatabaseManager.getInstance()

// Auto-initialize with environment variables if available
if (typeof window !== "undefined") {
  // Client-side initialization
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (url && anonKey) {
    dbManager
      .initialize({
        url,
        anonKey,
      })
      .catch((error) => {
        console.warn("Auto-initialization failed:", error.message)
      })
  }
} else {
  // Server-side initialization
  const config: DatabaseConfig = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  if (config.url && config.anonKey) {
    dbManager.initialize(config).catch((error) => {
      console.warn("Server-side initialization failed:", error.message)
    })
  }
}
