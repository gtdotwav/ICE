/**
 * Database Operations with CRUD functionality
 * Optimized queries with proper error handling
 */

import { dbManager } from "./connection"
import type { SupabaseClient } from "@supabase/supabase-js"

export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: "asc" | "desc"
  filters?: Record<string, any>
}

export class DatabaseOperations {
  private async ensureConnection() {
    if (!dbManager.isReady()) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (url && anonKey) {
        await dbManager.initialize({ url, anonKey })
      }
    }
    return dbManager.getClient()
  }

  /**
   * Generic CREATE operation
   */
  async create<T>(table: string, data: Partial<T>): Promise<T> {
    const client = await this.ensureConnection()
    if (!client) {
      throw new Error("Database not initialized")
    }

    const { data: result, error } = await client.from(table).insert(data).select().single()
    if (error) throw error
    return result
  }

  /**
   * Generic READ operation with advanced filtering
   */
  async read<T>(table: string, options: QueryOptions = {}): Promise<{ data: T[]; count: number }> {
    const client = await this.ensureConnection()
    if (!client) {
      return { data: [], count: 0 }
    }

    const { limit = 50, offset = 0, orderBy, orderDirection = "desc", filters } = options

    let query = client.from(table).select("*", { count: "exact" })

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            query = query.in(key, value)
          } else if (typeof value === "string" && value.includes("%")) {
            query = query.like(key, value)
          } else {
            query = query.eq(key, value)
          }
        }
      })
    }

    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy, { ascending: orderDirection === "asc" })
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const result = await query
    return {
      data: result.data || [],
      count: result.count || 0,
    }
  }

  /**
   * Generic UPDATE operation
   */
  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    const client = await this.ensureConnection()
    if (!client) {
      throw new Error("Database not initialized")
    }

    const { data: result, error } = await client.from(table).update(data).eq("id", id).select().single()
    if (error) throw error
    return result
  }

  /**
   * Generic DELETE operation
   */
  async delete(table: string, id: string): Promise<void> {
    const client = await this.ensureConnection()
    if (!client) {
      throw new Error("Database not initialized")
    }

    const result = await client.from(table).delete().eq("id", id)
    if (result.error) {
      throw result.error
    }
  }

  /**
   * Bulk operations for better performance
   */
  async bulkCreate<T>(table: string, data: Partial<T>[]): Promise<T[]> {
    const client = await this.ensureConnection()
    if (!client) {
      throw new Error("Database not initialized")
    }

    const { data: result, error } = await client.from(table).insert(data).select()
    if (error) throw error
    return result || []
  }

  async bulkUpdate<T>(table: string, updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]> {
    const client = await this.ensureConnection()
    if (!client) {
      throw new Error("Database not initialized")
    }

    const results = []
    for (const { id, data } of updates) {
      const { data: result, error } = await client.from(table).update(data).eq("id", id).select().single()
      if (error) {
        throw error
      }
      results.push(result)
    }
    return results
  }

  /**
   * Search with full-text search
   */
  async search<T>(
    table: string,
    searchTerm: string,
    searchColumns: string[],
    options: QueryOptions = {},
  ): Promise<T[]> {
    const client = await this.ensureConnection()
    if (!client) {
      return []
    }

    const { limit = 50, offset = 0 } = options

    let query = client.from(table).select("*")

    // Build search query
    const searchConditions = searchColumns.map((column) => `${column}.ilike.%${searchTerm}%`).join(",")

    query = query.or(searchConditions)
    query = query.range(offset, offset + limit - 1)

    const result = await query
    return result.data || []
  }

  /**
   * Aggregate operations
   */
  async aggregate(
    table: string,
    aggregations: Record<string, "count" | "sum" | "avg" | "min" | "max">,
    filters?: Record<string, any>,
  ): Promise<Record<string, number>> {
    const client = await this.ensureConnection()
    if (!client) {
      return {}
    }

    let query = client.from(table).select("*")

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error } = await query
    if (error) throw error

    // Calculate aggregations manually since Supabase doesn't support all SQL aggregations directly
    const result: Record<string, number> = {}

    if (data && data.length > 0) {
      Object.entries(aggregations).forEach(([column, func]) => {
        const values = data.map((row) => row[column]).filter((val) => val !== null && val !== undefined)

        switch (func) {
          case "count":
            result[column] = values.length
            break
          case "sum":
            result[column] = values.reduce((sum, val) => sum + (Number(val) || 0), 0)
            break
          case "avg":
            result[column] =
              values.length > 0 ? values.reduce((sum, val) => sum + (Number(val) || 0), 0) / values.length : 0
            break
          case "min":
            result[column] = values.length > 0 ? Math.min(...values.map(Number)) : 0
            break
          case "max":
            result[column] = values.length > 0 ? Math.max(...values.map(Number)) : 0
            break
        }
      })
    }

    return result
  }

  /**
   * Real-time subscriptions
   */
  subscribeToChanges<T>(table: string, callback: (payload: any) => void, filters?: Record<string, any>): () => void {
    const client = dbManager.getClient()
    if (!client) {
      console.warn("Database not initialized, subscription not created")
      return () => {}
    }

    const subscription = client
      .channel(`${table}_changes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter: filters
            ? Object.entries(filters)
                .map(([key, value]) => `${key}=eq.${value}`)
                .join("&")
            : undefined,
        },
        callback,
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  /**
   * Transaction support
   */
  async transaction<T>(operations: Array<(client: SupabaseClient) => Promise<any>>): Promise<T[]> {
    const client = await this.ensureConnection()
    if (!client) {
      throw new Error("Database not initialized")
    }

    // Supabase doesn't support explicit transactions in the client
    // but we can use RPC for complex operations

    try {
      const results = []
      for (const operation of operations) {
        const result = await operation(client)
        if (result.error) {
          throw result.error
        }
        results.push(result.data)
      }
      return results
    } catch (error) {
      console.error("Transaction failed:", error)
      throw error
    }
  }

  /**
   * Performance monitoring
   */
  async getPerformanceMetrics(): Promise<{
    activeConnections: number
    queryLatency: number
    errorRate: number
    cacheHitRate: number
  }> {
    const startTime = Date.now()

    try {
      const client = await this.ensureConnection()
      if (!client) {
        return {
          activeConnections: 0,
          queryLatency: 0,
          errorRate: 100,
          cacheHitRate: 0,
        }
      }

      // Simple query to measure latency
      await client.from("products").select("count").limit(1)
      const queryLatency = Date.now() - startTime

      return {
        activeConnections: 1, // Supabase manages connections
        queryLatency,
        errorRate: 0, // Would be calculated from error logs
        cacheHitRate: 0, // Would be calculated from cache metrics
      }
    } catch (error) {
      return {
        activeConnections: 0,
        queryLatency: Date.now() - startTime,
        errorRate: 100,
        cacheHitRate: 0,
      }
    }
  }

  /**
   * Specific operations for common entities
   */
  async getProducts(options: QueryOptions = {}) {
    const client = await this.ensureConnection()
    if (!client) return []

    const { limit = 50, offset = 0, orderBy = "created_at", orderDirection = "desc", filters } = options

    let query = client.from("products").select(`
      *,
      categories (name),
      suppliers (name)
    `)

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            query = query.in(key, value)
          } else if (typeof value === "string" && value.includes("%")) {
            query = query.like(key, value)
          } else {
            query = query.eq(key, value)
          }
        }
      })
    }

    // Apply ordering
    query = query.order(orderBy, { ascending: orderDirection === "asc" })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  async getCategories() {
    const client = await this.ensureConnection()
    if (!client) return []

    const { data, error } = await client.from("categories").select("*").order("name")

    if (error) throw error
    return data || []
  }

  async getSuppliers() {
    const client = await this.ensureConnection()
    if (!client) return []

    const { data, error } = await client.from("suppliers").select("*").order("name")

    if (error) throw error
    return data || []
  }

  async getInventoryData() {
    const client = await this.ensureConnection()
    if (!client) return []

    const { data, error } = await client
      .from("inventory_counts")
      .select("*")
      .order("data_agendamento", { ascending: false })

    if (error) throw error
    return data || []
  }

  async getOrders() {
    const client = await this.ensureConnection()
    if (!client) return []

    const { data, error } = await client
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (name, price)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }
}

// Export singleton instance
export const dbOps = new DatabaseOperations()
