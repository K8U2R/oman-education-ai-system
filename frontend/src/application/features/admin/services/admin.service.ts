/**
 * Admin Service - خدمة الإدارة
 *
 * Frontend service للوصول إلى Admin APIs
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/api'

export interface SystemStats {
  total_users: number
  active_users: number
  total_lessons: number
  total_learning_paths: number
  total_notifications: number
  system_health: 'healthy' | 'warning' | 'error'
  database_status: 'connected' | 'disconnected'
  server_status: 'active' | 'inactive'
  memory_usage: number
  cpu_usage?: number
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  verified: number
  unverified: number
  by_role: Record<string, number>
  recent_registrations: number
}

export interface ContentStats {
  total_lessons: number
  published_lessons: number
  draft_lessons: number
  total_learning_paths: number
  published_paths: number
  draft_paths: number
  by_subject: Record<string, number>
  by_grade_level: Record<string, number>
}

export interface UsageStats {
  total_sessions: number
  active_sessions: number
  total_api_calls: number
  api_calls_today: number
  most_used_endpoints: Array<{
    endpoint: string
    count: number
  }>
  peak_usage_hour?: number
}

export interface AdminUserInfo {
  id: string
  email: string
  first_name?: string
  last_name?: string
  username?: string
  role: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  last_login?: string
  login_count?: number
}

export interface UpdateUserRequest {
  first_name?: string
  last_name?: string
  username?: string
  role?: string
  is_active?: boolean
  is_verified?: boolean
  permissions?: string[]
}

export interface SearchUsersRequest {
  query?: string
  role?: string
  is_active?: boolean
  is_verified?: boolean
  page?: number
  per_page?: number
}

class AdminService {
  /**
   * الحصول على إحصائيات النظام
   */
  async getSystemStats(): Promise<SystemStats> {
    return apiClient.get<SystemStats>('/admin/stats/system')
  }

  /**
   * الحصول على إحصائيات المستخدمين
   */
  async getUserStats(): Promise<UserStats> {
    return apiClient.get<UserStats>('/admin/stats/users')
  }

  /**
   * الحصول على إحصائيات المحتوى
   */
  async getContentStats(): Promise<ContentStats> {
    return apiClient.get<ContentStats>('/admin/stats/content')
  }

  /**
   * الحصول على إحصائيات الاستخدام
   */
  async getUsageStats(): Promise<UsageStats> {
    return apiClient.get<UsageStats>('/admin/stats/usage')
  }

  /**
   * البحث عن المستخدمين
   */
  async searchUsers(request: SearchUsersRequest): Promise<{
    users: AdminUserInfo[]
    total: number
    page: number
    per_page: number
    total_pages: number
  }> {
    return apiClient.get<{
      users: AdminUserInfo[]
      total: number
      page: number
      per_page: number
      total_pages: number
    }>('/admin/users', { params: request })
  }

  /**
   * تحديث مستخدم
   */
  async updateUser(userId: string, request: UpdateUserRequest): Promise<AdminUserInfo> {
    return apiClient.put<AdminUserInfo>(`/admin/users/${userId}`, request)
  }

  /**
   * حذف مستخدم
   */
  async deleteUser(userId: string): Promise<void> {
    return apiClient.delete(`/admin/users/${userId}`)
  }

  /**
   * الحصول على نشاط المستخدمين
   */
  async getUserActivities(): Promise<
    Array<{
      user_id: string
      email: string
      last_login?: string
      login_count: number
      last_activity?: string
      endpoints_used: string[]
      total_requests: number
    }>
  > {
    const response = await apiClient.get<{
      activities: Array<{
        user_id: string
        email: string
        last_login?: string
        login_count: number
        last_activity?: string
        endpoints_used: string[]
        total_requests: number
      }>
      count: number
    }>('/admin/users/activities')
    return response.activities
  }
}

export const adminService = new AdminService()
