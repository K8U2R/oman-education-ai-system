/**
 * Admin Stats Types - أنواع الإحصائيات
 *
 * أنواع TypeScript للإحصائيات في صفحات Admin
 */

/**
 * إحصائيات عامة
 */
export interface AdminStats {
  /**
   * العنوان
   */
  title: string

  /**
   * القيمة
   */
  value: string | number

  /**
   * الاتجاه (للاتجاهات)
   */
  trend?: {
    value: number
    direction: 'up' | 'down'
  }

  /**
   * النوع (للألوان)
   */
  variant?: 'default' | 'success' | 'warning' | 'danger'

  /**
   * الرمز
   */
  icon?: React.ReactNode
}

/**
 * إحصائيات Dashboard
 */
export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalLessons: number
  totalProjects: number
  systemHealth: 'healthy' | 'warning' | 'critical'
  memoryUsage: number
  cpuUsage: number
}

/**
 * إحصائيات Developer
 */
export interface DeveloperStats {
  total_commits: number
  active_branches: number
  test_coverage: number
  build_status: 'success' | 'failed' | 'pending'
  api_endpoints_count: number
  services_count: number
}
