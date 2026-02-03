/**
 * Database Types - أنواع قاعدة البيانات
 *
 * أنواع موحدة لعمليات قاعدة البيانات
 */

import type { Metadata } from "./common.types";

/**
 * Database Operation Type - نوع عملية قاعدة البيانات
 */
export type DatabaseOperationType =
  | "FIND"
  | "INSERT"
  | "UPDATE"
  | "DELETE"
  | "COUNT"
  | "EXISTS";

/**
 * Sort Direction - اتجاه الفرز
 */
export type SortDirection = "asc" | "desc";

/**
 * Database Sort Order - ترتيب الفرز لقاعدة البيانات
 *
 * يستخدم SortOrder من Common Types مع إضافة column
 */
import type { SortBy } from "./common.types";

export interface DatabaseSortOrder extends SortBy {
  column: string;
}

/**
 * Database Query Conditions - شروط استعلام قاعدة البيانات
 *
 * بنية موحدة لشروط الاستعلام
 */
export interface DatabaseQueryConditions {
  [key: string]:
    | unknown
    | {
        $eq?: unknown;
        $ne?: unknown;
        $gt?: unknown;
        $gte?: unknown;
        $lt?: unknown;
        $lte?: unknown;
        $in?: unknown[];
        $nin?: unknown[];
        $like?: string;
        $ilike?: string;
        $isNull?: boolean;
        $isNotNull?: boolean;
        $between?: [unknown, unknown];
        $or?: DatabaseQueryConditions[];
        $and?: DatabaseQueryConditions[];
      };
}

/**
 * Database Query Options - خيارات استعلام قاعدة البيانات
 */
export interface DatabaseQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: DatabaseSortOrder | DatabaseSortOrder[];
  select?: string[];
  include?: string[];
  distinct?: boolean;
  groupBy?: string[];
  having?: DatabaseQueryConditions;
}

/**
 * Database Operation - عملية قاعدة البيانات
 *
 * بنية موحدة لعمليات قاعدة البيانات
 */
export interface DatabaseOperation<T = unknown> {
  operation: DatabaseOperationType;
  entity: string;
  conditions?: DatabaseQueryConditions;
  payload?: T | Partial<T>;
  options?: DatabaseQueryOptions;
  actor?: string;
  transactionId?: string;
  metadata?: Metadata;
}

/**
 * Database Response - استجابة قاعدة البيانات
 *
 * بنية موحدة لاستجابات قاعدة البيانات
 */
export interface DatabaseResponse<T = unknown> {
  success: boolean;
  data?: T | T[];
  count?: number;
  error?: string;
  metadata?: {
    executionTime?: number;
    query?: string;
    affectedRows?: number;
    [key: string]: unknown;
  };
}

/**
 * Database Transaction - معاملة قاعدة البيانات
 *
 * بنية لمعاملات قاعدة البيانات
 */
export interface DatabaseTransaction {
  id: string;
  operations: DatabaseOperation[];
  startedAt: string;
  committedAt?: string;
  rolledBackAt?: string;
  status: "pending" | "committed" | "rolled_back" | "failed";
}

/**
 * Database Connection Status - حالة اتصال قاعدة البيانات
 */
export interface DatabaseConnectionStatus {
  isConnected: boolean;
  isHealthy: boolean;
  lastCheck: string;
  responseTime?: number;
  error?: string;
  pool?: {
    total: number;
    active: number;
    idle: number;
    waiting: number;
  };
}

/**
 * Database Migration - ترحيل قاعدة البيانات
 */
export interface DatabaseMigration {
  id: string;
  name: string;
  version: string;
  up: string; // SQL for migration
  down: string; // SQL for rollback
  executedAt?: string;
  executedBy?: string;
  status: "pending" | "executed" | "failed" | "rolled_back";
}

/**
 * Database Index - فهرس قاعدة البيانات
 */
export interface DatabaseIndex {
  name: string;
  table: string;
  columns: string[];
  unique?: boolean;
  type?: "btree" | "hash" | "gin" | "gist";
  where?: string;
}

/**
 * Database Constraint - قيد قاعدة البيانات
 */
export interface DatabaseConstraint {
  name: string;
  type: "primary_key" | "foreign_key" | "unique" | "check" | "not_null";
  table: string;
  columns: string[];
  references?: {
    table: string;
    columns: string[];
    onDelete?: "cascade" | "restrict" | "set_null" | "no_action";
    onUpdate?: "cascade" | "restrict" | "set_null" | "no_action";
  };
  check?: string;
}

/**
 * Database Schema - مخطط قاعدة البيانات
 */
export interface DatabaseSchema {
  tables: string[];
  indexes: DatabaseIndex[];
  constraints: DatabaseConstraint[];
  version: string;
  lastUpdated: string;
}

/**
 * Database Query Builder - بناء استعلام قاعدة البيانات
 *
 * واجهة لبناء استعلامات قاعدة البيانات
 */
export interface DatabaseQueryBuilder<T = unknown> {
  where(conditions: DatabaseQueryConditions): DatabaseQueryBuilder<T>;
  orderBy(column: string, direction?: SortDirection): DatabaseQueryBuilder<T>;
  limit(count: number): DatabaseQueryBuilder<T>;
  offset(count: number): DatabaseQueryBuilder<T>;
  select(columns: string[]): DatabaseQueryBuilder<T>;
  include(relations: string[]): DatabaseQueryBuilder<T>;
  build(): DatabaseOperation<T>;
}

/**
 * Database Repository Interface - واجهة مستودع قاعدة البيانات
 *
 * واجهة موحدة لمستودعات قاعدة البيانات
 */
export interface IDatabaseRepository<T extends { id: string }> {
  find(
    conditions?: DatabaseQueryConditions,
    options?: DatabaseQueryOptions,
  ): Promise<T[]>;
  findOne(conditions: DatabaseQueryConditions): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  insert(data: Partial<T>): Promise<T>;
  insertMany(data: Partial<T>[]): Promise<T[]>;
  update(
    conditions: DatabaseQueryConditions,
    data: Partial<T>,
  ): Promise<T | null>;
  updateById(id: string, data: Partial<T>): Promise<T | null>;
  delete(conditions: DatabaseQueryConditions): Promise<boolean>;
  deleteById(id: string): Promise<boolean>;
  count(conditions?: DatabaseQueryConditions): Promise<number>;
  exists(conditions: DatabaseQueryConditions): Promise<boolean>;
}

/**
 * Database Health Check - فحص صحة قاعدة البيانات
 */
export interface DatabaseHealthCheck {
  status: "healthy" | "unhealthy" | "degraded";
  responseTime: number;
  connectionPool: DatabaseConnectionStatus["pool"];
  lastQueryTime?: number;
  errors: Array<{
    message: string;
    timestamp: string;
    count: number;
  }>;
}
