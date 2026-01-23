/**
 * Dashboard Types - أنواع Dashboard
 *
 * أنواع TypeScript خاصة بـ Dashboard Feature
 */

import type {
  DashboardStats,
  SystemHealth,
} from '@/application/features/admin/services/admin-dashboard.service'

/**
 * Re-export types من Service
 */
export type { DashboardStats, SystemHealth }

/**
 * Quick Action - إجراء سريع
 */
export interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  path: string
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}
