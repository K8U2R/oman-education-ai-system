/**
 * Database Control Types - أنواع التحكم الشامل
 */

/**
 * Table
 */
export interface Table {
  id: string
  name: string
  schema?: string
  type: 'table' | 'view' | 'materialized_view'
  rowCount?: number
  size?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Table Schema
 */
export interface TableSchema {
  tableName: string
  columns: Column[]
  indexes: Index[]
  constraints: Constraint[]
  foreignKeys: ForeignKey[]
}

/**
 * Column
 */
export interface Column {
  name: string
  type: string
  nullable: boolean
  defaultValue?: unknown
  primaryKey?: boolean
  unique?: boolean
}

/**
 * Index
 */
export interface Index {
  name: string
  columns: string[]
  unique: boolean
  type: string
}

/**
 * Constraint
 */
export interface Constraint {
  name: string
  type: 'primary_key' | 'foreign_key' | 'unique' | 'check'
  columns: string[]
  definition?: string
}

/**
 * Foreign Key
 */
export interface ForeignKey {
  name: string
  columns: string[]
  referencedTable: string
  referencedColumns: string[]
  onDelete?: 'cascade' | 'restrict' | 'set_null' | 'no_action'
  onUpdate?: 'cascade' | 'restrict' | 'set_null' | 'no_action'
}

/**
 * Query Result
 */
export interface QueryResult {
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  executionTime?: number
}

/**
 * Query Builder State
 */
export interface QueryBuilderState {
  select: string[]
  from: string | null
  joins: Join[]
  where: Condition[]
  groupBy: string[]
  having: Condition[]
  orderBy: OrderBy[]
  limit: number | null
}

/**
 * Join
 */
export interface Join {
  type: 'inner' | 'left' | 'right' | 'full'
  table: string
  on: Condition
}

/**
 * Condition
 */
export interface Condition {
  column: string
  operator:
    | '='
    | '!='
    | '>'
    | '<'
    | '>='
    | '<='
    | 'LIKE'
    | 'IN'
    | 'NOT IN'
    | 'IS NULL'
    | 'IS NOT NULL'
  value: unknown
  logicalOperator?: 'AND' | 'OR'
}

/**
 * Order By
 */
export interface OrderBy {
  column: string
  direction: 'asc' | 'desc'
}

/**
 * Database Operation
 */
export type DatabaseOperation =
  | 'SELECT'
  | 'INSERT'
  | 'UPDATE'
  | 'DELETE'
  | 'CREATE_TABLE'
  | 'ALTER_TABLE'
  | 'DROP_TABLE'
  | 'CREATE_INDEX'
  | 'DROP_INDEX'
