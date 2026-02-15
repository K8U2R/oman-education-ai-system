/**
 * AdminDashboard.types.ts
 *
 * Types for the Admin Dashboard sovereign module.
 */

export interface DashboardStats {
    totalUsers: number
    activeUsers: number
    totalLessons: number
    systemHealth: 'healthy' | 'warning' | 'error'
}
