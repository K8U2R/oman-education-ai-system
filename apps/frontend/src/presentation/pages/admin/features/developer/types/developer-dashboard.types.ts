/**
 * Developer Dashboard Types - أنواع Developer Dashboard
 *
 * أنواع TypeScript خاصة بـ Developer Dashboard Feature
 */

import type {
  DeveloperStats,
  APIEndpointInfo,
  ServiceInfo,
  PerformanceMetric,
} from '@/domain/types/developer.types'

/**
 * Re-export types من Domain
 */
export type { DeveloperStats, APIEndpointInfo, ServiceInfo, PerformanceMetric }

/**
 * Developer Tool - أداة المطور
 */
export interface DeveloperTool {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: () => void
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}
