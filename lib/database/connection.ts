import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseServiceKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

// Client for server-side operations with service role key
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Client for client-side operations with anon key
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Test connection function
export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("count").limit(1)

    if (error) {
      console.error("Database connection test failed:", error)
      return false
    }

    console.log("Database connection successful")
    return true
  } catch (error) {
    console.error("Database connection test error:", error)
    return false
  }
}

// Health check function
export async function healthCheck(): Promise<{
  status: "healthy" | "unhealthy"
  timestamp: string
  details?: any
}> {
  try {
    const startTime = Date.now()

    const { data, error } = await supabaseAdmin.from("users").select("count").limit(1)

    const responseTime = Date.now() - startTime

    if (error) {
      return {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        details: {
          error: error.message,
          responseTime,
        },
      }
    }

    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      details: {
        responseTime,
        connection: "active",
      },
    }
  } catch (error) {
    return {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      details: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
    }
  }
}
