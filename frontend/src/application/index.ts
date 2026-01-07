/**
 * Application Layer - طبقة التطبيق
 *
 * تصدير مركزي لجميع مكونات Application Layer
 *
 * الهيكلة الجديدة (2026):
 * - core/         : النواة النظامية
 * - features/     : الميزات المستقلة
 * - shared/       : المشترك بين الميزات
 */

// Core Exports
export * from './core/interceptors'
export * from './core/services/system'
export * from './core/services/ui'

// Shared Exports
export * from './shared/hooks'

// Features Exports
// Auth
export * from './features/auth/hooks'
export * from './features/auth/services'

// Learning
export * from './features/learning/hooks'
export * from './features/learning/services'

// Storage
export * from './features/storage/hooks'
export * from './features/storage/services'

// Notifications
export * from './features/notifications/services'

// Admin
export * from './features/admin/services'

// Developer
export * from './features/developer/services'
// Rename PerformanceMetric to avoid conflict with core PerformanceMetric
export type { PerformanceMetric as DeveloperPerformanceMetric } from './features/developer/services'

// Office
export * from './features/office/hooks'
export * from './features/office/services'

// Projects
export * from './features/projects/hooks'
export * from './features/projects/services'

// Security
export * from './features/security'
