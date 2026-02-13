/**
 * Auth Utils - أدوات مساعدة للمصادقة
 */

import { storageAdapter } from '@/infrastructure/services/storage'

/**
 * Dispatch ADS System Halt Event
 */
export const dispatchSystemHalt = (reason: string) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent('ADS:SYSTEM_HALT', {
                detail: {
                    reason,
                    code: 'EMERGENCY_STOP',
                    timestamp: new Date().toISOString(),
                },
            })
        )
    }
}

/**
 * Force Redirect to Login
 */
export const forceLogout = () => {
    storageAdapter.remove('access_token')
    storageAdapter.remove('refresh_token')
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.replace('/login')
    }
}
