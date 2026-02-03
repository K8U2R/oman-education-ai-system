/**
 * Admin Stats Store - مخزن إحصائيات الإدارة
 *
 * Store منفصل للإحصائيات باستخدام createAsyncStore
 */

import { createAsyncStore } from '@/application/shared/store'
import { adminService } from '../services'
import type { SystemStats, UserStats, ContentStats, UsageStats } from '../types'

/**
 * Store لإحصائيات النظام
 */
export const useSystemStatsStore = createAsyncStore<SystemStats>({
  fetchFn: async () => {
    return await adminService.getSystemStats()
  },
  defaultErrorMessage: 'فشل جلب إحصائيات النظام',
  name: 'SystemStatsStore',
})

/**
 * Store لإحصائيات المستخدمين
 */
export const useUserStatsStore = createAsyncStore<UserStats>({
  fetchFn: async () => {
    return await adminService.getUserStats()
  },
  defaultErrorMessage: 'فشل جلب إحصائيات المستخدمين',
  name: 'UserStatsStore',
})

/**
 * Store لإحصائيات المحتوى
 */
export const useContentStatsStore = createAsyncStore<ContentStats>({
  fetchFn: async () => {
    return await adminService.getContentStats()
  },
  defaultErrorMessage: 'فشل جلب إحصائيات المحتوى',
  name: 'ContentStatsStore',
})

/**
 * Store لإحصائيات الاستخدام
 */
export const useUsageStatsStore = createAsyncStore<UsageStats>({
  fetchFn: async () => {
    return await adminService.getUsageStats()
  },
  defaultErrorMessage: 'فشل جلب إحصائيات الاستخدام',
  name: 'UsageStatsStore',
})
