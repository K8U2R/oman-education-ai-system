/**
 * Service Worker Service - خدمة Service Worker
 *
 * خدمة لإدارة Service Worker
 */

class ServiceWorkerService {
  private registration: ServiceWorkerRegistration | null = null

  /**
   * Register Service Worker
   */
  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      // Use logging service in production
      if (import.meta.env.PROD) {
        const { loggingService } = await import('./logging.service')
        loggingService.warn('Service Workers are not supported')
      } else {
        console.warn('[Service Worker] Service Workers are not supported')
      }
      return null
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })

      // Use logging service in production
      if (import.meta.env.PROD) {
        const { loggingService } = await import('./logging.service')
        loggingService.info('Service Worker registered successfully')
      } else {
        // eslint-disable-next-line no-console
        console.log('[Service Worker] Registered successfully')
      }

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              if (import.meta.env.PROD) {
                import('./logging.service').then(({ loggingService }) => {
                  loggingService.info('Service Worker: New version available')
                })
              } else {
                // eslint-disable-next-line no-console
                console.log('[Service Worker] New version available')
              }
              // You can show a notification to the user here
            }
          })
        }
      })

      return this.registration
    } catch (error) {
      // Use logging service instead of console.error
      const { loggingService } = await import('./logging.service')
      loggingService.error('Service Worker registration failed', error as Error)
      return null
    }
  }

  /**
   * Unregister Service Worker
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      const result = await this.registration.unregister()
      if (import.meta.env.PROD) {
        const { loggingService } = await import('./logging.service')
        loggingService.info('Service Worker unregistered')
      } else {
        // eslint-disable-next-line no-console
        console.log('[Service Worker] Unregistered')
      }
      this.registration = null
      return result
    } catch (error) {
      const { loggingService } = await import('./logging.service')
      loggingService.error('Service Worker unregistration failed', error as Error)
      return false
    }
  }

  /**
   * Update Service Worker
   */
  async update(): Promise<void> {
    if (!this.registration) {
      return
    }

    try {
      await this.registration.update()
      if (import.meta.env.PROD) {
        const { loggingService } = await import('./logging.service')
        loggingService.info('Service Worker update check completed')
      } else {
        // eslint-disable-next-line no-console
        console.log('[Service Worker] Update check completed')
      }
    } catch (error) {
      const { loggingService } = await import('./logging.service')
      loggingService.error('Service Worker update failed', error as Error)
    }
  }

  /**
   * Get Service Worker Registration
   */
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration
  }

  /**
   * Check if Service Worker is supported
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      if (import.meta.env.PROD) {
        const { loggingService } = await import('./logging.service')
        loggingService.warn('Notifications are not supported')
      } else {
        console.warn('[Service Worker] Notifications are not supported')
      }
      return 'denied'
    }

    if (Notification.permission === 'default') {
      return await Notification.requestPermission()
    }

    return Notification.permission
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(publicKey: string): Promise<PushSubscription | null> {
    if (!this.registration) {
      if (import.meta.env.PROD) {
        const { loggingService } = await import('./logging.service')
        loggingService.warn('Service Worker not registered')
      } else {
        console.warn('[Service Worker] Service Worker not registered')
      }
      return null
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      })

      if (import.meta.env.PROD) {
        const { loggingService } = await import('./logging.service')
        loggingService.info('Subscribed to push notifications')
      } else {
        // eslint-disable-next-line no-console
        console.log('[Service Worker] Subscribed to push notifications')
      }
      return subscription
    } catch (error) {
      const { loggingService } = await import('./logging.service')
      loggingService.error('Push subscription failed', error as Error)
      return null
    }
  }
}

export const serviceWorkerService = new ServiceWorkerService()
