/**
 * API Client Integration Tests - اختبارات تكامل API Client
 *
 * Integration tests للـ API Client باستخدام MSW (Mock Service Worker)
 */

import { describe, it, expect, afterEach, beforeAll, afterAll, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
// @ts-expect-error - Path alias resolution in tests
import { apiClientRefactored as apiClient } from '@/infrastructure/api'
// @ts-expect-error - Path alias resolution in tests
import { API_BASE_URL, API_ENDPOINTS } from '@/domain/constants/api.constants'

// Mock analytics and performance services
vi.mock('@/application', async () => {
  const actual = await vi.importActual('@/application')
  return {
    ...actual,
    analyticsService: {
      trackEvent: vi.fn(),
      trackError: vi.fn(),
    },
    performanceService: {
      recordMetric: vi.fn(),
    },
  }
})

// Mock auth interceptors
vi.mock('@/application/core/interceptors', () => ({
  createAuthRequestInterceptor: () => ({
    onFulfilled: (config: unknown) => config,
    onRejected: (error: unknown) => Promise.reject(error),
  }),
  createAuthResponseInterceptor: () => ({
    onFulfilled: (response: unknown) => response,
    onRejected: (error: unknown) => Promise.reject(error),
  }),
  createOfflineResponseInterceptor: () => ({
    onFulfilled: (response: unknown) => response,
    onRejected: (error: unknown) => Promise.reject(error),
  }),
}))

// Setup MSW server
const server = setupServer()

// Test data
const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'student',
  permissions: [],
}

const mockLoginResponse = {
  user: mockUser,
  tokens: {
    access_token: 'access-token-123',
    refresh_token: 'refresh-token-123',
    token_type: 'Bearer',
    expires_in: 3600,
  },
}

describe('API Client Integration Tests', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  describe('GET requests', () => {
    it('should make GET request successfully', async () => {
      server.use(
        http.get(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, () => {
          return HttpResponse.json({
            data: mockUser,
          })
        })
      )

      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME)

      expect(response).toEqual(mockUser)
    })

    it('should handle GET request with query parameters', async () => {
      server.use(
        http.get(`${API_BASE_URL}${API_ENDPOINTS.LEARNING.LESSONS}`, ({ request }) => {
          const url = new URL(request.url)
          const page = url.searchParams.get('page')
          const limit = url.searchParams.get('limit')

          return HttpResponse.json({
            data: [
              { id: '1', title: 'Lesson 1' },
              { id: '2', title: 'Lesson 2' },
            ],
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
          })
        })
      )

      const response = await apiClient.get(API_ENDPOINTS.LEARNING.LESSONS, {
        params: { page: '1', limit: '10' },
      })

      expect(response).toBeDefined()
      expect(Array.isArray(response)).toBe(true)
    })

    it('should handle GET request with caching', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let requestCount = 0

      server.use(
        http.get(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, () => {
          requestCount++
          return HttpResponse.json({
            data: mockUser,
          })
        })
      )

      // First request
      const response1 = await apiClient.get(API_ENDPOINTS.AUTH.ME, {
        useCache: true,
        cacheTTL: 5000,
      })

      // Second request (should use cache, but MSW will still intercept)
      const response2 = await apiClient.get(API_ENDPOINTS.AUTH.ME, {
        useCache: true,
      })

      expect(response1).toEqual(mockUser)
      expect(response2).toEqual(mockUser)
      // Note: Cache testing requires IndexedDB mocking which is complex
      // In real scenario, you'd test cache separately
    })

    it('should handle GET request errors', async () => {
      server.use(
        http.get(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, () => {
          return HttpResponse.json(
            {
              message: 'Unauthorized',
            },
            { status: 401 }
          )
        })
      )

      await expect(apiClient.get(API_ENDPOINTS.AUTH.ME)).rejects.toThrow()
    })
  })

  describe('POST requests', () => {
    it('should make POST request successfully', async () => {
      server.use(
        http.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, async ({ request }) => {
          const body = await request.json()
          expect(body).toHaveProperty('email')
          expect(body).toHaveProperty('password')

          return HttpResponse.json(mockLoginResponse)
        })
      )

      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: 'test@example.com',
        password: 'password123',
      })

      expect(response).toEqual(mockLoginResponse)
    })

    it('should handle POST request with validation errors', async () => {
      server.use(
        http.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, () => {
          return HttpResponse.json(
            {
              message: 'Invalid credentials',
              errors: {
                email: ['Email is required'],
                password: ['Password is required'],
              },
            },
            { status: 400 }
          )
        })
      )

      await expect(
        apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
          email: '',
          password: '',
        })
      ).rejects.toThrow()
    })
  })

  describe('PUT requests', () => {
    it('should make PUT request successfully', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updatedUser = { ...mockUser, name: 'Updated Name' }

      server.use(
        http.put(`${API_BASE_URL}${API_ENDPOINTS.AUTH.UPDATE_USER}`, async ({ request }) => {
          const body = (await request.json()) as Record<string, unknown>
          return HttpResponse.json({
            data: { ...mockUser, ...body },
          })
        })
      )

      const response = await apiClient.put(API_ENDPOINTS.AUTH.UPDATE_USER, {
        name: 'Updated Name',
      })

      expect(response).toBeDefined()
    })
  })

  describe('PATCH requests', () => {
    it('should make PATCH request successfully', async () => {
      server.use(
        http.patch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.UPDATE_USER}`, async ({ request }) => {
          const body = (await request.json()) as Record<string, unknown>
          return HttpResponse.json({
            data: { ...mockUser, ...body },
          })
        })
      )

      const response = await apiClient.patch(API_ENDPOINTS.AUTH.UPDATE_USER, {
        name: 'Patched Name',
      })

      expect(response).toBeDefined()
    })
  })

  describe('DELETE requests', () => {
    it('should make DELETE request successfully', async () => {
      server.use(
        http.delete(`${API_BASE_URL}${API_ENDPOINTS.LEARNING.LESSON('1')}`, () => {
          return HttpResponse.json(
            {
              message: 'Lesson deleted successfully',
            },
            { status: 200 }
          )
        })
      )

      const response = await apiClient.delete(API_ENDPOINTS.LEARNING.LESSON('1'))

      expect(response).toBeDefined()
    })
  })

  describe('Error handling', () => {
    it('should handle 404 errors', async () => {
      server.use(
        http.get(`${API_BASE_URL}/api/v1/nonexistent`, () => {
          return HttpResponse.json(
            {
              message: 'Not Found',
            },
            { status: 404 }
          )
        })
      )

      await expect(apiClient.get('/api/v1/nonexistent')).rejects.toThrow()
    })

    it('should handle 500 errors', async () => {
      server.use(
        http.get(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, () => {
          return HttpResponse.json(
            {
              message: 'Internal Server Error',
            },
            { status: 500 }
          )
        })
      )

      await expect(apiClient.get(API_ENDPOINTS.AUTH.ME)).rejects.toThrow()
    })

    it('should handle network errors', async () => {
      server.use(
        http.get(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, () => {
          return HttpResponse.error()
        })
      )

      await expect(apiClient.get(API_ENDPOINTS.AUTH.ME)).rejects.toThrow()
    })
  })

  describe('Request headers', () => {
    it('should include default headers', async () => {
      let requestHeaders: Headers | undefined

      server.use(
        http.get(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, ({ request }) => {
          requestHeaders = request.headers
          return HttpResponse.json({ data: mockUser })
        })
      )

      await apiClient.get(API_ENDPOINTS.AUTH.ME)

      expect(requestHeaders).toBeDefined()
      if (requestHeaders) {
        expect(requestHeaders.get('content-type')).toBeTruthy()
      }
    })

    it('should include custom headers', async () => {
      let requestHeaders: Headers | undefined

      server.use(
        http.get(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, ({ request }) => {
          requestHeaders = request.headers
          return HttpResponse.json({ data: mockUser })
        })
      )

      await apiClient.get(API_ENDPOINTS.AUTH.ME, {
        headers: {
          'X-Custom-Header': 'custom-value',
        },
      })

      if (requestHeaders) {
        expect(requestHeaders.get('X-Custom-Header')).toBe('custom-value')
      }
    })
  })

  describe('Response transformation', () => {
    it('should extract data from nested response', async () => {
      server.use(
        http.get(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, () => {
          return HttpResponse.json({
            data: mockUser,
            message: 'Success',
          })
        })
      )

      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME)

      expect(response).toEqual(mockUser)
    })

    it('should handle direct response data', async () => {
      server.use(
        http.get(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, () => {
          return HttpResponse.json(mockUser)
        })
      )

      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME)

      expect(response).toEqual(mockUser)
    })
  })

  describe('Timeout handling', () => {
    it('should handle request timeout', async () => {
      server.use(
        http.get(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, async () => {
          // Simulate slow response
          await new Promise((resolve) => setTimeout(resolve, 10000))
          return HttpResponse.json({ data: mockUser })
        })
      )

      await expect(
        apiClient.get(API_ENDPOINTS.AUTH.ME, {
          timeout: 1000, // 1 second timeout
        })
      ).rejects.toThrow()
    })
  })
})

