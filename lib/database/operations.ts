/**
 * Database Operations with CRUD functionality
 * Optimized queries with proper error handling
 */

import { databaseManager } from "./connection"
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
    if (!databaseManager.isReady()) {
      await databaseManager.initialize()
    }
    return databaseManager.getClient()
  }

  /**
   * Generic CREATE operation
   */
  async create<T>(table: string, data: Partial<T>): Promise<T> {
    const client = await this.ensureConnection()
    if (!client) {
      throw new Error("Database not initialized")
    }

    return client.from(table).insert(data).select().single()
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

    return client.from(table).update(data).eq("id", id).select().single()
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

    return client.from(table).insert(data).select()
  }

  async bulkUpdate<T>(table: string, updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]> {
    const client = await this.ensureConnection()
    if (!client) {
      throw new Error("Database not initialized")
    }

    const operations = updates.map(
      ({ id, data }) =>
        (client: SupabaseClient) =>
          client.from(table).update(data).eq("id", id).select().single(),
    )

    const results = []
    for (const operation of operations) {
      const result = await operation(client)
      if (result.error) {
        throw result.error
      }
      results.push(result.data)
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

    let query = client.from(table)

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    // Build select with aggregations
    const selectColumns = Object.entries(aggregations)
      .map(([column, func]) => {
        switch (func) {
          case "count":
            return `${column}.count()`
          case "sum":
            return `${column}.sum()`
          case "avg":
            return `${column}.avg()`
          case "min":
            return `${column}.min()`
          case "max":
            return `${column}.max()`
          default:
            return column
        }
      })
      .join(",")

    query = query.select(selectColumns)
    const result = await query.single()
    return result.data || {}
  }

  /**
   * Real-time subscriptions
   */
  subscribeToChanges<T>(table: string, callback: (payload: any) => void, filters?: Record<string, any>): () => void {
    const client = databaseManager.getClient()
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
  async getProducts(options?: QueryOptions) {
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
