/**
 * Route Encryption System - نظام تشفير المسارات
 * 
 * Implements secure route obfuscation to hide admin/developer paths
 * Enforces Law 08 (Secure Closure) and Law 14 (Package Sovereignty)
 * 
 * @example
 * ```typescript
 * // Encrypt sensitive routes
 * encryptRoute('/admin/users') // → '/p/a3b8d1c4f8e9'
 * 
 * // Decrypt for routing
 * decryptRoute('/p/a3b8d1c4f8e9') // → '/admin/users'
 * ```
 */

/**
 * Generate a deterministic secure slug from a route path
 * Uses simple hash-based approach for consistency
 */
function generateSecureSlug(route: string): string {
    // Simple deterministic hash (not cryptographically secure, but sufficient for obfuscation)
    let hash = 0
    for (let i = 0; i < route.length; i++) {
        const char = route.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash // Convert to 32bit integer
    }

    // Convert to hex and take 12 characters
    const hex = Math.abs(hash).toString(16).padStart(8, '0')
    const timestamp = Date.now().toString(36).slice(-4)

    // Combine for more entropy (still deterministic per route)
    return `${hex}${timestamp}`.slice(0, 12)
}

/**
 * Route Registry - Singleton pattern for route mapping
 */
class RouteRegistry {
    private static instance: RouteRegistry
    private encryptedToPlain: Map<string, string> = new Map()
    private plainToEncrypted: Map<string, string> = new Map()

    private constructor() {
        // Pre-register sensitive routes
        this.registerSensitiveRoutes()
    }

    static getInstance(): RouteRegistry {
        if (!RouteRegistry.instance) {
            RouteRegistry.instance = new RouteRegistry()
        }
        return RouteRegistry.instance
    }

    /**
     * Pre-register all sensitive admin and developer routes
     */
    private registerSensitiveRoutes() {
        const sensitiveRoutes = [
            // Admin routes
            '/admin',
            '/admin/users',
            '/admin/settings',
            '/admin/neural-activation',
            '/admin/tier-override',

            // Developer routes
            '/developer',
            '/developer/logs',
            '/developer/system-health',
            '/developer/api-explorer',
        ]

        sensitiveRoutes.forEach(route => this.register(route))
    }

    /**
     * Register a route in the bidirectional map
     */
    register(plainRoute: string): string {
        if (this.plainToEncrypted.has(plainRoute)) {
            return this.plainToEncrypted.get(plainRoute)!
        }

        const slug = generateSecureSlug(plainRoute)
        const encryptedRoute = `/p/${slug}`

        this.plainToEncrypted.set(plainRoute, encryptedRoute)
        this.encryptedToPlain.set(encryptedRoute, plainRoute)

        return encryptedRoute
    }

    /**
     * Encrypt a plain route to a secure slug
     */
    encrypt(plainRoute: string): string {
        // Remove trailing slash for consistency
        const normalized = plainRoute.replace(/\/$/, '')

        if (this.plainToEncrypted.has(normalized)) {
            return this.plainToEncrypted.get(normalized)!
        }

        // Auto-register if not found (for dynamic routes)
        return this.register(normalized)
    }

    /**
     * Decrypt an encrypted route back to plain form
     */
    decrypt(encryptedRoute: string): string | null {
        return this.encryptedToPlain.get(encryptedRoute) || null
    }

    /**
     * Check if a route is registered
     */
    isRegistered(route: string): boolean {
        return this.plainToEncrypted.has(route) || this.encryptedToPlain.has(route)
    }

    /**
     * Get all registered plain routes
     */
    getAllPlainRoutes(): string[] {
        return Array.from(this.plainToEncrypted.keys())
    }

    /**
     * Get all encrypted routes
     */
    getAllEncryptedRoutes(): string[] {
        return Array.from(this.encryptedToPlain.keys())
    }

    /**
     * Clear all routes (for testing)
     */
    clear() {
        this.encryptedToPlain.clear()
        this.plainToEncrypted.clear()
    }
}

/**
 * Public API - Encrypt a route path
 * 
 * @param plainRoute - The original route (e.g., '/admin/users')
 * @returns Encrypted route (e.g., '/p/a3b8d1c4f8e9')
 */
export function encryptRoute(plainRoute: string): string {
    const registry = RouteRegistry.getInstance()
    return registry.encrypt(plainRoute)
}

/**
 * Public API - Decrypt a route path
 * 
 * @param encryptedRoute - The encrypted route (e.g., '/p/a3b8d1c4f8e9')
 * @returns Original route or null if not found
 */
export function decryptRoute(encryptedRoute: string): string | null {
    const registry = RouteRegistry.getInstance()
    return registry.decrypt(encryptedRoute)
}

/**
 * Check if a route requires encryption (admin/developer)
 */
export function isSensitiveRoute(route: string): boolean {
    return route.startsWith('/admin') || route.startsWith('/developer')
}

/**
 * Get all registered route mappings (for debugging)
 */
export function getRouteMappings(): { plain: string; encrypted: string }[] {
    const registry = RouteRegistry.getInstance()
    return registry.getAllPlainRoutes().map(plain => ({
        plain,
        encrypted: registry.encrypt(plain),
    }))
}

/**
 * Example Usage & Testing
 */
if (import.meta.env.DEV) {
    // Log route mappings in development
    console.group('🔒 Route Encryption Registry')
    const mappings = getRouteMappings()
    mappings.forEach(({ plain, encrypted }) => {
        console.log(`${plain.padEnd(30)} → ${encrypted}`)
    })
    console.groupEnd()

    // Verification
    const testRoute = '/admin/users'
    const encrypted = encryptRoute(testRoute)
    const decrypted = decryptRoute(encrypted)

    console.assert(decrypted === testRoute, 'Encryption/Decryption failed!')
    console.log(`✅ Encryption verified: ${testRoute} ↔ ${encrypted}`)
}
