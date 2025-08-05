export interface DatabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

export interface ConnectionStatus {
  isConnected: boolean
  lastConnected?: Date
  error?: string
}

export interface QueryResult<T = any> {
  data: T[]
  error?: string
  count?: number
}

export interface DatabaseMetrics {
  activeConnections: number
  queryLatency: number
  errorRate: number
  cacheHitRate: number
}

export interface TableSchema {
  name: string
  columns: ColumnSchema[]
  indexes: IndexSchema[]
  constraints: ConstraintSchema[]
}

export interface ColumnSchema {
  name: string
  type: string
  nullable: boolean
  defaultValue?: any
  isPrimaryKey: boolean
  isForeignKey: boolean
  references?: {
    table: string
    column: string
  }
}

export interface IndexSchema {
  name: string
  columns: string[]
  unique: boolean
  type: "btree" | "hash" | "gin" | "gist"
}

export interface ConstraintSchema {
  name: string
  type: "primary_key" | "foreign_key" | "unique" | "check"
  columns: string[]
  references?: {
    table: string
    columns: string[]
  }
}

export interface MigrationRecord {
  id: string
  name: string
  executedAt: Date
  checksum: string
}

export interface BackupInfo {
  id: string
  name: string
  size: number
  createdAt: Date
  type: "full" | "incremental"
  status: "completed" | "in_progress" | "failed"
}
