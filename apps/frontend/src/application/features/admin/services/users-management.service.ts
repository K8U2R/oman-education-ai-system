/**
 * Users Management Service - خدمة إدارة المستخدمين
 *
 * Service في Application Layer لإدارة المستخدمين
 * يتبع Clean Architecture - لا Infrastructure imports مباشرة
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import type { AdminUserInfo, UpdateUserRequest, SearchUsersRequest } from './admin.service'

class UsersManagementService {
  /**
   * البحث عن المستخدمين
   */
  async searchUsers(request: SearchUsersRequest = {}): Promise<{
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

export const usersManagementService = new UsersManagementService()
