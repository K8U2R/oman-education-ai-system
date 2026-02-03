/**
 * useSessions Hook Tests - اختبارات Hook الجلسات
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSessions } from './useSessions'
import { sessionService } from '../api/session.service'

// Mock dependencies
vi.mock('../services')

describe('useSessions', () => {
  const mockSessions = [
    {
      id: '1',
      userId: 'user-1',
      tokenHash: 'hash-1',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      deviceInfo: {
        type: 'desktop' as const,
        os: 'Windows',
        browser: 'Chrome',
      },
      createdAt: '2025-01-08T10:00:00Z',
      expiresAt: '2025-01-09T10:00:00Z',
      lastActivityAt: '2025-01-08T10:00:00Z',
      isActive: true,
      isCurrent: false,
      status: 'active' as const,
      riskLevel: 'low' as const,
      loginMethod: 'password' as const,
      loginAt: '2025-01-08T10:00:00Z',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(sessionService.getUserSessions).mockResolvedValue(mockSessions)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useSessions())

      expect(result.current.sessions).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('loadSessions', () => {
    it('should load sessions successfully', async () => {
      const { result } = renderHook(() => useSessions())

      await result.current.loadSessions()

      await waitFor(() => {
        expect(result.current.sessions).toEqual(mockSessions)
        expect(result.current.loading).toBe(false)
      })
    })

    it('should handle loading error', async () => {
      const error = new Error('Failed to load sessions')
      vi.mocked(sessionService.getUserSessions).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useSessions())

      await result.current.loadSessions()

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
        expect(result.current.loading).toBe(false)
      })
    })
  })

  describe('terminateSession', () => {
    it('should terminate session successfully', async () => {
      vi.mocked(sessionService.terminateSession).mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useSessions())

      await result.current.terminateSession('session-id')

      expect(sessionService.terminateSession).toHaveBeenCalledWith('session-id')
    })
  })

  describe('terminateAllSessions', () => {
    it('should terminate all sessions successfully', async () => {
      vi.mocked(sessionService.terminateAllSessions).mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useSessions())

      await result.current.terminateAllSessions('user-id')

      expect(sessionService.terminateAllSessions).toHaveBeenCalledWith('user-id')
    })
  })
})
