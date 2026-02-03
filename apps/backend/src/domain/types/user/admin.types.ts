/**
 * Admin Types - أنواع الإدارة
 *
 * TypeScript types لوحة تحكم الإدارة
 */

import type {
  BaseEntity,
  LogLevel,
  Metadata,
  PaginationRequest,
} from "../shared/common.types.js";

/**
 * إحصائيات النظام
 */
export interface SystemStats {
  total_users: number;
  active_users: number;
  total_lessons: number;
  total_learning_paths: number;
  total_notifications: number;
  system_health: "healthy" | "warning" | "error";
  database_status: "connected" | "disconnected";
  server_status: "active" | "inactive";
  memory_usage: number; // percentage
  cpu_usage?: number; // percentage
}

/**
 * إحصائيات المستخدمين
 */
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  by_role: Record<string, number>;
  recent_registrations: number; // last 7 days
}

/**
 * إحصائيات المحتوى
 */
export interface ContentStats {
  total_lessons: number;
  published_lessons: number;
  draft_lessons: number;
  total_learning_paths: number;
  published_paths: number;
  draft_paths: number;
  by_subject: Record<string, number>;
  by_grade_level: Record<string, number>;
}

/**
 * إحصائيات الاستخدام
 */
export interface UsageStats {
  total_sessions: number;
  active_sessions: number;
  total_api_calls: number;
  api_calls_today: number;
  most_used_endpoints: Array<{
    endpoint: string;
    count: number;
  }>;
  peak_usage_hour?: number;
}

/**
 * معلومات المستخدم للإدارة
 */
export interface AdminUserInfo {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login?: string;
  login_count?: number;
}

/**
 * طلب تحديث المستخدم
 */
export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  username?: string;
  role?: string;
  is_active?: boolean;
  is_verified?: boolean;
  permissions?: string[];
}

/**
 * طلب البحث عن المستخدمين
 */
export interface SearchUsersRequest {
  query?: string;
  role?: string;
  is_active?: boolean;
  is_verified?: boolean;
  page?: number;
  per_page?: number;
}

/**
 * سجل النظام
 *
 * يستخدم BaseEntity و LogLevel و Metadata من Common Types
 */
export interface SystemLog extends BaseEntity {
  level: LogLevel;
  message: string;
  user_id?: string;
  endpoint?: string;
  ip_address?: string;
  metadata?: Metadata;
}

/**
 * طلب البحث في السجلات
 *
 * يستخدم LogLevel و PaginationRequest من Common Types
 */
export interface SearchLogsRequest extends PaginationRequest {
  level?: LogLevel;
  start_date?: string;
  end_date?: string;
  user_id?: string;
  endpoint?: string;
}

/**
 * نشاط المستخدم
 */
export interface UserActivity {
  user_id: string;
  email: string;
  last_login?: string;
  login_count: number;
  last_activity?: string;
  endpoints_used: string[];
  total_requests: number;
}
