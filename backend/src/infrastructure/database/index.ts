/**
 * Database Infrastructure - بنية قاعدة البيانات
 *
 * Export all database-related services and utilities
 */

export { queryOptimizerService } from "./query-optimizer.service.js";
export type {
  QueryMetrics,
  QueryCacheEntry,
  IndexRecommendation,
} from "./query-optimizer.service.js";
