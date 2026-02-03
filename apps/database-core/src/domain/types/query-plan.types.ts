/**
 * Query Plan Types - أنواع خطط الاستعلام
 *
 * أنواع لتحليل خطط تنفيذ الاستعلامات
 */

/**
 * Execution Plan Node - عقدة في خطة التنفيذ
 */
export interface ExecutionPlanNode {
  'Node Type'?: string
  Operation?: string
  'Relation Name'?: string
  Alias?: string
  'Startup Cost'?: number
  'Total Cost'?: number
  'Plan Rows'?: number
  'Plan Width'?: number
  'Index Name'?: string
  'Index Cond'?: string
  Filter?: string
  'Join Type'?: string
  'Hash Cond'?: string
  'Sort Key'?: string
  'Sort Method'?: string
  Plans?: ExecutionPlanNode[]
  [key: string]: unknown
}

/**
 * PostgreSQL Execution Plan
 */
export interface PostgreSQLExecutionPlan {
  Plan?: ExecutionPlanNode
  'Planning Time'?: number
  'Execution Time'?: number
  'Total Cost'?: number
  'Actual Total Time'?: number
  'Actual Rows'?: number
  'Actual Loops'?: number
  [key: string]: unknown
}

/**
 * MySQL Execution Plan
 */
export interface MySQLExecutionPlan {
  id?: number
  select_type?: string
  table?: string
  partitions?: string
  type?: string
  possible_keys?: string
  key?: string
  key_len?: string
  ref?: string
  rows?: number
  filtered?: number
  Extra?: string
  [key: string]: unknown
}

/**
 * MongoDB Execution Plan
 */
export interface MongoDBExecutionPlan {
  stage?: string
  nReturned?: number
  executionTimeMillis?: number
  indexesUsed?: Array<{ name: string; keys: Record<string, number> }>
  [key: string]: unknown
}

/**
 * Generic Execution Plan
 */
export type ExecutionPlan =
  | PostgreSQLExecutionPlan[]
  | MySQLExecutionPlan[]
  | MongoDBExecutionPlan[]
  | ExecutionPlanNode[]
  | Record<string, unknown>[]
