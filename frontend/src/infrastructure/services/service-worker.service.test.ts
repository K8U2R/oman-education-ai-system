/**
 * Service Worker Service Tests - اختبارات خدمة Service Worker
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { serviceWorkerService } from './service-worker.service'

describe('ServiceWorkerService', () => {
  const mockRegistration = {
    unregister: vi.fn().mockResolvedValue(true),
    update: vi.fn().mockResolvedValue(undefined),
    pushManager: {
      subscribe: vi.fn().mockResolvedValue({ endpoint: 'test-endpoint' }),
    },
    installing: null,
    addEventListener: vi.fn(),
  } as unknown as ServiceWorkerRegistration

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock navigator.serviceWorker
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: vi.fn().mockResolvedValue(mockRegistration),
        controller: null,
      },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('isSupported', () => {
    it('should return true when serviceWorker is supported', () => {
      expect(serviceWorkerService.isSupported()).toBe(true)
    })

    it('should return false when serviceWorker is not supported', () => {
      Object.defineProperty(navigator, 'serviceWorker', {
        value: undefined,
        writable: true,
        configurable: true,
      })
      expect(serviceWorkerService.isSupported()).toBe(false)
    })
  })

  describe('register', () => {
    it('should register service worker successfully', async () => {
      const registration = await serviceWorkerService.register()
      expect(registration).toBe(mockRegistration)
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js', { scope: '/' })
    })

    it('should return null when serviceWorker is not supported', async () => {
      Object.defineProperty(navigator, 'serviceWorker', {
        value: undefined,
        writable: true,
        configurable: true,
      })

      const registration = await serviceWorkerService.register()
      expect(registration).toBeNull()
    })

    it('should return null when registration fails', async () => {
      const registerSpy = vi.spyOn(navigator.serviceWorker, 'register')
      registerSpy.mockRejectedValueOnce(new Error('Registration failed'))

      const registration = await serviceWorkerService.register()
      expect(registration).toBeNull()
    })

    it('should handle updatefound event', async () => {
      const newWorker = {
        state: 'installed',
        addEventListener: vi.fn(),
      } as unknown as ServiceWorker

      Object.defineProperty(mockRegistration, 'installing', {
        value: newWorker,
        writable: true,
        configurable: true,
      })
      await serviceWorkerService.register()

      expect(mockRegistration.addEventListener).toHaveBeenCalledWith(
        'updatefound',
        expect.any(Function)
      )
    })
  })

  describe('unregister', () => {
    it('should unregister service worker', async () => {
      await serviceWorkerService.register()
      const result = await serviceWorkerService.unregister()

      expect(result).toBe(true)
      expect(mockRegistration.unregister).toHaveBeenCalled()
    })

    it('should return false when not registered', async () => {
      const result = await serviceWorkerService.unregister()
      expect(result).toBe(false)
    })

    it('should return false when unregister fails', async () => {
      await serviceWorkerService.register()
      vi.mocked(mockRegistration.unregister).mockRejectedValueOnce(new Error('Unregister failed'))

      const result = await serviceWorkerService.unregister()
      expect(result).toBe(false)
    })
  })

  describe('update', () => {
    it('should update service worker', async () => {
      await serviceWorkerService.register()
      await serviceWorkerService.update()

      expect(mockRegistration.update).toHaveBeenCalled()
    })

    it('should not throw when not registered', async () => {
      await expect(serviceWorkerService.update()).resolves.not.toThrow()
    })
  })

  describe('getRegistration', () => {
    it('should return registration when registered', async () => {
      await serviceWorkerService.register()
      const registration = serviceWorkerService.getRegistration()

      expect(registration).toBe(mockRegistration)
    })

    it('should return null when not registered', () => {
      const registration = serviceWorkerService.getRegistration()
      expect(registration).toBeNull()
    })
  })

  describe('requestNotificationPermission', () => {
    it('should request notification permission', async () => {
      const requestPermissionSpy = vi.spyOn(Notification, 'requestPermission')
      requestPermissionSpy.mockResolvedValueOnce('granted')

      Object.defineProperty(Notification, 'permission', {
        value: 'default',
        writable: true,
        configurable: true,
      })

      const permission = await serviceWorkerService.requestNotificationPermission()
      expect(permission).toBe('granted')
      expect(requestPermissionSpy).toHaveBeenCalled()
    })

    it('should return existing permission when not default', async () => {
      Object.defineProperty(Notification, 'permission', {
        value: 'granted',
        writable: true,
        configurable: true,
      })

      const permission = await serviceWorkerService.requestNotificationPermission()
      expect(permission).toBe('granted')
    })

    it('should return denied when notifications are not supported', async () => {
      Object.defineProperty(window, 'Notification', {
        value: undefined,
        writable: true,
        configurable: true,
      })

      const permission = await serviceWorkerService.requestNotificationPermission()
      expect(permission).toBe('denied')
    })
  })

  describe('subscribeToPush', () => {
    it('should subscribe to push notifications', async () => {
      await serviceWorkerService.register()
      const publicKey = 'test-public-key'

      const subscription = await serviceWorkerService.subscribeToPush(publicKey)

      expect(subscription).toBeDefined()
      expect(mockRegistration.pushManager.subscribe).toHaveBeenCalledWith({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      })
    })

    it('should return null when not registered', async () => {
      const subscription = await serviceWorkerService.subscribeToPush('test-key')
      expect(subscription).toBeNull()
    })

    it('should return null when subscription fails', async () => {
      await serviceWorkerService.register()
      vi.mocked(mockRegistration.pushManager.subscribe).mockRejectedValueOnce(
        new Error('Subscribe failed')
      )

      const subscription = await serviceWorkerService.subscribeToPush('test-key')
      expect(subscription).toBeNull()
    })
  })
})
