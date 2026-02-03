/**
 * Developer Store - مخزن المطور
 *
 * @description Zustand Store لإدارة حالة المطور
 * يستخدم Generic Store Factory لتقليل التكرار
 */

import { createAsyncStore } from '@/application/shared/store'
import { developerService } from '../services'
import type { DeveloperStats, APIEndpointInfo, ServiceInfo, PerformanceMetric } from '../types'

/**
 * Store لإحصائيات المطور
 */
export const useDeveloperStatsStore = createAsyncStore<DeveloperStats>({
  fetchFn: async () => {
    return await developerService.getDeveloperStats()
  },
  defaultErrorMessage: 'فشل جلب إحصائيات المطور',
  name: 'DeveloperStatsStore',
})

/**
 * Store لـ API Endpoints
 */
export const useAPIEndpointsStore = createAsyncStore<APIEndpointInfo[]>({
  fetchFn: async () => {
    return await developerService.getAPIEndpoints()
  },
  defaultErrorMessage: 'فشل جلب API Endpoints',
  name: 'APIEndpointsStore',
})

/**
 * Store لـ Services
 */
export const useServicesStore = createAsyncStore<ServiceInfo[]>({
  fetchFn: async () => {
    return await developerService.getServices()
  },
  defaultErrorMessage: 'فشل جلب Services',
  name: 'ServicesStore',
})

/**
 * Store لـ Performance Metrics
 */
export const usePerformanceStore = createAsyncStore<PerformanceMetric[]>({
  fetchFn: async () => {
    return await developerService.getPerformanceMetrics()
  },
  defaultErrorMessage: 'فشل جلب Performance Metrics',
  name: 'PerformanceStore',
})

/**
 * Combined Developer Store Hook
 *
 * يجمع جميع الـ stores الفرعية في hook واحد
 */
export const useDeveloperStore = () => {
  const statsStore = useDeveloperStatsStore()
  const endpointsStore = useAPIEndpointsStore()
  const servicesStore = useServicesStore()
  const performanceStore = usePerformanceStore()

  return {
    // Data
    stats: statsStore.data,
    endpoints: endpointsStore.data || [],
    services: servicesStore.data || [],
    performance: performanceStore.data || [],

    // Loading & Error
    isLoading:
      statsStore.isLoading ||
      endpointsStore.isLoading ||
      servicesStore.isLoading ||
      performanceStore.isLoading,
    error:
      statsStore.error || endpointsStore.error || servicesStore.error || performanceStore.error,

    // Actions
    fetchStats: statsStore.fetchData,
    fetchEndpoints: endpointsStore.fetchData,
    fetchServices: servicesStore.fetchData,
    fetchPerformance: performanceStore.fetchData,
    fetchAll: async () => {
      await Promise.all([
        statsStore.fetchData(),
        endpointsStore.fetchData(),
        servicesStore.fetchData(),
        performanceStore.fetchData(),
      ])
    },
    refresh: async () => {
      await Promise.all([
        statsStore.fetchData(),
        endpointsStore.fetchData(),
        servicesStore.fetchData(),
        performanceStore.fetchData(),
      ])
    },
    reset: () => {
      statsStore.reset()
      endpointsStore.reset()
      servicesStore.reset()
      performanceStore.reset()
    },
  }
}
