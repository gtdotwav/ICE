/**
 * Database Operations with CRUD functionality
 * Optimized queries with proper error handling
 */

import { dbManager } from './connection'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
  filters?: Record<string, any>
}

export class DatabaseOperations {
  private client: SupabaseClient

  constructor() {
    this.client = dbManager.getClient()
  }

  /**
   * Generic CREATE operation
   */
  async create<T>(table: string, data: Partial<T>): Promise<T> {
    return dbManager.executeQuery(async (client) => {
      return await client
        .from(table)
        .insert(data)
        .select()
        .single()
    })
  }

  /**
   * Generic READ operation with advanced filtering
   */
  async read<T>(
    table: string, 
    options: QueryOptions = {}
  ): Promise<{ data: T[]; count: number }> {
    const { limit = 50, offset = 0, orderBy, orderDirection = 'desc', filters } = options

    return dbManager.executeQuery(async (client) => {
      let query = client
        .from(table)
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              query = query.in(key, value)
            } else if (typeof value === 'string' && value.includes('%')) {
              query = query.like(key, value)
            } else {
              query = query.eq(key, value)
            }
          }
        })
      }

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy, { ascending: orderDirection === 'asc' })
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1)

      const result = await query
      return {
        data: result.data || [],
        error: result.error,
        count: result.count || 0
      }
    })
  }

  /**
   * Generic UPDATE operation
   */
  async update<T>(
    table: string, 
    id: string, 
    data: Partial<T>
  ): Promise<T> {
    return dbManager.executeQuery(async (client) => {
      return await client
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single()
    })
  }

  /**
   * Generic DELETE operation
   */
  async delete(table: string, id: string): Promise<void> {
    return dbManager.executeQuery(async (client) => {
      const result = await client
        .from(table)
        .delete()
        .eq('id', id)
      
      return { data: null, error: result.error }
    })
  }

  /**
   * Bulk operations for better performance
   */
  async bulkCreate<T>(table: string, data: Partial<T>[]): Promise<T[]> {
    return dbManager.executeQuery(async (client) => {
      return await client
        .from(table)
        .insert(data)
        .select()
    })
  }

  async bulkUpdate<T>(
    table: string, 
    updates: Array<{ id: string; data: Partial<T> }>
  ): Promise<T[]> {
    const operations = updates.map(({ id, data }) => 
      (client: SupabaseClient) => client
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single()
    )

    return dbManager.executeBatch(operations)
  }

  /**
   * Search with full-text search
   */
  async search<T>(
    table: string,
    searchTerm: string,
    searchColumns: string[],
    options: QueryOptions = {}
  ): Promise<T[]> {
    const { limit = 50, offset = 0 } = options

    return dbManager.executeQuery(async (client) => {
      let query = client.from(table).select('*')

      // Build search query
      const searchConditions = searchColumns.map(column => 
        `${column}.ilike.%${searchTerm}%`
      ).join(',')

      query = query.or(searchConditions)
      query = query.range(offset, offset + limit - 1)

      return await query
    })
  }

  /**
   * Aggregate operations
   */
  async aggregate(
    table: string,
    aggregations: Record<string, 'count' | 'sum' | 'avg' | 'min' | 'max'>,
    filters?: Record<string, any>
  ): Promise<Record<string, number>> {
    return dbManager.executeQuery(async (client) => {
      let query = client.from(table)

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }

      // Build select with aggregations
      const selectColumns = Object.entries(aggregations).map(([column, func]) => {
        switch (func) {
          case 'count':
            return `${column}.count()`
          case 'sum':
            return `${column}.sum()`
          case 'avg':
            return `${column}.avg()`
          case 'min':
            return `${column}.min()`
          case 'max':
            return `${column}.max()`
          default:
            return column
        }
      }).join(',')

      query = query.select(selectColumns)
      return await query.single()
    })
  }

  /**
   * Real-time subscriptions
   */
  subscribeToChanges<T>(
    table: string,
    callback: (payload: any) => void,
    filters?: Record<string, any>
  ): () => void {
    let subscription = this.client
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table,
          filter: filters ? Object.entries(filters).map(([key, value]) => `${key}=eq.${value}`).join('&') : undefined
        }, 
        callback
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  /**
   * Transaction support
   */
  async transaction<T>(
    operations: Array<(client: SupabaseClient) => Promise<any>>
  ): Promise<T[]> {
    // Supabase doesn't support explicit transactions in the client
    // but we can use RPC for complex operations
    const client = this.client

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
      console.error('Transaction failed:', error)
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
      // Simple query to measure latency
      await this.client.from('webhook_configs').select('count').limit(1)
      const queryLatency = Date.now() - startTime

      return {
        activeConnections: this.connectionPool.size,
        queryLatency,
        errorRate: 0, // Would be calculated from error logs
        cacheHitRate: 0 // Would be calculated from cache metrics
      }
    } catch (error) {
      return {
        activeConnections: 0,
        queryLatency: Date.now() - startTime,
        errorRate: 100,
        cacheHitRate: 0
      }
    }
  }
}

// Export singleton instance
export const dbOps = new DatabaseOperations()

// Specific operations for common entities
export const webhookOps = {
  async createWebhook(webhookData: any) {
    return dbOps.create('webhook_configs', {
      ...webhookData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  },

  async getWebhooksByUser(userId: string) {
    return dbOps.read('webhook_configs', {
      filters: { user_id: userId, is_active: true },
      orderBy: 'created_at'
    })
  },

  async updateWebhook(id: string, data: any) {
    return dbOps.update('webhook_configs', id, {
      ...data,
      updated_at: new Date().toISOString()
    })
  },

  async deleteWebhook(id: string) {
    return dbOps.delete('webhook_configs', id)
  }
}

export const formOps = {
  async saveFormSubmission(formData: any) {
    return dbOps.create('form_submissions', {
      ...formData,
      submitted_at: new Date().toISOString()
    })
  },

  async getFormSubmissions(formId: string, options?: QueryOptions) {
    return dbOps.read('form_submissions', {
      ...options,
      filters: { form_id: formId }
    })
  }
}

export const conversionOps = {
  async trackConversion(conversionData: any) {
    return dbOps.create('conversions', {
      ...conversionData,
      converted_at: new Date().toISOString()
    })
  },

  async getConversionsByFunnel(funnelId: string, options?: QueryOptions) {
    return dbOps.read('conversions', {
      ...options,
      filters: { funnel_id: funnelId }
    })
  },

  async getConversionMetrics(funnelId: string, period: string = '30d') {
    const endDate = new Date()
    const startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
    }

    return dbOps.aggregate('conversions', {
      value: 'sum',
      id: 'count'
    }, {
      funnel_id: funnelId,
      converted_at: `gte.${startDate.toISOString()}`
    })
  }
}