/**
 * Network Interceptor Module - Phase 1 Stub
 * @law Law-7 (Diagnostic Protocol) - Network monitoring
 */

import type { SentinelCore } from '../../core/SentinelCore';

/**
 * Network Interceptor - Monitors HTTP traffic (Phase 1 stub)
 */
export class NetworkInterceptor {
    constructor(_sentinel: SentinelCore) {
        // Reserved for future use
    }

    public async start(): Promise<void> {
        console.log('[NetworkInterceptor] 🌐 Network monitoring ready (Phase 2)');
    }

    public async stop(): Promise<void> {
        // Placeholder
    }

    public getReport() {
        return {
            requests: [],
            failures: [],
            avgLatency: 0,
        };
    }
}
