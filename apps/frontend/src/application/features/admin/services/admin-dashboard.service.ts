/**
 * Admin Dashboard Service - خدمة لوحة تحكم Admin
 *
 * Service في Application Layer لجلب بيانات Dashboard
 * يتبع Clean Architecture - لا Infrastructure imports مباشرة
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import type { SystemStats, ContentStats } from './admin.service'

/**
 * Dashboard Stats - إحصائيات Dashboard
 */
export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalLessons: number
  systemHealth: 'healthy' | 'warning' | 'error'
  memoryUsage?: number
  cpuUsage?: number
}

/**
 * System Health - صحة النظام
 */
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error'
  database: 'connected' | 'disconnected'
  server: 'active' | 'inactive'
  memoryUsage?: number
  cpuUsage?: number
}

class AdminDashboardService {
  /**
   * الحصول على إحصائيات Dashboard
   */
  async getStats(): Promise<DashboardStats> {
    const [systemStats, contentStats] = await Promise.all([
      apiClient.get<SystemStats>('/admin/stats/system'),
      apiClient.get<ContentStats>('/admin/stats/content'),
    ])

    return {
      totalUsers: systemStats.total_users,
      activeUsers: systemStats.active_users,
      totalLessons: contentStats.total_lessons,
      systemHealth: systemStats.system_health,
      memoryUsage: systemStats.memory_usage,
      cpuUsage: systemStats.cpu_usage,
    }
  }

  /**
   * الحصول على صحة النظام
   */
  async getSystemHealth(): Promise<SystemHealth> {
    const systemStats = await apiClient.get<SystemStats>('/admin/stats/system')

    return {
      status: systemStats.system_health,
      database: systemStats.database_status,
      server: systemStats.server_status,
      memoryUsage: systemStats.memory_usage,
      cpuUsage: systemStats.cpu_usage,
    }
  }
}

export const adminDashboardService = new AdminDashboardService()
