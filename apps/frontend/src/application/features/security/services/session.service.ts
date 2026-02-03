/**
 * Session Service - خدمة الجلسات
 *
 * خدمة لإدارة الجلسات النشطة
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import type { ApiRequestConfig } from '@/infrastructure/services/api/types'
import { API_ENDPOINTS } from '@/domain/constants/api.constants'
import type { Session, SessionDetails, SessionFilter } from '../types/session.types'

class SessionService {
  /**
   * الحصول على جلسات المستخدم
   */
  async getUserSessions(params?: SessionFilter): Promise<Session[]> {
    const response = await apiClient.get<{ success: boolean; data: Session[] }>(
      API_ENDPOINTS.SESSIONS.LIST,
      { params }
    )
    return response.data || []
  }

  /**
   * الحصول على جميع الجلسات (Admin only)
   */
  async getAllSessions(params?: SessionFilter): Promise<Session[]> {
    const response = await apiClient.get<{ success: boolean; data: Session[] }>(
      API_ENDPOINTS.SESSIONS.ALL,
      { params }
    )
    return response.data || []
  }

  /**
   * الحصول على تفاصيل جلسة
   */
  async getSessionDetails(sessionId: string): Promise<SessionDetails> {
    const response = await apiClient.get<{ success: boolean; data: SessionDetails }>(
      API_ENDPOINTS.SESSIONS.BY_ID(sessionId)
    )
    return response.data || response
  }

  /**
   * إنهاء جلسة
   */
  async terminateSession(sessionId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SESSIONS.TERMINATE(sessionId))
  }

  /**
   * إنهاء جميع جلسات المستخدم
   */
  async terminateAllSessions(userId: string, excludeSessionId?: string): Promise<void> {
    const config = excludeSessionId ? { params: { excludeSessionId } } : undefined
    await apiClient.delete(
      API_ENDPOINTS.SESSIONS.TERMINATE_ALL(userId),
      config as ApiRequestConfig | undefined
    )
  }

  /**
   * إنهاء جميع الجلسات الأخرى (باستثناء الجلسة الحالية)
   */
  async terminateAllOtherSessions(userId: string): Promise<void> {
    // الحصول على الجلسة الحالية من localStorage أو cookie
    const currentSessionId = localStorage.getItem('current_session_id')
    await this.terminateAllSessions(userId, currentSessionId || undefined)
  }

  /**
   * تحديث جلسة
   */
  async refreshSession(
    sessionId: string,
    tokenHash: string,
    refreshTokenHash?: string,
    expiresAt?: Date
  ): Promise<Session> {
    const response = await apiClient.put<{ success: boolean; data: Session }>(
      API_ENDPOINTS.SESSIONS.REFRESH(sessionId),
      {
        tokenHash,
        refreshTokenHash,
        expiresAt: expiresAt?.toISOString(),
      }
    )
    return response.data || response
  }
}

export const sessionService = new SessionService()
