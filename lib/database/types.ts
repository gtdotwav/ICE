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
