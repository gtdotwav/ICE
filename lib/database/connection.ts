/**
 * Database Connection and Management System
 * Optimized for performance with connection pooling
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export interface DatabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
  options?: {
    auth?: {
      autoRefreshToken?: boolean
      persistSession?: boolean
      detectSessionInUrl?: boolean
    }
    realtime?: {
      params?: {
        eventsPerSecond?: number
      }
    }
    global?: {
      headers?: Record<string, string>
    }
  }
}

export class DatabaseManager {
  private static instance: DatabaseManager
  private client: SupabaseClient | null = null
  private adminClient: SupabaseClient | null = null
  private connectionPool: Map<string, SupabaseClient> = new Map()
  private config: DatabaseConfig | null = null

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
    this.config = config

    try {
      // Main client for regular operations
      this.client = createClient(config.url, config.anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          ...config.options?.auth
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
            ...config.options?.realtime?.params
          }
        },
        global: {
          headers: {
            'X-Client-Info': 'hiasflow-web',
            ...config.options?.global?.headers
          }
        }
      })

      // Admin client for privileged operations
      if (config.serviceRoleKey) {
        this.adminClient = createClient(config.url, config.serviceRoleKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        })
      }

      // Test connection
      await this.testConnection()
      
      console.log('✅ Database connection established')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      throw new Error('Failed to initialize database connection')
    }
  }

  /**
   * Get main database client
   */
  getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Database not initialized. Call initialize() first.')
    }
    return this.client
  }

  /**
   * Get admin client for privileged operations
   */
  getAdminClient(): SupabaseClient {
    if (!this.adminClient) {
      throw new Error('Admin client not available. Provide serviceRoleKey in config.')
    }
    return this.adminClient
  }

  /**
   * Test database connection
   */
  private async testConnection(): Promise<void> {
    if (!this.client) throw new Error('Client not initialized')

    const { data, error } = await this.client
      .from('webhook_configs')
      .select('count')
      .limit(1)

    if (error && error.code !== 'PGRST116') { // PGRST116 = table not found (acceptable)
      throw error
    }
  }

  /**
   * Execute query with error handling and retries
   */
  async executeQuery<T>(
    queryFn: (client: SupabaseClient) => Promise<{ data: T | null; error: any }>,
    retries: number = 3
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
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
    
    throw new Error('Query execution failed')
  }

  /**
   * Batch operations for better performance
   */
  async executeBatch<T>(
    operations: Array<(client: SupabaseClient) => Promise<{ data: T | null; error: any }>>,
    batchSize: number = 10
  ): Promise<T[]> {
    const results: T[] = []
    const client = this.getClient()

    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize)
      const batchPromises = batch.map(op => op(client))
      
      const batchResults = await Promise.allSettled(batchPromises)
      
      for (const result of batchResults) {
        if (result.status === 'fulfilled' && !result.value.error) {
          results.push(result.value.data as T)
        } else {
          console.error('Batch operation failed:', result)
        }
      }
    }

    return results
  }

  /**
   * Health check for monitoring
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    latency: number
    details: Record<string, any>
  }> {
    const startTime = Date.now()
    
    try {
      await this.testConnection()
      const latency = Date.now() - startTime
      
      return {
        status: latency < 1000 ? 'healthy' : 'degraded',
        latency,
        details: {
          connectionPool: this.connectionPool.size,
          lastCheck: new Date().toISOString()
        }
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: Date.now() - startTime,
        details: {
          error: (error as Error).message,
          lastCheck: new Date().toISOString()
        }
      }
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
    console.log('🔌 Database connections closed')
  }
}

// Export singleton instance
export const dbManager = DatabaseManager.getInstance()

// Initialize with environment variables
if (typeof window === 'undefined') {
  // Server-side initialization
  const config: DatabaseConfig = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  }

  if (config.url && config.anonKey) {
    dbManager.initialize(config).catch(console.error)
  }
}