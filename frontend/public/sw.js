/**
 * Service Worker - Service Worker للتطبيق
 *
 * يدعم:
 * - Cache static assets (JS, CSS, images)
 * - Cache API responses (strategic caching)
 * - Offline support
 * - Background sync
 */

const CACHE_NAME = 'oman-education-v1'
const STATIC_CACHE_NAME = 'oman-education-static-v1'
const API_CACHE_NAME = 'oman-education-api-v1'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // CSS and JS will be added dynamically
]

// API endpoints to cache (strategic caching)
const CACHEABLE_API_PATTERNS = [
  /^\/api\/v1\/lessons\/?$/,
  /^\/api\/v1\/assessments\/?$/,
  /^\/api\/v1\/projects\/?$/,
]

/**
 * Install Event - Cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  
  // Force activation of new service worker
  self.skipWaiting()
})

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name !== CACHE_NAME &&
              name !== STATIC_CACHE_NAME &&
              name !== API_CACHE_NAME
            )
          })
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    })
  )
  
  // Take control of all pages immediately
  return self.clients.claim()
})

/**
 * Fetch Event - Intercept network requests
 */
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests (unless they're our API)
  if (url.origin !== location.origin && !url.pathname.startsWith('/api/')) {
    return
  }

  // Handle static assets
  if (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME))
    return
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    const isCacheable = CACHEABLE_API_PATTERNS.some((pattern) =>
      pattern.test(url.pathname)
    )

    if (isCacheable) {
      // Cache API responses with network-first strategy
      event.respondWith(networkFirstStrategy(request, API_CACHE_NAME))
    } else {
      // For non-cacheable APIs, use network only
      event.respondWith(fetch(request))
    }
    return
  }

  // Handle HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstStrategy(request, CACHE_NAME))
    return
  }

  // Default: network first
  event.respondWith(fetch(request))
})

/**
 * Cache First Strategy - Check cache first, fallback to network
 */
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)
    
    // Only cache successful responses
    if (response.status === 200) {
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error)
    
    // Return offline fallback if available
    const offlineFallback = await cache.match('/offline.html')
    if (offlineFallback) {
      return offlineFallback
    }
    
    throw error
  }
}

/**
 * Network First Strategy - Try network first, fallback to cache
 */
async function networkFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName)

  try {
    const response = await fetch(request)
    
    // Only cache successful responses
    if (response.status === 200) {
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', error)
    
    const cached = await cache.match(request)
    if (cached) {
      return cached
    }
    
    // Return offline fallback if available
    const offlineFallback = await cache.match('/offline.html')
    if (offlineFallback) {
      return offlineFallback
    }
    
    throw error
  }
}

/**
 * Background Sync - Sync data when online
 */
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag)
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData())
  }
})

/**
 * Sync data when online
 */
async function syncData() {
  try {
    // Get pending operations from IndexedDB
    // and sync them with the server
    console.log('[Service Worker] Syncing data...')
    // Implementation depends on your sync requirements
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error)
  }
}

/**
 * Push Notification - Handle push notifications
 */
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received')
  
  const data = event.data?.json() || { title: 'إشعار جديد', body: 'لديك إشعار جديد' }
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: data.tag || 'notification',
      data: data,
    })
  )
})

/**
 * Notification Click - Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked')
  
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  )
})

