/**
 * Whitelist Service - خدمة القائمة البيضاء
 *
 * Application Service للقائمة البيضاء
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { WHITELIST_ENDPOINTS } from '../constants'
import type {
  WhitelistEntry,
  CreateWhitelistEntryRequest,
  UpdateWhitelistEntryRequest,
  WhitelistListQuery,
  WhitelistListResponse,
} from '../types'
import type { ApiResponse } from '@/domain/types/api.types'

class WhitelistService {
  /**
   * الحصول على جميع الإدخالات
   */
  async getAllEntries(query?: WhitelistListQuery): Promise<WhitelistListResponse> {
    const response = await apiClient.get<ApiResponse<WhitelistListResponse>>(
      WHITELIST_ENDPOINTS.LIST,
      { params: query }
    )

    if (!response.success || !response.data) {
      throw new Error(response.error || 'فشل جلب إدخالات القائمة البيضاء')
    }

    return response.data
  }

  /**
   * الحصول على إدخال بالمعرف
   */
  async getEntryById(id: string): Promise<WhitelistEntry> {
    const response = await apiClient.get<ApiResponse<WhitelistEntry>>(WHITELIST_ENDPOINTS.BY_ID(id))

    if (!response.success || !response.data) {
      throw new Error(response.error || 'فشل جلب إدخال القائمة البيضاء')
    }

    return response.data
  }

  /**
   * إنشاء إدخال جديد
   */
  async createEntry(data: CreateWhitelistEntryRequest): Promise<WhitelistEntry> {
    const response = await apiClient.post<ApiResponse<WhitelistEntry>>(
      WHITELIST_ENDPOINTS.LIST,
      data
    )

    if (!response.success || !response.data) {
      throw new Error(response.error || 'فشل إنشاء إدخال القائمة البيضاء')
    }

    return response.data
  }

  /**
   * تحديث إدخال موجود
   */
  async updateEntry(id: string, data: UpdateWhitelistEntryRequest): Promise<WhitelistEntry> {
    const response = await apiClient.put<ApiResponse<WhitelistEntry>>(
      WHITELIST_ENDPOINTS.BY_ID(id),
      data
    )

    if (!response.success || !response.data) {
      throw new Error(response.error || 'فشل تحديث إدخال القائمة البيضاء')
    }

    return response.data
  }

  /**
   * حذف إدخال
   */
  async deleteEntry(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(WHITELIST_ENDPOINTS.BY_ID(id))

    if (!response.success) {
      throw new Error(response.error || 'فشل حذف إدخال القائمة البيضاء')
    }
  }

  /**
   * تفعيل إدخال
   */
  async activateEntry(id: string): Promise<WhitelistEntry> {
    const response = await apiClient.post<ApiResponse<WhitelistEntry>>(
      WHITELIST_ENDPOINTS.ACTIVATE(id)
    )

    if (!response.success || !response.data) {
      throw new Error(response.error || 'فشل تفعيل إدخال القائمة البيضاء')
    }

    return response.data
  }

  /**
   * تعطيل إدخال
   */
  async deactivateEntry(id: string): Promise<WhitelistEntry> {
    const response = await apiClient.post<ApiResponse<WhitelistEntry>>(
      WHITELIST_ENDPOINTS.DEACTIVATE(id)
    )

    if (!response.success || !response.data) {
      throw new Error(response.error || 'فشل تعطيل إدخال القائمة البيضاء')
    }

    return response.data
  }

  /**
   * الحصول على الإدخالات المنتهية
   */
  async getExpiredEntries(): Promise<WhitelistEntry[]> {
    const response = await apiClient.get<ApiResponse<{ entries: WhitelistEntry[]; total: number }>>(
      WHITELIST_ENDPOINTS.EXPIRED
    )

    if (!response.success || !response.data) {
      throw new Error(response.error || 'فشل جلب الإدخالات المنتهية')
    }

    return response.data.entries
  }
}

export const whitelistService = new WhitelistService()
