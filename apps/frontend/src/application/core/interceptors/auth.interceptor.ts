/**
 * Auth Interceptor - Proxy to SovereignAuthInterceptor
 * Maintaining backward compatibility while using the new encapsulated logic.
 */

import { RequestInterceptor, ResponseInterceptor } from '@/infrastructure/services/http'
import { sovereignAuthInterceptor } from '@/infrastructure/diagnostics/modules/network/SovereignAuthInterceptor'

export function createAuthRequestInterceptor(): RequestInterceptor {
  return sovereignAuthInterceptor.getRequestInterceptor()
}

export function createAuthResponseInterceptor(): ResponseInterceptor {
  return sovereignAuthInterceptor.getResponseInterceptor()
}

