/**
 * Developer Service - خدمة المطور
 *
 * Frontend service للتفاعل مع Developer APIs
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/api'
import {
  DeveloperStats,
  APIEndpointInfo,
  ServiceInfo,
  PerformanceMetric,
} from '@/domain/types/developer.types'

class DeveloperService {
  /**
   * الحصول على إحصائيات المطور
   *
   * @returns DeveloperStats
   */
  async getDeveloperStats(): Promise<DeveloperStats> {
    return apiClient.get<DeveloperStats>('/developer/stats')
  }

  /**
   * الحصول على معلومات API Endpoints
   *
   * @returns قائمة API Endpoints
   */
  async getAPIEndpoints(): Promise<APIEndpointInfo[]> {
    const response = await apiClient.get<{ endpoints: APIEndpointInfo[]; count: number }>(
      '/developer/api-endpoints'
    )
    return response.endpoints
  }

  /**
   * الحصول على معلومات Services
   *
   * @returns قائمة Services
   */
  async getServices(): Promise<ServiceInfo[]> {
    const response = await apiClient.get<{ services: ServiceInfo[]; count: number }>(
      '/developer/services'
    )
    return response.services
  }

  /**
   * الحصول على Performance Metrics
   *
   * @returns قائمة Performance Metrics
   */
  async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
    const response = await apiClient.get<{ metrics: PerformanceMetric[]; count: number }>(
      '/developer/performance'
    )
    return response.metrics
  }
}

export const developerService = new DeveloperService()
