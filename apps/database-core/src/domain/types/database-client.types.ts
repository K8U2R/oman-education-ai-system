/**
 * Database Client Types - أنواع عملاء قواعد البيانات
 *
 * أنواع عامة لعملاء قواعد البيانات المختلفة
 */

/**
 * نوع عام لعميل قاعدة البيانات
 * يستخدم في ITransactionAdapter.executeInTransaction
 */
export type DatabaseClient = unknown

/**
 * نوع لعميل SQLite (better-sqlite3)
 */
export interface SQLiteDatabaseClient {
  prepare(query: string): SQLiteStatement
  exec(query: string): void
  pragma(query: string, options?: { simple?: boolean }): unknown
  close(): void
  transaction<T extends unknown[]>(fn: (...args: T) => unknown): (...args: T) => unknown
}

/**
 * نوع لـ SQLite Statement
 */
export interface SQLiteStatement {
  run(...params: unknown[]): { lastInsertRowid: number; changes: number }
  get(...params: unknown[]): unknown
  all(...params: unknown[]): unknown[]
  finalize(): void
}

/**
 * نوع لعميل PostgreSQL
 */
export type PostgreSQLClient = unknown // يمكن استيراده من 'pg' لاحقاً

/**
 * نوع لعميل MySQL
 */
export type MySQLClient = unknown // يمكن استيراده من 'mysql2' لاحقاً

/**
 * نوع لعميل MongoDB
 */
export type MongoDBClient = unknown // يمكن استيراده من 'mongodb' لاحقاً
