/**
 * Developer Types - أنواع المطور
 *
 * TypeScript types لوحة تحكم المطور مع دعم مراقبة التشفير ونظام التوصيات
 */

import { ConnectionStatus } from './storage.types'

// ==================== الأنواع الأساسية ====================

/**
 * إحصائيات المطور
 */
export interface DeveloperStats {
  total_commits: number
  active_branches: number
  test_coverage: number
  build_status: 'success' | 'failed' | 'pending'
  last_build_time?: string
  api_endpoints_count: number
  services_count: number
  error_rate: number
}

/**
 * معلومات API Endpoint
 */
export interface APIEndpointInfo {
  method: string
  path: string
  description?: string
  request_count: number
  average_response_time: number
  error_count: number
  last_called?: string
}

/**
 * معلومات Service
 */
export interface ServiceInfo {
  name: string
  status: 'healthy' | 'unhealthy' | 'unknown'
  uptime: number
  memory_usage: number
  cpu_usage?: number
  last_check: string
}

/**
 * Log Entry للمطور
 */
export interface DeveloperLog {
  id: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: string
  service?: string
  endpoint?: string
  metadata?: Record<string, unknown>
}

/**
 * Performance Metric
 */
export interface PerformanceMetric {
  endpoint: string
  average_response_time: number
  p95_response_time: number
  p99_response_time: number
  request_count: number
  error_rate: number
}

// ==================== مراقبة المسارات المشفرة ====================

/**
 * حالة التشفير للمسار
 */
export type RouteEncryptionStatus = 'encrypted' | 'plain' | 'mixed' | 'error'

/**
 * معلومات المسار المشفر
 */
export interface EncryptedRouteInfo {
  original_path: string // المسار الأصلي (مثل: /admin/dashboard)
  encrypted_path: string // المسار المشفر (مثل: /p/a3b8d1c4f8e9)
  encryption_algorithm: string // الخوارزمية المستخدمة
  created_at: string // تاريخ الإنشاء
  expires_at?: string // تاريخ الانتهاء (للمسارات المؤقتة)
  access_count: number // عدد مرات الوصول
  last_accessed?: string // آخر وصول
  is_active: boolean // هل المسار نشط
}

/**
 * إحصائيات نظام تشفير المسارات
 */
export interface RouteEncryptionStats {
  total_encrypted_routes: number // إجمالي المسارات المشفرة
  active_encrypted_routes: number // المسارات المشفرة النشطة
  expired_routes: number // المسارات المنتهية
  total_accesses: number // إجمالي الوصولات
  encryption_status: RouteEncryptionStatus
  routes_by_role: Record<string, number> // توزيع حسب الأدوار
  average_lifetime_hours: number // متوسط عمر المسارات
  security_violations: number // محاولات الوصول غير المصرح بها
}

// ==================== نظام التوصيات ====================

/**
 * نوع التوصية
 */
export type RecommendationType =
  | 'lesson' // توصية درس
  | 'content' // توصية محتوى
  | 'path' // توصية مسار تعليمي
  | 'resource' // توصية مصدر
  | 'activity' // توصية نشاط

/**
 * حالة محرك التوصيات
 */
export type RecommendationEngineStatus =
  | 'active' // نشط
  | 'training' // يتدرب
  | 'offline' // متوقف
  | 'error' // خطأ

/**
 * إحصائيات محرك التوصيات
 */
export interface RecommendationEngineStats {
  engine_status: RecommendationEngineStatus
  total_recommendations_generated: number // إجمالي التوصيات
  recommendations_today: number // توصيات اليوم
  average_accuracy: number // متوسط الدقة (0-1)
  user_satisfaction_rate: number // معدل الرضا (0-1)
  recommendations_by_type: Record<RecommendationType, number>
  active_models_count: number // عدد النماذج النشطة
  last_training_date?: string // آخر تدريب
  next_training_date?: string // التدريب القادم
  training_data_size: number // حجم بيانات التدريب
  inference_avg_time_ms: number // متوسط وقت الاستنتاج (ms)
  cache_hit_rate: number // معدل إصابة الذاكرة المؤقتة
}

// ==================== إحصائيات المطور المحسّنة ====================

/**
 * إحصائيات المطور المحسّنة مع دعم التشفير والتوصيات
 */
export interface EnhancedDeveloperStats extends DeveloperStats {
  // الإحصائيات الأساسية من DeveloperStats

  // ✅ ربط مع حالة التخزين السحابي
  storage_connections: {
    total: number
    by_status: Record<ConnectionStatus, number>
    healthy_percentage: number
  }

  // ✅ إحصائيات التشفير
  route_encryption: RouteEncryptionStats

  // ✅ إحصائيات نظام التوصيات
  recommendation_engine: RecommendationEngineStats

  // ✅ إحصائيات AI إضافية
  ai_features: {
    content_generation_requests: number
    personalization_active_users: number
    ai_response_time_avg_ms: number
  }
}
